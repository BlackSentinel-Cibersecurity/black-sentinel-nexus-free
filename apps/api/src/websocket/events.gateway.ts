import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../common/jwt-secret';

@WebSocketGateway({
  cors: { origin: true },
  namespace: '/ws',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('EventsGateway');
  private connectedClients = new Map<
    string,
    { userId?: string; rooms: Set<string> }
  >();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // Validate origin
    const allowedOrigin =
      this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
    const origin = client.handshake.headers.origin;

    if (origin && !this.isOriginAllowed(origin, allowedOrigin)) {
      this.logger.warn(
        `Rejected connection from unauthorized origin: ${origin}`,
      );
      client.disconnect();
      return;
    }

    // Validate JWT token from handshake auth or query
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) {
      this.logger.warn(`Client ${client.id} disconnected: no token provided`);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, { secret: jwtSecret() });
      const userId = payload.sub;

      this.connectedClients.set(client.id, { userId, rooms: new Set() });
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
      client.emit('connected', {
        clientId: client.id,
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      this.logger.warn(`Client ${client.id} disconnected: invalid token`);
      client.disconnect();
    }
  }

  private isOriginAllowed(origin: string, allowedOrigin: string): boolean {
    try {
      const allowed = new URL(allowedOrigin).origin;
      const requestOrigin = new URL(origin).origin;
      return allowed === requestOrigin;
    } catch {
      return false;
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) {
      client.disconnect();
      return { event: 'error', data: { message: 'Not authenticated' } };
    }

    // SECURITY FIX: handleConnection already verifies the JWT, but nothing
    // stopped an authenticated client from joining ANY room by name,
    // including another user's private notification room
    // (`user:${otherUserId}`, see broadcastNotification below) — a client
    // could just guess/enumerate ids and read someone else's notifications.
    if (
      data.room.startsWith('user:') &&
      data.room !== `user:${clientInfo.userId}`
    ) {
      this.logger.warn(
        `Client ${client.id} (user ${clientInfo.userId}) denied join of ${data.room}`,
      );
      return { event: 'error', data: { message: 'Forbidden' } };
    }

    client.join(data.room);
    clientInfo.rooms.add(data.room);
    this.logger.log(`Client ${client.id} joined room: ${data.room}`);
    return { event: 'joined', data: { room: data.room } };
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) clientInfo.rooms.delete(data.room);
    return { event: 'left', data: { room: data.room } };
  }

  broadcastNewEvent(event: any) {
    this.server?.to('events').emit('event.new', event);
    this.server?.to('dashboard').emit('event.new', event);
  }

  broadcastNewAlert(alert: any) {
    this.server?.to('alerts').emit('alert.new', alert);
    this.server?.to('dashboard').emit('alert.new', alert);
  }

  broadcastAlertUpdate(alert: any) {
    this.server?.to('alerts').emit('alert.updated', alert);
    this.server?.to('dashboard').emit('alert.updated', alert);
  }

  broadcastNewIncident(incident: any) {
    this.server?.to('incidents').emit('incident.new', incident);
    this.server?.to('dashboard').emit('incident.new', incident);
  }

  broadcastIncidentUpdate(incident: any) {
    this.server?.to('incidents').emit('incident.updated', incident);
    this.server?.to('dashboard').emit('incident.updated', incident);
  }

  broadcastMetricUpdate(data: any) {
    this.server?.to('dashboard').emit('metrics.update', data);
  }

  broadcastNotification(userId: string, notification: any) {
    this.server?.to(`user:${userId}`).emit('notification', notification);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}

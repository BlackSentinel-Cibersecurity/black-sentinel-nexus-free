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

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('EventsGateway');
  private connectedClients = new Map<string, { userId?: string; rooms: Set<string> }>();

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, { rooms: new Set() });
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { clientId: client.id, timestamp: new Date().toISOString() });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    client.join(data.room);
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) clientInfo.rooms.add(data.room);
    this.logger.log(`Client ${client.id} joined room: ${data.room}`);
    return { event: 'joined', data: { room: data.room } };
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
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

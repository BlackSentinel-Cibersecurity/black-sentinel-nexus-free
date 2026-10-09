import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from '../../database/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {
    this.seedAdmin();
  }

  // SECURITY FIX: the first admin used to be seeded with the published
  // password 'Admin@123'. It now takes ADMIN_PASSWORD (12+ characters) or, when
  // that is not set, a random password printed once in this log on first start.
  private async seedAdmin() {
    const email = process.env.ADMIN_EMAIL?.trim() || 'admin@blacksentinel.io';
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) return;
    const configured = process.env.ADMIN_PASSWORD?.trim();
    const password =
      configured && configured.length >= 12
        ? configured
        : randomBytes(12).toString('base64url');
    await this.userRepo.save(
      this.userRepo.create({
        email,
        name: 'Admin',
        password: await bcrypt.hash(password, 10),
        role: 'admin',
      }),
    );
    if (configured && configured.length >= 12) {
      this.logger.log(
        `Admin user created: ${email} (password from ADMIN_PASSWORD)`,
      );
    } else {
      this.logger.warn(
        `Admin user created: ${email} / ${password}  <- shown only this once; sign in and change it under Settings.`,
      );
    }
  }

  async login(
    email: string,
    password: string,
    ip?: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'role', 'isActive'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is disabled');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    await this.auditService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'login',
      resource: 'auth',
      ipAddress: ip,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // SECURITY FIX: self-registration used to accept a `role` from the request
  // body, so anyone who could reach the API could sign up as an admin. New
  // accounts are always analysts; an admin promotes them under Users.
  async register(
    email: string,
    name: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');
    if (!password || password.length < 8)
      throw new ConflictException('Password must be at least 8 characters');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.save(
      this.userRepo.create({
        email,
        name,
        password: hash,
        role: 'analyst',
      }),
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async findAllUsers(): Promise<any[]> {
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password, ...u }) => u);
  }
}

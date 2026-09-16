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

  private async seedAdmin() {
    const exists = await this.userRepo.findOne({
      where: { email: 'admin@blacksentinel.io' },
    });
    if (!exists) {
      const hash = await bcrypt.hash('Admin@123', 10);
      await this.userRepo.save(
        this.userRepo.create({
          email: 'admin@blacksentinel.io',
          name: 'Admin',
          password: hash,
          role: 'admin',
        }),
      );
      this.logger.log('Admin user seeded: admin@blacksentinel.io');
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

  async register(
    email: string,
    name: string,
    password: string,
    role?: string,
  ): Promise<{ access_token: string; user: any }> {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.save(
      this.userRepo.create({
        email,
        name,
        password: hash,
        role: (role as any) || 'analyst',
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

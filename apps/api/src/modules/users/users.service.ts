import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<any[]> {
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password, ...u }) => u);
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }): Promise<any> {
    // FREE VERSION: Max 3 users
    const MAX_USERS_FREE = 3;
    const totalUsers = await this.userRepo.count();
    if (totalUsers >= MAX_USERS_FREE) {
      throw new BadRequestException(
        `Free version limited to ${MAX_USERS_FREE} users. Upgrade to Enterprise for unlimited users.`,
      );
    }

    const exists = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (exists) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save(
      this.userRepo.create({
        email: data.email,
        name: data.name,
        password: hash,
        role: data.role || 'analyst',
      }),
    );

    const { password, ...result } = user;
    return result;
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      isActive?: boolean;
    },
  ): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (data.email && data.email !== user.email) {
      const exists = await this.userRepo.findOne({
        where: { email: data.email },
      });
      if (exists) throw new ConflictException('Email already in use');
    }

    Object.assign(user, data);
    const saved = await this.userRepo.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    if (newPassword.length < 8)
      throw new BadRequestException('Password must be at least 8 characters');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'admin')
      throw new BadRequestException('Cannot delete admin user');
    await this.userRepo.remove(user);
  }

  async getStats() {
    const users = await this.userRepo.find();
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const byRole: Record<string, number> = {};
    for (const u of users) {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
    }
    return { total, active, inactive: total - active, byRole };
  }
}

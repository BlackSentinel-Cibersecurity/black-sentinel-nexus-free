import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from '../../database/entities/user-settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private settingsRepo: Repository<UserSettings>,
  ) {}

  async getOrCreate(userId: string): Promise<UserSettings> {
    let settings = await this.settingsRepo.findOne({ where: { userId } });
    if (!settings) {
      settings = await this.settingsRepo.save(
        this.settingsRepo.create({ userId }),
      );
    }
    return settings;
  }

  async update(
    userId: string,
    data: Partial<UserSettings>,
  ): Promise<UserSettings> {
    let settings = await this.settingsRepo.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settingsRepo.create({ userId, ...data });
    } else {
      Object.assign(settings, data);
    }
    return this.settingsRepo.save(settings);
  }

  async updateLanguage(
    userId: string,
    language: string,
  ): Promise<UserSettings> {
    return this.update(userId, { language });
  }

  async updateTimezone(
    userId: string,
    timezone: string,
  ): Promise<UserSettings> {
    return this.update(userId, { timezone });
  }

  async updateNotifications(
    userId: string,
    notifications: UserSettings['notifications'],
  ): Promise<UserSettings> {
    return this.update(userId, { notifications });
  }

  async updateSecurity(
    userId: string,
    security: UserSettings['security'],
  ): Promise<UserSettings> {
    return this.update(userId, { security });
  }
}

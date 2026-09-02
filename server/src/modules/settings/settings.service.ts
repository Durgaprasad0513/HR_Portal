import prisma from '../../config/database';

export class SettingsService {
  async getSettings() {
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {}
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const existing = await this.getSettings();
    return prisma.systemSettings.update({
      where: { id: existing.id },
      data: {
        minPasswordLength: data.minPasswordLength,
        requireUppercase: data.requireUppercase,
        requireNumbers: data.requireNumbers,
        requireSpecialChars: data.requireSpecialChars,
        passwordExpiryDays: data.passwordExpiryDays,
      }
    });
  }
}

export const settingsService = new SettingsService();

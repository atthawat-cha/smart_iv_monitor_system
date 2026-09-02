import { Injectable } from "@nestjs/common";

// Telegram Bot API only in MVP; LINE OA/Email/Push are Phase 2/3 (PRD, MVP Scope Checklist).
@Injectable()
export class NotificationService {
  async sendTelegramAlert(chatId: string, message: string): Promise<void> {
    throw new Error("not implemented");
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Alert types: critical_low, empty, device_offline, occlusion_suspected (Database.md).
// Detection must debounce to avoid alert spam on noisy readings (Application Architecture.md).
@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.alert.findMany({ orderBy: { createdAt: "desc" } });
  }

  markRead(id: string) {
    return this.prisma.alert.update({ where: { id }, data: { isRead: true } });
  }

  resolve(id: string) {
    return this.prisma.alert.update({ where: { id }, data: { resolvedAt: new Date() } });
  }

  /** Evaluate current IvStatus/Device state and raise a debounced alert if needed. */
  async evaluate(bedId: string): Promise<void> {
    throw new Error("not implemented");
  }
}

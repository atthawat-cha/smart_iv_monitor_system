import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async dailyStats(): Promise<unknown> {
    throw new Error("not implemented");
  }

  async consumptionTrend(): Promise<unknown> {
    throw new Error("not implemented");
  }

  async wardDistribution(): Promise<unknown> {
    throw new Error("not implemented");
  }

  async deviceReliability(): Promise<unknown> {
    throw new Error("not implemented");
  }

  async nurseWorkload(): Promise<unknown> {
    throw new Error("not implemented");
  }
}

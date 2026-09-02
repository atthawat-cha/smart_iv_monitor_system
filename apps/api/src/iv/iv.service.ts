import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Single source of truth for remaining %, flow rate, estimated-time-empty, and priority score.
// alert/socket modules subscribe to this output — they must not recompute it (Application Architecture.md).
//
// priority_score = (100 - remaining_percent)*0.6 + (flow_rate*0.2) + (minutes_to_empty*-0.2)   (Database.md)
@Injectable()
export class IvService {
  constructor(private readonly prisma: PrismaService) {}

  findAllStatus() {
    return this.prisma.ivStatus.findMany();
  }

  getPriorityQueue() {
    return this.prisma.ivStatus.findMany({ orderBy: { priorityScore: "desc" } });
  }

  /** Recompute IvStatus for a bed from a new telemetry reading. Called by DeviceService on ingest. */
  async recomputeFromReading(bedId: string, weight: number): Promise<void> {
    throw new Error("not implemented");
  }
}

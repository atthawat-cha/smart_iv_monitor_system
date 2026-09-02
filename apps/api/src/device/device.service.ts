import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IvService } from "../iv/iv.service";
import { AlertService } from "../alert/alert.service";
import type { TelemetryPayload } from "./telemetry.controller";

@Injectable()
export class DeviceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ivService: IvService,
    private readonly alertService: AlertService,
  ) {}

  findAll() {
    return this.prisma.device.findMany();
  }

  findOne(id: string) {
    return this.prisma.device.findUnique({ where: { id } });
  }

  /** Store raw reading, recompute IvStatus, then let AlertService evaluate. */
  async ingestTelemetry(payload: TelemetryPayload): Promise<void> {
    throw new Error("not implemented");
  }

  /** Cron (every 10s per Application Architecture.md) — flag devices with stale last_seen as offline. */
  async detectOfflineDevices(): Promise<void> {
    throw new Error("not implemented");
  }
}

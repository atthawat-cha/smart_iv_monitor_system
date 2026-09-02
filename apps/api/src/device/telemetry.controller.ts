import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { DeviceKeyGuard } from "../common/guards/device-key.guard";
import { DeviceService } from "./device.service";

// POST /iot/telemetry (016 IoT/IoT.md) — device-key auth, real ESP32s and the
// mock-device-simulator (tools/mock-device-simulator) both hit this endpoint.
// Payload: { deviceId, weight, battery, rssi, firmwareVersion, timestamp }
export interface TelemetryPayload {
  deviceId: string;
  weight: number;
  battery: number;
  rssi: number;
  firmwareVersion: string;
  timestamp: string;
}

@Controller("iot")
@UseGuards(DeviceKeyGuard)
export class TelemetryController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post("telemetry")
  ingest(@Body() payload: TelemetryPayload) {
    return this.deviceService.ingestTelemetry(payload);
  }
}

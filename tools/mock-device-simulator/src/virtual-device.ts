import axios from "axios";
import { scenarios } from "./scenarios";
import type { DeviceConfig, DeviceState, TelemetryPayload } from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001/api/v1";
const DEVICE_API_KEY = process.env.DEVICE_API_KEY ?? "";
const SAMPLE_INTERVAL_MS = 1000; // mirrors real firmware's 1s local sample loop
const SEND_INTERVAL_MS = Number(process.env.SEND_INTERVAL_MS ?? 7000);

export class VirtualDevice {
  private state: DeviceState;
  private lastSendAt = 0;
  private timer?: NodeJS.Timeout;

  constructor(private readonly config: DeviceConfig) {
    this.state = {
      weight: config.startWeightGrams,
      battery: 100,
      rssi: -55,
      online: true,
      tick: 0,
    };
  }

  start(): void {
    this.timer = setInterval(() => this.onTick(), SAMPLE_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async onTick(): Promise<void> {
    const scenario = scenarios[this.config.scenario];
    this.state = scenario(this.state);

    if (!this.state.online) return; // "offline" scenario: stop sending, don't disconnect the process

    const isCritical = this.config.scenario === "critical-low" || this.config.scenario === "empty";
    const dueToSend = Date.now() - this.lastSendAt >= SEND_INTERVAL_MS;

    if (isCritical || dueToSend) {
      await this.sendTelemetry();
      this.lastSendAt = Date.now();
    }
  }

  private async sendTelemetry(): Promise<void> {
    const payload: TelemetryPayload = {
      deviceId: this.config.deviceId,
      weight: Number(this.state.weight.toFixed(1)),
      battery: Math.round(this.state.battery),
      rssi: this.state.rssi,
      firmwareVersion: this.config.firmwareVersion,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_BASE_URL}/iot/telemetry`, payload, {
        headers: { "x-device-key": DEVICE_API_KEY },
      });
    } catch (err) {
      console.error(`[${this.config.deviceId}] telemetry send failed:`, (err as Error).message);
    }
  }
}

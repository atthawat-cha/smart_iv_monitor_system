export type ScenarioName = "normal" | "critical-low" | "empty" | "offline" | "occlusion-suspected";

export interface DeviceConfig {
  deviceId: string;
  wardId: string;
  bedId: string;
  startWeightGrams: number;
  scenario: ScenarioName;
  firmwareVersion: string;
}

export interface DeviceState {
  weight: number;
  battery: number; // percent
  rssi: number; // dBm
  online: boolean;
  tick: number;
}

/** A scenario mutates state one 1s tick at a time. Pure function — easy to unit test/replicate. */
export type ScenarioFn = (state: DeviceState) => DeviceState;

// Exact wire format expected by POST /api/v1/iot/telemetry (016 IoT/IoT.md).
export interface TelemetryPayload {
  deviceId: string;
  weight: number;
  battery: number;
  rssi: number;
  firmwareVersion: string;
  timestamp: string;
}

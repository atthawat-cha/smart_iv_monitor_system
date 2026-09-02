#pragma once

// HTTP POST /api/v1/iot/telemetry, header x-device-key (016 IoT/IoT.md).
// Payload: { deviceId, weight, battery, rssi, firmwareVersion, timestamp }
namespace api_client {
  void begin();
  bool sendTelemetry(float weight, int batteryPercent);
}

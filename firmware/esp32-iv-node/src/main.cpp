// SMIS ESP32 IV Node — entry point.
// Philosophy: "Keep the Device Simple, Keep the Server Smart" (PRD §15.4) —
// this firmware only reads, filters, and reports; all remaining-%/flow-rate/ETE/priority
// calculation happens server-side (apps/api/src/iv).
#include <Arduino.h>
#include "wifi_manager/wifi_manager.h"
#include "sensor_manager/sensor_manager.h"
#include "battery_manager/battery_manager.h"
#include "api_client/api_client.h"
#include "device_status/device_status.h"
#include "storage_manager/storage_manager.h"
#include "ota_manager/ota_manager.h"

// Sample every 1s locally; send every 5-10s, or immediately on critical/empty/offline
// (016 IoT/IoT.md).
static const uint32_t SAMPLE_INTERVAL_MS = 1000;
static const uint32_t SEND_INTERVAL_MS = 7000;

void setup() {
  Serial.begin(115200);
  wifi_manager::begin();
  sensor_manager::begin();
  battery_manager::begin();
  storage_manager::begin();
}

void loop() {
  sensor_manager::sample();
  battery_manager::sample();

  static uint32_t lastSend = 0;
  bool critical = device_status::isCritical();
  if (critical || millis() - lastSend >= SEND_INTERVAL_MS) {
    api_client::sendTelemetry(sensor_manager::currentWeight(), battery_manager::currentPercent());
    lastSend = millis();
  }

  delay(SAMPLE_INTERVAL_MS);
}

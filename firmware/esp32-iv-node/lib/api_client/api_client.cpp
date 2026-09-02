#include "api_client.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

namespace api_client {
  void begin() {
    // TODO: load API_BASE_URL / DEVICE_API_KEY / DEVICE_ID from storage_manager
  }

  bool sendTelemetry(float weight, int batteryPercent) {
    // TODO: build JSON payload {deviceId, weight, battery, rssi, firmwareVersion, timestamp}
    //       and POST with header "x-device-key: <key>"
    return false;
  }
}

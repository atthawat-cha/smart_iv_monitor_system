#pragma once

#include <Arduino.h>

// Persists WiFi credentials, API base URL/key, and deviceId across reboots (NVS/Preferences).
namespace storage_manager {
  void begin();
  String getDeviceId();
  String getApiBaseUrl();
  String getDeviceApiKey();
}

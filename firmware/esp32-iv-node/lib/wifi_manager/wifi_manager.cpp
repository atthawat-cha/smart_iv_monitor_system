#include "wifi_manager.h"
#include <WiFi.h>

namespace wifi_manager {
  void begin() {
    // TODO: connect to hospital WiFi (SSID/password via storage_manager, not hardcoded)
  }

  bool isConnected() {
    return WiFi.status() == WL_CONNECTED;
  }
}

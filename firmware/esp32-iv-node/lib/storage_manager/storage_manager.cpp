#include "storage_manager.h"
#include <Preferences.h>

namespace {
  Preferences prefs;
}

namespace storage_manager {
  void begin() {
    prefs.begin("smis", false);
  }

  String getDeviceId() { return prefs.getString("deviceId", ""); }
  String getApiBaseUrl() { return prefs.getString("apiBaseUrl", ""); }
  String getDeviceApiKey() { return prefs.getString("deviceApiKey", ""); }
}

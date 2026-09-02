#include "battery_manager.h"

namespace {
  int batteryPercent = 100;
}

namespace battery_manager {
  void begin() {
    // TODO: configure ADC pin for battery voltage divider
  }

  void sample() {
    // TODO: read voltage, map to percent
  }

  int currentPercent() {
    return batteryPercent;
  }
}

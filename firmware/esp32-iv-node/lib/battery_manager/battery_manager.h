#pragma once

// 18650 Li-ion + TP4056 charger + AMS1117 regulator (Hardware & Firmware Architecture.md).
namespace battery_manager {
  void begin();
  void sample();
  int currentPercent();
}

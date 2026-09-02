#pragma once

// Not in MVP — OTA firmware update is a Phase 2 roadmap item (016 IoT/IoT.md).
namespace ota_manager {
  void begin();
  void checkForUpdate();
}

#include "device_status.h"
#include "../sensor_manager/sensor_manager.h"

namespace device_status {
  bool isCritical() {
    // TODO: compare sensor_manager::currentWeight() against a locally-cached critical threshold
    return false;
  }
}

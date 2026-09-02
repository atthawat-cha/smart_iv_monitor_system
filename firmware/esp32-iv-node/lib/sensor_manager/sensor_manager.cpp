#include "sensor_manager.h"
#include <HX711.h>

namespace {
  HX711 scale;
  float filteredWeight = 0;
}

namespace sensor_manager {
  void begin() {
    // TODO: scale.begin(DOUT_PIN, SCK_PIN); scale.set_scale(CALIBRATION_FACTOR); scale.tare();
  }

  void sample() {
    // TODO: moving-average filter over recent raw reads
  }

  float currentWeight() {
    return filteredWeight;
  }
}

#pragma once

// Reads the HX711-amplified load cell and applies a moving-average filter to reduce noise
// (013 Architecture/Hardware & Firmware Architecture.md).
namespace sensor_manager {
  void begin();
  void sample();
  float currentWeight(); // grams, filtered
}

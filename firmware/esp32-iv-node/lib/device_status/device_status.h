#pragma once

// Local-only critical check that forces an immediate telemetry send;
// authoritative critical/empty/offline detection stays server-side (apps/api/src/alert).
namespace device_status {
  bool isCritical();
}

# mock-device-simulator

Spawns a fleet of virtual ESP32 IV nodes that send telemetry to `apps/api`'s
`/api/v1/iot/telemetry` endpoint — same wire format and auth (`x-device-key`) as
real hardware — so the ingestion pipeline, Socket.IO broadcasts, and alert engine
can be exercised end-to-end without physical devices (Sprint 3, per `019 Development
Plan/Sprint List.md`).

## Run

Via docker-compose (recommended — talks to the local `api` service on the compose network):

```bash
docker compose --profile simulator up device-simulator
```

Standalone:

```bash
cp .env.example .env   # point API_BASE_URL at a running API
pnpm install
pnpm start
```

## Devices & scenarios

Virtual devices are defined in `src/config/devices.json`. Each one runs a `scenario`
(`src/scenarios/`) that drives its weight/battery/rssi over time:

| scenario | exercises |
|---|---|
| `normal` | steady clinical flow rate |
| `critical-low` | `alerts.type = critical_low` |
| `empty` | `alerts.type = empty` |
| `offline` | `alerts.type = device_offline` (stops sending mid-run) |
| `occlusion-suspected` | `alerts.type = occlusion_suspected` (weight stays flat) |

Add a device by adding an entry to `devices.json` — no code changes needed unless you
need a new scenario shape.

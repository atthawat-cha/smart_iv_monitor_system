# Smart IV Monitoring System (SMIS)

ระบบติดตามสารน้ำ (IV Fluid) อัจฉริยะ ช่วยให้บุคลากรทางการแพทย์รับรู้ปริมาณสารน้ำคงเหลือของแต่ละขวด/ถุงแบบ Real-Time ผ่านเซนเซอร์ IoT พร้อมระบบแจ้งเตือนล่วงหน้า เพื่อให้สามารถจัดการเปลี่ยนสารน้ำได้ทันก่อนที่จะหมด

เอกสารออกแบบฉบับเต็ม (PRD, Architecture, Database, API, UX/UI, Development Plan) อยู่ที่ Obsidian vault:
`01 Projects/01 Smart IV Monitoring (SMIS)` (โฟลเดอร์แม่ของ `000-Project-Code/`)

## โครงสร้าง

```
apps/
├── web/     # Next.js 15 dashboard (nurse/head-nurse UI)
└── api/     # NestJS backend (REST + Socket.IO + Prisma/PostgreSQL)

firmware/
└── esp32-iv-node/   # ESP32 + HX711 + Load Cell firmware (PlatformIO)

tools/
└── mock-device-simulator/   # Dockerized virtual-device fleet for testing telemetry/alerts without hardware

e2e/         # Playwright system tests (Sprint 6)
```

## Stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Recharts, Socket.IO Client
- **Backend:** NestJS, Prisma ORM, PostgreSQL, Socket.IO
- **IoT:** ESP32 DevKit V1, HX711, Load Cell — HTTP telemetry (`/api/v1/iot/telemetry`)
- **Notification:** Telegram Bot API (MVP)
- **Infra:** Docker Compose (local dev), Vercel (frontend), Railway/VPS (backend)

## Getting started (local dev)

```bash
pnpm install
cp .env.example .env
docker compose up            # postgres + api + web
# optional: simulate IV devices sending telemetry
docker compose --profile simulator up device-simulator
```

## Status

Scaffold only — folder/module layout matches the design docs; dependencies are not yet installed. See each app's `package.json` for the intended dependency set.

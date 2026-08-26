---
title: "SMIS — API Specification"
project: Smart IV Monitoring System (SMIS)
type: api
status: draft
version: 1.0
date: 2026-08-26
source: "[[Project Requirement Document (PRD) v2.1]] §10, §11.6, [[Database]], [[System Architecture]], [[Hardware & Firmware Architecture]], [[Feature List]]"
tags:
  - smis
  - api
  - specification
---

# API Specification — SMIS

> เดิมไฟล์นี้ว่าง — เอกสารนี้กำหนด REST API contract เต็มของ MVP โดย derive endpoint จาก entity ใน [[Database]] และ feature ใน [[Feature List]] (ทุก endpoint อ้าง FL-xxx) รวมถึง Telemetry endpoint ที่เดิม sketch ไว้ใน [[Hardware & Firmware Architecture]] §API Design ให้ตรงกับ schema จริง

**Base URL:** `https://api.smis.local/api/v1` (MVP; domain จริงกำหนดตอน Deploy — ดู [[System Architecture]] §5)
**Format:** JSON เท่านั้น · **Ref:** ดู [[Database]] สำหรับ field/enum เต็ม, [[Detailed Design]] สำหรับ algorithm ที่ endpoint เรียกใช้

---

# 0. Conventions

## 0.1 Authentication

| Client | Method | Header |
|---|---|---|
| Web Dashboard (Nurse/Head Nurse/Admin) | JWT (Bearer) — ออกจาก `/auth/login` | `Authorization: Bearer <token>` |
| IoT Device (ESP32) | Static Device API Key (MVP) | `x-device-key: <DEVICE_SECRET_KEY>` |

Production จะยกระดับ Device auth เป็น JWT Device Token + Certificate (PRD §11.6) — ไม่อยู่ใน MVP scope นี้

## 0.2 Response Envelope

```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "BED_NOT_FOUND",
    "message": "Bed with id xxx does not exist"
  }
}
```

## 0.3 Common Status Codes

| Code | ความหมาย |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized (token/key ไม่ถูกต้องหรือไม่มี) |
| 403 | Forbidden (role ไม่มีสิทธิ์) |
| 404 | Not Found |
| 409 | Conflict (เช่น bed_number ซ้ำใน ward เดียวกัน) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## 0.4 Pagination (list endpoint ทั้งหมด)

Query: `?page=1&limit=20` → Response `meta`: `{ page, limit, total, totalPages }`

## 0.5 Role Matrix (สรุปจาก PRD §7)

| Role | Ward/Bed/Device CRUD | Alert Ack/Resolve | Analytics | User Management |
|---|---|---|---|---|
| `nurse` | Read | Read/Update | Read | – |
| `head_nurse` | Read | Read/Update | Read (full) | – |
| `hospital_admin` | Read | Read | Read (full) | – |
| `system_admin` | Read/Write | Read/Update | Read | Read/Write |

---

# 1. Auth — `/auth` (FL-003)

## 1.1 `POST /auth/login`

Request

```json
{ "username": "nurse01", "password": "••••••" }
```

Response `200`

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "name": "Somsri", "role": "nurse" }
  }
}
```

`401` ถ้า username/password ไม่ถูกต้อง

## 1.2 `POST /auth/logout`

Invalidate session/token ปัจจุบัน — Response `200 { success: true }`

## 1.3 `GET /auth/me`

คืนข้อมูล user ปัจจุบันจาก token — ใช้ตอนโหลด Dashboard ครั้งแรก (FL-004)

---

# 2. Wards — `/wards` (FL-006)

## 2.1 `GET /wards`

Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ward 5A",
      "floor": "5",
      "totalBeds": 20,
      "criticalBeds": 2,
      "warningBeds": 3,
      "normalBeds": 15
    }
  ]
}
```

`totalBeds/criticalBeds/warningBeds/normalBeds` เป็น aggregate ที่ backend คำนวณจาก `beds` + `iv_status` ณ ขณะ request (ไม่ persist)

## 2.2 `POST /wards` — `system_admin` เท่านั้น

Request: `{ "name": "Ward 5A", "floor": "5" }` → `201`

## 2.3 `GET /wards/:id` · `PATCH /wards/:id` · `DELETE /wards/:id`

CRUD มาตรฐาน — `PATCH`/`DELETE` จำกัดเฉพาะ `system_admin`; `DELETE` ต้อง reject ถ้ายังมี `beds` ผูกอยู่ (`409`)

---

# 3. Beds — `/beds` (FL-007, FL-008, FL-009, FL-010)

## 3.1 `GET /wards/:wardId/beds`

Query Params:

| Param | ค่า | Feature |
|---|---|---|
| `sort` | `remaining_percent` \| `remaining_ml` \| `ete` \| `bed_number` \| `priority_score` | FL-009 |
| `order` | `asc` \| `desc` (default `desc` สำหรับ priority) | FL-009 |
| `status` | `critical` \| `warning` \| `normal` \| `offline` (comma-separated ได้) | FL-010 |

Response (1 item)

```json
{
  "id": "uuid",
  "bedNumber": "5A-01",
  "patientHn": "HN-001234",
  "status": "occupied",
  "device": { "id": "uuid", "deviceCode": "IV-5A-01", "status": "online" },
  "ivStatus": {
    "remainingMl": 275,
    "remainingPercent": 55,
    "flowRate": 4.2,
    "estimatedEmptyAt": "2026-08-26T15:20:00Z",
    "priorityScore": 42.5,
    "priorityBand": "P2",
    "colorStatus": "yellow",
    "isMobilityMode": false
  }
}
```

`priorityBand` (P1–P4) และ `colorStatus` (green/yellow/orange/red/gray) เป็น derived field ที่ backend แปลงจาก `remaining_percent`/`priority_score` ตามตารางใน PRD §10.5/§10.7 — ไม่ persist ใน DB (ดู [[Database]] §3)

## 3.2 `POST /wards/:wardId/beds` · `PATCH /beds/:id` · `DELETE /beds/:id` — `system_admin`

ใช้สร้าง/แก้/ลบ bed และผูก `patient_hn` / `device_id` (FL-007)

## 3.3 `GET /beds/:id/detail` (FL-011 — Patient Detail Drawer)

Query: `?range=30m|1h|24h` (default `1h`)

Response

```json
{
  "bed": { "bedNumber": "5A-01", "patientHn": "HN-001234" },
  "ivStatus": { "...": "เหมือน §3.1" },
  "history": [
    { "recordedAt": "2026-08-26T14:00:00Z", "remainingMl": 320, "remainingPercent": 64, "flowRate": 4.0 }
  ]
}
```

`history` มาจาก `iv_readings` filter ตาม `range` (FL-011, BL-206)

## 3.4 `POST /beds/:id/mobility-mode/start` · `POST /beds/:id/mobility-mode/stop` (FL-034)

ไม่มี body — set/unset `iv_status.is_mobility_mode`; ขณะ `true` Alert Engine suspend การสร้าง Critical/Empty alert สำหรับเตียงนี้ (PRD §10.10)

---

# 4. Devices — `/devices` (FL-012, FL-038)

## 4.1 `GET /devices`

Query: `?status=online|offline|low_battery`

Response (1 item)

```json
{
  "id": "uuid",
  "deviceCode": "IV-5A-01",
  "firmwareVersion": "1.0.0",
  "battery": 83,
  "rssi": -58,
  "lastSeen": "2026-08-26T14:59:55Z",
  "status": "online",
  "assignedBed": { "id": "uuid", "bedNumber": "5A-01" }
}
```

## 4.2 `POST /devices` (Provisioning, FL-012) · `PATCH /devices/:id` · `DELETE /devices/:id` — `system_admin`

`POST` ใช้ตอนลงทะเบียนอุปกรณ์ใหม่ก่อนผูกกับ bed:

```json
{ "deviceCode": "IV-5A-03" }
```

---

# 5. IoT Telemetry Ingestion — `/iot` (FL-014, FL-015)

## 5.1 `POST /iot/telemetry`

**Auth:** `x-device-key` header (ไม่ใช้ JWT) — ดู [[System Architecture]] §5.3

Request

```json
{
  "deviceId": "IV-5A-01",
  "weight": 325.4,
  "battery": 83,
  "rssi": -58,
  "firmwareVersion": "1.0.0",
  "timestamp": "2026-08-26T14:59:55Z"
}
```

Server ทำ (เรียงตาม [[Detailed Design]] §3.1):

1. Validate `x-device-key` และหา `device_id` จาก `deviceId` (= `devices.device_code`)
2. บันทึก `iv_readings` (raw + calculated) — append-only
3. คำนวณ Remaining %/ml, Flow Rate (smoothed), ETE, Priority Score → upsert `iv_status`
4. อัปเดต `devices.battery/rssi/last_seen/status`
5. ตรวจเงื่อนไข Alert (Critical/Empty/Offline/Occlusion) → insert `alerts` ถ้าเข้าเงื่อนไขและไม่ถูก debounce
6. Broadcast `iv:update` (เสมอ) + `alert:new` (ถ้ามี alert ใหม่) ผ่าน Socket.IO

Response `200`

```json
{ "success": true, "serverTime": "2026-08-26T14:59:56Z" }
```

`401` ถ้า `x-device-key` ไม่ถูกต้อง · `404` ถ้า `deviceId` ไม่ได้ provision ไว้ล่วงหน้า

---

# 6. IV Status & Priority Queue — `/iv-status` (FL-020–024)

## 6.1 `GET /iv-status`

คืน current state ของทุกเตียงทั้งโรงพยาบาล (ไม่ scope ตาม ward) — ใช้กับ Dashboard Overview (FL-004)

## 6.2 `GET /priority-queue`

คืนรายการเตียงเรียงตาม `priority_score desc` พร้อม `priorityBand` (P1–P4) — Dashboard ใช้แสดงเตียงที่ต้องดูแลก่อนไว้บนสุดเสมอ (FL-024, PRD §10.5)

Query: `?wardId=uuid` (optional, กรองเฉพาะ ward เดียว)

---

# 7. Alerts — `/alerts` (FL-028–033)

## 7.1 `GET /alerts`

Query: `?isRead=false&type=critical_low,empty&bedId=uuid`

Response item

```json
{
  "id": "uuid",
  "bedId": "uuid",
  "bedNumber": "5A-01",
  "type": "critical_low",
  "message": "Bed 5A-01 (HN-001234): Remaining 15%, ETE 12 min",
  "isRead": false,
  "resolvedAt": null,
  "createdAt": "2026-08-26T14:59:56Z"
}
```

## 7.2 `PATCH /alerts/:id/read`

Mark `is_read = true` — ไม่ต้องมี body

## 7.3 `PATCH /alerts/:id/resolve`

Set `resolved_at = now()` — ใช้ตอนพยาบาลจัดการ alert เสร็จแล้ว (เช่นเปลี่ยนถุงน้ำเกลือแล้ว)

---

# 8. Analytics — `/analytics` (FL-042–044)

| Endpoint | คำอธิบาย | Feature |
|---|---|---|
| `GET /analytics/daily-stats?date=2026-08-26` | จำนวน IV Change, Alert count, Avg ETE, Avg Response Time ของวันนั้น | FL-042 |
| `GET /analytics/consumption-trend?range=30m\|1h\|24h&wardId=` | Time-series สำหรับกราฟ | FL-043 |
| `GET /analytics/ward-distribution` | สรุป Normal/Warning/Critical/Empty ต่อ ward | FL-043 |
| `GET /analytics/device-reliability?deviceId=` | Uptime %, Offline Frequency, Battery trend | FL-039 |
| `GET /analytics/nurse-workload?from=&to=` | จำนวนงานแทรก/เวร, Avg Response Time — staffing evidence | FL-044 |

รายละเอียดการคำนวณแต่ละ metric อยู่ใน [[Detailed Design]] §2

---

# 9. WebSocket Events (Socket.IO)

**Namespace:** `/` · **Auth:** JWT ผ่าน `socket.handshake.auth.token` (client เดียวกับ Dashboard)

| Event | Payload | Trigger |
|---|---|---|
| `iv:update` | `{ bedId, ivStatus }` (schema เดียวกับ §3.1 `ivStatus`) | ทุกครั้งที่มี telemetry ใหม่เข้ามา |
| `alert:new` | `{ alert }` (schema เดียวกับ §7.1 item) | Alert Engine สร้าง alert ใหม่ |
| `device:offline` | `{ deviceId, bedId, lastSeen }` | Offline detector ตรวจพบ `last_seen` เกิน 60s (FL-030) |

รายละเอียด sequence เต็มของแต่ละ event อยู่ใน [[Detailed Design]] §3

---

# 10. Out of Scope (MVP) — Future Endpoints

| Endpoint (แนวคิด) | Phase | Feature |
|---|---|---|
| `POST /devices/:id/ota` | Phase 3+ | FL-040 OTA Firmware Update |
| MQTT topic-based ingestion (แทน `/iot/telemetry`) | Phase 3+ | FL-041 |
| `POST /notifications/line`, `/notifications/email` | Phase 2 | FL-035/036 |

---

## Related

- [[Database]]
- [[ER-Diagram]]
- [[System Architecture]]
- [[Detailed Design]]
- [[Feature List]]
- [[Hardware & Firmware Architecture]]
- [[Project Requirement Document (PRD) v2.1]]

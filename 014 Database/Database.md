---
title: "SMIS — Database Schema"
project: Smart IV Monitoring System (SMIS)
type: database
status: draft
version: 1.0
date: 2026-08-22
source: "[[Project Requirement Document (PRD) v2.1]] §15.3, [[Application Architecture]]"
tags:
  - smis
  - database
  - schema
---

# Database Schema — SMIS

> เดิมไฟล์นี้ว่าง — [[Project Requirement Document (PRD) v2.1]] §15.3/§20 ระบุให้ใช้ core entities จาก [[Application Architecture]] เป็นจุดเริ่มต้น เนื้อหานี้ขยายจาก 5 entities นั้น (`wards`, `beds`, `iv_status`, `alerts`, `devices`) ให้ครบตาม MVP scope จริงใน [[Feature List]] (FL-001–FL-039) และ [[Product Backlog]] (Sprint 1–4) — ทุก table อ้างกลับ Feature/Backlog ID เพื่อไม่ให้หลุด sync

**Engine:** PostgreSQL · **ORM:** Prisma (§15.1) · **Naming:** snake_case ตาม convention ที่ใช้ใน Application Architecture

ดูภาพ ER Diagram ที่ [[ER-Diagram]]

---

# 0. Entity Overview

| Entity | บทบาท | อ้างอิง |
|---|---|---|
| `users` | Staff login (Nurse/Head Nurse/Hospital Admin/System Admin) | FL-003, BL-103 |
| `wards` | หอผู้ป่วย | FL-006, BL-201 |
| `beds` | เตียงในแต่ละ Ward ผูกกับ Patient/Device | FL-007, BL-202 |
| `devices` | อุปกรณ์ IoT (ESP32 + Load Cell) | FL-012, FL-038, BL-207 |
| `iv_status` | สถานะ IV ปัจจุบันของแต่ละเตียง (current state, 1 row/bed) | FL-020–024, BL-302, BL-501 |
| `iv_readings` | ประวัติ telemetry แบบ time-series (append-only) | FL-011, FL-015, BL-302, BL-206 |
| `alerts` | Alert ที่ระบบสร้างต่อเตียง | FL-028–033, BL-401–406 |

> Phase 2/3 entities (เช่น bag-change event log, device reliability aggregate, predictive model output) **ยังไม่รวมใน MVP schema นี้** — ดู §5 Future Extension

---

# 1. Table Definitions

## 1.1 `users`

รองรับ FL-003 (Authentication) และ Role ตาม [[Project Requirement Document (PRD) v2.1]] §7

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `varchar(120)` | not null | ชื่อแสดงผล |
| `username` | `varchar(60)` | unique, not null | ใช้ login |
| `password_hash` | `varchar(255)` | not null | bcrypt/argon2 |
| `role` | `enum: user_role` | not null | ดู §2.1 |
| `is_active` | `boolean` | default `true` | ปิดสิทธิ์โดยไม่ลบ record |
| `created_at` | `timestamptz` | default `now()` | |

## 1.2 `wards`

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `name` | `varchar(80)` | not null | เช่น "Ward 5A" |
| `floor` | `varchar(20)` | nullable | |
| `created_at` | `timestamptz` | default `now()` | |

## 1.3 `beds`

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `ward_id` | `uuid` | FK → `wards.id`, not null, `on delete restrict` | |
| `bed_number` | `varchar(20)` | not null | unique ร่วมกับ `ward_id` |
| `patient_hn` | `varchar(30)` | nullable | ว่างได้ถ้าเตียงยังไม่มีผู้ป่วย |
| `device_id` | `uuid` | FK → `devices.id`, nullable, unique | เตียงหนึ่งผูก device ได้ตัวเดียว ณ ขณะหนึ่ง (FL-007) |
| `status` | `enum: bed_status` | not null, default `vacant` | ดู §2.2 |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

**Unique index:** `(ward_id, bed_number)`

## 1.4 `devices`

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `device_code` | `varchar(40)` | unique, not null | serial ของ ESP32 |
| `firmware_version` | `varchar(20)` | nullable | FL-038 |
| `battery` | `smallint` | nullable | % |
| `rssi` | `smallint` | nullable | dBm |
| `last_seen` | `timestamptz` | nullable | ใช้คำนวณ Offline Logic (>60s → offline) |
| `status` | `enum: device_status` | not null, default `offline` | ดู §2.3 |
| `created_at` | `timestamptz` | default `now()` | |

**Index:** `last_seen` (สำหรับ cron/worker ที่เช็ค offline device)

## 1.5 `iv_status`

Current-state ต่อเตียง 1 แถว/bed — อัปเดตทุกครั้งที่มี telemetry ใหม่เข้ามา (ไม่ใช่ history)

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `bed_id` | `uuid` | FK → `beds.id`, unique, not null | 1:1 กับ bed |
| `remaining_ml` | `numeric(6,1)` | not null | FL-020 |
| `remaining_percent` | `numeric(5,2)` | not null | FL-020 |
| `flow_rate` | `numeric(6,2)` | nullable | ml/min, หลัง smoothing (FL-019) |
| `estimated_empty_at` | `timestamptz` | nullable | ETE = Remaining Volume ÷ Flow Rate (FL-021) |
| `priority_score` | `numeric(6,2)` | not null, default `0` | สูตร §3, FL-023 |
| `is_mobility_mode` | `boolean` | default `false` | FL-034 — suspend alert ชั่วคราวเมื่อผู้ป่วยเคลื่อนย้าย |
| `updated_at` | `timestamptz` | default `now()` | |

**Index:** `priority_score desc` (สำหรับ Priority Queue sort, FL-024)

## 1.6 `iv_readings`

Time-series log ของ telemetry ดิบ — ใช้สำหรับ Historical Chart (FL-011, BL-206) และ Analytics ในอนาคต ไม่ถูก update ซ้ำ (append-only)

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `bigserial` | PK | ใช้ int sequence เพราะ insert rate สูง (ทุก 5–10s/device) |
| `bed_id` | `uuid` | FK → `beds.id`, not null | |
| `device_id` | `uuid` | FK → `devices.id`, not null | |
| `weight_g` | `numeric(7,1)` | not null | ค่าดิบจาก Load Cell/HX711 |
| `remaining_ml` | `numeric(6,1)` | not null | หลังคำนวณ |
| `remaining_percent` | `numeric(5,2)` | not null | หลังคำนวณ |
| `flow_rate` | `numeric(6,2)` | nullable | |
| `recorded_at` | `timestamptz` | not null, default `now()` | timestamp จาก payload (BL-301) |

**Index:** `(bed_id, recorded_at)` — สำหรับ query ช่วงเวลา (30min/1h/24h ตาม BL-206)

> Retention: ยังไม่กำหนดใน MVP — Phase 2 ควรพิจารณา partition ตามเดือนหรือ downsample เมื่อข้อมูลโต (ดู §5)

## 1.7 `alerts`

| Column | Type | Constraint | หมายเหตุ |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `bed_id` | `uuid` | FK → `beds.id`, not null | |
| `type` | `enum: alert_type` | not null | ดู §2.4 |
| `message` | `varchar(255)` | not null | ข้อความพร้อม Bed+Patient+Remaining+ETE (FL-031) |
| `is_read` | `boolean` | default `false` | |
| `resolved_at` | `timestamptz` | nullable | null = ยังเปิดอยู่ |
| `created_at` | `timestamptz` | default `now()` | |

**Index:** `(bed_id, is_read)`, `created_at desc`

---

# 2. Enums

## 2.1 `user_role`
`nurse` · `head_nurse` · `hospital_admin` · `system_admin` (ตาม PRD §7.1–7.4)

## 2.2 `bed_status`
`vacant` · `occupied` · `offline` (offline = device ผูกกับเตียงหลุดการเชื่อมต่อ)

## 2.3 `device_status`
`online` · `offline` · `low_battery` (ตาม Application Architecture §Device Monitoring)

## 2.4 `alert_type`
`critical_low` (IV < 20%, FL-028) · `empty` (IV = 0%, FL-029) · `device_offline` (FL-030) · `occlusion_suspected` (FL-033)

---

# 3. Derived Fields — Calculation Reference

ไม่ persist เป็น column แยก แต่ใช้ประกอบการคำนวณ `iv_status`/`iv_readings` (อ้างจาก Application Architecture §Priority Queue Engine):

```text
priority_score =
  (100 - remaining_percent) * 0.6
  + (flow_rate * 0.2)
  + (minutes_to_empty * -0.2)
```

`estimated_empty_at = now() + (remaining_ml / flow_rate) minutes` — คำนวณที่ backend ทุกครั้งที่มี telemetry ใหม่ (FL-015)

---

# 4. Relationships

```text
wards (1) ──< (N) beds
beds  (1) ──< (0..1) devices        [beds.device_id]
beds  (1) ──< (1)   iv_status       [1:1 current state]
beds  (1) ──< (N)   iv_readings     [time-series history]
beds  (1) ──< (N)   alerts
devices (1) ──< (N) iv_readings
```

`users` ไม่ผูกกับ ward/bed โดยตรงใน MVP (ไม่มี ward assignment ต่อ nurse ใน scope นี้ — ทุก authenticated user เห็นทุก ward ตาม FL-003/FL-004)

---

# 5. Future Extension (Phase 2/3 — ไม่รวมใน MVP)

- `device_reliability_daily` — aggregate uptime/offline frequency ต่อ device/วัน (FL-039 ขยายเชิงลึก)
- `bag_change_events` — log การเปลี่ยนถุงน้ำเกลือที่ตรวจจับอัตโนมัติ (FL-025, Phase 2)
- `predictions` — output จาก AI Predictive Refill / Anomaly Detection (FL-026, FL-027, Phase 3+)
- `ward_assignments` — ผูก nurse กับ ward/shift ถ้าต้อง scope สิทธิ์การมองเห็นในอนาคต

---

## Related

- [[Project Requirement Document (PRD) v2.1]]
- [[Application Architecture]]
- [[Feature List]]
- [[Product Backlog]]
- [[ER-Diagram]]

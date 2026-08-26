---
title: "SMIS — ER Diagram"
project: Smart IV Monitoring System (SMIS)
type: diagram
status: draft
version: 1.0
date: 2026-08-22
source: "[[Database]]"
tags:
  - smis
  - diagram
  - database
---

# ER Diagram — SMIS

> Visual companion ของ [[Database]] — field-level detail, enum values, และคำอธิบายเหตุผลแต่ละ column อยู่ในเอกสารนั้น ไฟล์นี้เก็บเฉพาะ diagram + relationship summary เพื่อไม่ให้ต้อง sync เนื้อหาสองที่

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar name
        varchar username
        varchar password_hash
        enum role
        boolean is_active
        timestamptz created_at
    }

    WARDS {
        uuid id PK
        varchar name
        varchar floor
        timestamptz created_at
    }

    BEDS {
        uuid id PK
        uuid ward_id FK
        varchar bed_number
        varchar patient_hn
        uuid device_id FK
        enum status
        timestamptz created_at
        timestamptz updated_at
    }

    DEVICES {
        uuid id PK
        varchar device_code
        varchar firmware_version
        smallint battery
        smallint rssi
        timestamptz last_seen
        enum status
        timestamptz created_at
    }

    IV_STATUS {
        uuid id PK
        uuid bed_id FK
        numeric remaining_ml
        numeric remaining_percent
        numeric flow_rate
        timestamptz estimated_empty_at
        numeric priority_score
        boolean is_mobility_mode
        timestamptz updated_at
    }

    IV_READINGS {
        bigserial id PK
        uuid bed_id FK
        uuid device_id FK
        numeric weight_g
        numeric remaining_ml
        numeric remaining_percent
        numeric flow_rate
        timestamptz recorded_at
    }

    ALERTS {
        uuid id PK
        uuid bed_id FK
        enum type
        varchar message
        boolean is_read
        timestamptz resolved_at
        timestamptz created_at
    }

    WARDS ||--o{ BEDS : "has"
    BEDS ||--o| DEVICES : "assigned to"
    BEDS ||--|| IV_STATUS : "current state of"
    BEDS ||--o{ IV_READINGS : "history of"
    DEVICES ||--o{ IV_READINGS : "reported by"
    BEDS ||--o{ ALERTS : "raises"
```

---

# Relationship Summary

| From | To | Cardinality | หมายเหตุ |
|---|---|---|---|
| `wards` | `beds` | 1 : N | Ward หนึ่งมีหลายเตียง |
| `beds` | `devices` | 1 : 0..1 | เตียงผูก device ได้อย่างมากหนึ่งตัว ณ ขณะหนึ่ง — `beds.device_id` nullable |
| `beds` | `iv_status` | 1 : 1 | Current state ต่อเตียง 1 แถวเสมอ |
| `beds` | `iv_readings` | 1 : N | ประวัติ telemetry ทั้งหมดของเตียง (time-series, append-only) |
| `devices` | `iv_readings` | 1 : N | ใช้ตรวจสอบว่า reading มาจาก device ตัวไหน (รองรับกรณีเปลี่ยน device ระหว่างทาง) |
| `beds` | `alerts` | 1 : N | เตียงหนึ่งมี alert ได้หลายรายการ (เก่า+ใหม่) |

`users` ไม่มีเส้นสัมพันธ์กับ entity อื่นใน MVP scope (ดูเหตุผลใน [[Database]] §4)

---

## Related

- [[Database]]
- [[Application Architecture]]
- [[Project Requirement Document (PRD) v2.1]]

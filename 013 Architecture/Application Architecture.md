# Smart IV Monitoring System - MVP Application Architecture

## Overview

Smart IV Monitoring System เป็นระบบติดตามปริมาณน้ำเกลือแบบ Real-time สำหรับโรงพยาบาล โดยมีเป้าหมายเพื่อลดภาระการเดินตรวจของพยาบาล ลดปัญหาน้ำเกลือหมดโดยไม่มีการแจ้งเตือน และช่วยให้เห็นภาพรวมของทั้งวอร์ดได้จาก Dashboard ส่วนกลาง

---

# MVP Goals

* แสดงปริมาณน้ำเกลือแบบ Real-time
* แจ้งเตือนก่อนน้ำเกลือหมด
* แสดงเตียงที่ควรได้รับการดูแลก่อน
* ลดเวลาการตรวจสอบของพยาบาล
* รองรับการ Demo ใน Hackathon
* รองรับการขยายระบบในอนาคต

---

# System Architecture

```text
ESP32 + Load Cell
        │
        │ HTTP POST
        ▼
NestJS API Server
        │
        ├── Save Data
        ├── Calculate Remaining %
        ├── Calculate Flow Rate
        ├── Calculate Estimated Empty Time
        ├── Calculate Priority Score
        ├── Generate Alert
        │
        ▼
PostgreSQL Database
        │
        ▼
Socket.IO Gateway
        │
        ▼
Next.js Dashboard
```

---

# Technology Stack

## Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* shadcn/ui
* Recharts
* Socket.IO Client

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* Socket.IO

## IoT

* ESP32
* HX711
* Load Cell

## Deployment

* Vercel (Frontend)
* Railway หรือ VPS (Backend)
* PostgreSQL Database
* Telegram Bot Notification

---

# Frontend Modules

```text
src/
│
├── app/
├── components/
├── hooks/
├── services/
├── socket/
├── types/
│
├── modules/
│   ├── dashboard/
│   ├── ward/
│   ├── bed/
│   ├── alert/
│   └── device/
```

---

# Backend Modules

```text
src/
│
├── ward/
├── bed/
├── iv/
├── alert/
├── device/
├── notification/
│
├── socket/
├── prisma/
└── common/
```

---

# Core Features

## Dashboard Overview

แสดงข้อมูลภาพรวมของโรงพยาบาล

* Active Beds
* Critical IV
* Warning IV
* Connected Devices
* Average Flow Rate
* Estimated Refill Time

---

## Ward Detail

แสดงข้อมูลแต่ละวอร์ด

* Total Beds
* Critical Beds
* Warning Beds
* Normal Beds

สามารถ

* Sort ตาม Remaining %, Remaining ml หรือ Estimated Empty Time
* Filter ตามสถานะ Critical, Warning และ Normal

---

## Bed Card

ข้อมูลที่แสดงบนแต่ละเตียง

### Header

* Bed Number
* HN

### IV Status

* Remaining %
* Remaining ml
* Flow Rate
* Estimated Empty Time

### Color Status

| Remaining | Status |
| --------- | ------ |
| 70-100%   | Green  |
| 40-69%    | Yellow |
| 10-39%    | Orange |
| 1-9%      | Red    |
| 0%        | Gray   |

---

## Alert Center

รองรับ Alert ประเภท

* IV Low
* IV Empty
* Device Offline

Notification Channel

* Dashboard Notification
* Telegram Bot

---

## Device Monitoring

ข้อมูลที่แสดง

* Device ID
* Battery
* RSSI
* Last Seen
* Status

สถานะอุปกรณ์

* Online
* Offline
* Low Battery

---

# Database Schema

## wards

```text
id
name
floor
created_at
```

## beds

```text
id
ward_id
bed_number
patient_hn
device_id
status
```

## iv_status

```text
id
bed_id

remaining_ml
remaining_percent

flow_rate

estimated_empty_at

priority_score

updated_at
```

## alerts

```text
id
bed_id

type
message

is_read

created_at
```

## devices

```text
id

device_code

battery

rssi

last_seen

status
```

---

# Realtime Flow

เมื่ออุปกรณ์ IoT ส่งข้อมูลเข้ามา

```text
1. Receive Data
2. Save Database
3. Calculate Metrics
4. Create Alert
5. Broadcast Socket Event
6. Update Dashboard
```

Socket Events

```text
iv:update
alert:new
device:offline
```

Dashboard จะได้รับข้อมูลใหม่ทันทีโดยไม่ต้อง Polling

---

# Priority Queue Engine

ใช้สำหรับจัดลำดับเตียงที่ต้องได้รับการดูแลก่อน

สูตร MVP

```text
priority_score =
(100 - remaining_percent) * 0.6
+
(flow_rate * 0.2)
+
(minutes_to_empty * -0.2)
```

ตัวอย่าง

| Bed    | Remaining | Time Left | Priority |
| ------ | --------- | --------- | -------- |
| Bed 01 | 10%       | 15 min    | High     |
| Bed 02 | 20%       | 30 min    | Medium   |
| Bed 03 | 45%       | 50 min    | Low      |

Dashboard จะเรียงเตียงตามคะแนน Priority อัตโนมัติ

---

# Device Offline Logic

หากไม่มีข้อมูลจากอุปกรณ์เกิน 60 วินาที

```text
status = OFFLINE
```

ระบบจะสร้าง Alert อัตโนมัติ

---

# MVP Scope

สิ่งที่ต้องมีสำหรับ Hackathon

* Dashboard Overview
* Ward Detail Page
* Bed Grid View
* IV Visualization
* Realtime Mock Data
* Alert Center
* Priority Queue Engine
* Telegram Notification

---

# Future Roadmap

## Phase 2

* LINE OA Notification
* Email Notification
* Historical Analytics
* Device Reliability Dashboard
* Daily Statistics

## Phase 3

* Predictive Refill
* Anomaly Detection
* Nurse Route Optimization
* Multi Hospital Support
* AI Recommendation Engine

---

# Final Architecture Summary

```text
ESP32 + Load Cell
        ↓
NestJS API
        ↓
PostgreSQL
        ↓
Socket.IO
        ↓
Next.js Dashboard
```

แนวคิดหลักของ MVP คือ

"Simple, Fast, Realtime และสามารถขยายต่อได้"

เหมาะสำหรับทีมพัฒนา 1-2 คน และสามารถพัฒนาให้พร้อม Demo ภายในระยะเวลา Hackathon ได้จริง

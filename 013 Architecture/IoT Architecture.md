# Smart IV Monitoring System - IoT Architecture (MVP)

# Overview

IoT Architecture ของ Smart IV Monitoring System มีหน้าที่ตรวจวัดปริมาณน้ำเกลือแบบ Real-time และส่งข้อมูลเข้าสู่ระบบ Dashboard เพื่อให้พยาบาลสามารถติดตามสถานะของทุกเตียงได้จากศูนย์กลาง

แนวคิดหลักคือ

> วัดน้ำหนักน้ำเกลือ → คำนวณปริมาณคงเหลือ → ส่งข้อมูลขึ้น Server → แจ้งเตือนอัตโนมัติ

---

# High Level Architecture

```text
┌─────────────────────────┐
│      IV Bottle          │
│                         │
│      Saline Bag         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│        Load Cell        │
│  ตรวจวัดน้ำหนักจริง      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│         HX711           │
│  Amplifier + ADC Module │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│         ESP32           │
│                         │
│ - Read Sensor Data      │
│ - Calculate Weight      │
│ - Connect WiFi          │
│ - Send API Request      │
└──────────┬──────────────┘
           │
           │ WiFi
           ▼
┌─────────────────────────┐
│      NestJS API         │
│                         │
│ - Save Database         │
│ - Calculate Remaining   │
│ - Generate Alert        │
│ - Broadcast Socket      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│      Dashboard          │
│                         │
│ Nurse Monitoring Center │
└─────────────────────────┘
```

---

# IoT Device Components

## 1. ESP32

หน้าที่

* เชื่อมต่อ WiFi
* อ่านค่าจาก Load Cell
* คำนวณน้ำหนักปัจจุบัน
* ส่งข้อมูลไปยัง API Server
* ตรวจสอบสถานะอุปกรณ์

เหตุผลที่เลือก

* ราคาถูก
* มี WiFi ในตัว
* พัฒนาได้ง่าย
* มี Community ขนาดใหญ่

---

## 2. Load Cell

หน้าที่

ตรวจวัดน้ำหนักของถุงน้ำเกลือ

ตัวอย่าง

| ขนาดน้ำเกลือ | น้ำหนักโดยประมาณ |
| ------------ | ---------------- |
| 500 ml       | 550-600 g        |
| 1000 ml      | 1050-1100 g      |

แนะนำ

* Load Cell 1kg สำหรับ MVP
* Load Cell 2kg สำหรับ Production

---

## 3. HX711

หน้าที่

* ขยายสัญญาณจาก Load Cell
* แปลง Analog Signal เป็น Digital Signal
* ส่งข้อมูลให้ ESP32

เนื่องจาก Load Cell ไม่สามารถต่อกับ ESP32 ได้โดยตรง จึงจำเป็นต้องใช้ HX711 เสมอ

---

# Physical Installation

```text
IV Pole
│
├── IV Bag
│
├── Hook
│
└── Load Cell
     │
     ├── HX711
     │
     └── ESP32 Box
```

ติดตั้งทั้งหมดไว้บริเวณแขวนถุงน้ำเกลือเพื่อให้สามารถวัดน้ำหนักได้โดยตรง

---

# Data Flow

## Step 1

ESP32 อ่านค่าน้ำหนักจาก Load Cell

ตัวอย่าง

```text
Current Weight = 325 g
```

---

## Step 2

คำนวณปริมาณน้ำเกลือคงเหลือ

ตัวอย่าง

```text
Initial Weight = 550 g
Empty Bag Weight = 50 g

Remaining Weight = 325 - 50
Remaining Liquid = 275 ml

Remaining Percent = 55%
```

---

## Step 3

ส่งข้อมูลไปยัง API Server ทุก 5 วินาที

ตัวอย่าง Payload

```json
{
  "deviceId": "IV-001",
  "weight": 325,
  "remainingMl": 275,
  "battery": 87,
  "rssi": -61,
  "timestamp": "2026-07-08T15:20:00Z"
}
```

---

## Step 4

Server ประมวลผล

* บันทึกข้อมูล
* คำนวณ Flow Rate
* คำนวณ Estimated Empty Time
* คำนวณ Priority Score
* ตรวจสอบ Alert

---

## Step 5

ส่งข้อมูลไปยัง Dashboard ผ่าน WebSocket

```text
iv:update
alert:new
device:offline
```

---

# Communication Architecture

## MVP Recommendation

```text
ESP32
 ↓ HTTP POST
NestJS API
 ↓ Socket.IO
Dashboard
```

ข้อดี

* พัฒนาเร็ว
* Debug ง่าย
* ใช้เวลาน้อย
* เหมาะกับ Hackathon

---

## Production Architecture

```text
ESP32
 ↓ MQTT
MQTT Broker
 ↓
Processing Service
 ↓
Database
 ↓
Dashboard
```

ข้อดี

* รองรับหลายพันอุปกรณ์
* ลดภาระ API Server
* รองรับการเชื่อมต่อไม่เสถียร

---

# Device Status Logic

## Online

ได้รับข้อมูลภายใน 30 วินาทีล่าสุด

## Warning

ไม่ได้รับข้อมูลเกิน 30 วินาที

## Offline

ไม่ได้รับข้อมูลเกิน 60 วินาที

เมื่อเข้าสู่สถานะ Offline ระบบจะสร้าง Alert อัตโนมัติ

---

# Battery Monitoring

ข้อมูลที่ต้องส่งทุกครั้ง

* Battery Percentage
* Charging Status
* Voltage

ตัวอย่าง

```json
{
  "battery": 82,
  "voltage": 3.9
}
```

เงื่อนไขแจ้งเตือน

| Battery | Status   |
| ------- | -------- |
| >30%    | Normal   |
| 10-30%  | Warning  |
| <10%    | Critical |

---

# Device Identity

ทุกอุปกรณ์ต้องมี Device ID เฉพาะ

ตัวอย่าง

```text
IV-ICUA-01
IV-ICUA-02
IV-10A-01
IV-10A-02
```

รูปแบบ

```text
IV-{WARD}-{BED}
```

---

# Device Provisioning

ขั้นตอนการติดตั้งอุปกรณ์ใหม่

1. เปิดอุปกรณ์
2. เชื่อมต่อ WiFi โรงพยาบาล
3. ลงทะเบียน Device ID
4. ผูกกับ Ward
5. ผูกกับ Bed
6. เริ่มส่งข้อมูล

---

# Failure Handling

## WiFi Disconnect

ESP32 เก็บข้อมูลล่าสุดไว้ใน Memory และพยายามเชื่อมต่อใหม่

---

## Server Down

ESP32 เก็บข้อมูลไว้ชั่วคราวและส่งย้อนหลังเมื่อเชื่อมต่อได้

---

## Sensor Error

หากน้ำหนักผิดปกติ เช่น

* ค่าน้ำหนักติดลบ
* น้ำหนักเพิ่มขึ้นผิดปกติ
* ค่าคงที่นานเกินไป

ระบบจะสร้าง Sensor Error Alert

---

# Recommended Update Interval

| Feature             | Interval   |
| ------------------- | ---------- |
| Weight Reading      | 1 วินาที   |
| Average Calculation | 5 วินาที   |
| API Upload          | 5 วินาที   |
| Dashboard Update    | 1-5 วินาที |

---

# Future IoT Roadmap

## Phase 2

* MQTT Communication
* OTA Firmware Update
* Edge Processing
* Device Configuration Portal

## Phase 3

* AI Flow Prediction
* Leakage Detection
* Occlusion Detection
* Smart Battery Optimization

---

# Final IoT Architecture

```text
IV Bag
 ↓
Load Cell
 ↓
HX711
 ↓
ESP32
 ↓
WiFi
 ↓
NestJS API
 ↓
PostgreSQL
 ↓
Socket.IO
 ↓
Dashboard
 ↓
Nurse
```

หลักการสำคัญของ MVP คือ

> Keep the Device Simple, Keep the Server Smart

ให้อุปกรณ์ IoT ทำหน้าที่เพียง "วัดและส่งข้อมูล" ส่วนการคำนวณ การแจ้งเตือน และการวิเคราะห์ทั้งหมดทำที่ Server เพื่อให้สามารถปรับปรุง Logic ได้โดยไม่ต้องอัปเดต Firmware ของอุปกรณ์ทุกตัว

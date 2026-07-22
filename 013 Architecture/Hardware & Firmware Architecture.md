# Smart IV Monitoring System - Hardware & Firmware Architecture

# Hardware Architecture

## Device Overview

อุปกรณ์ 1 ชุด จะรับผิดชอบ 1 เตียงผู้ป่วย

```text
┌───────────────────────┐
│       IV Bag          │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Load Cell        │
│      1kg / 2kg        │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│        HX711          │
│ ADC + Amplifier Board │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│        ESP32          │
│                       │
│ - Read Sensor         │
│ - Calculate Weight    │
│ - WiFi Connection     │
│ - Send API Request    │
└──────────┬────────────┘
           │
           ▼
        Hospital WiFi
```

---

# Recommended Components

| Component         | Recommended Model      |
| ----------------- | ---------------------- |
| MCU               | ESP32 DevKit V1        |
| ADC               | HX711                  |
| Load Cell         | 1kg Single Point       |
| Battery           | 18650 Li-ion           |
| Charger           | TP4056                 |
| Voltage Regulator | AMS1117                |
| Indicator         | RGB LED                |
| Button            | Reset / Pairing Button |

---

# ESP32 Pin Mapping

## HX711 Connection

| HX711 | ESP32  |
| ----- | ------ |
| DT    | GPIO 4 |
| SCK   | GPIO 5 |
| VCC   | 3.3V   |
| GND   | GND    |

---

## Status LED

| Function | GPIO    |
| -------- | ------- |
| Red      | GPIO 25 |
| Green    | GPIO 26 |
| Blue     | GPIO 27 |

---

## Battery Monitor

| Function        | GPIO    |
| --------------- | ------- |
| Battery Voltage | GPIO 34 |

---

## Optional Expansion

| Sensor      | GPIO    |
| ----------- | ------- |
| Temperature | GPIO 32 |
| Buzzer      | GPIO 33 |
| Button      | GPIO 14 |

---

# Device States

## Booting

```text
Power ON
↓
Initialize Sensor
↓
Connect WiFi
↓
Register Device
↓
Ready
```

---

## Running

Loop การทำงานหลัก

```text
Read Weight
↓
Filter Noise
↓
Calculate Remaining
↓
Send Data
↓
Sleep 5 Seconds
↓
Repeat
```

---

## Offline Mode

หาก WiFi หลุด

```text
Store Local Buffer
↓
Retry WiFi
↓
Send Buffered Data
```

---

# Firmware Architecture

```text
main.cpp
│
├── wifi_manager
├── sensor_manager
├── battery_manager
├── api_client
├── device_status
├── storage_manager
└── ota_manager
```

---

# Module Responsibilities

## wifi_manager

หน้าที่

* เชื่อมต่อ WiFi
* Reconnect อัตโนมัติ
* ตรวจสอบ Signal Strength

---

## sensor_manager

หน้าที่

* อ่านค่าจาก HX711
* กรองสัญญาณรบกวน
* คำนวณน้ำหนักเฉลี่ย

ตัวอย่าง

```text
อ่านค่า 10 ครั้ง
↓
ตัดค่าสูงสุดและต่ำสุด
↓
คำนวณค่าเฉลี่ย
```

---

## battery_manager

หน้าที่

* อ่านแรงดันแบตเตอรี่
* แปลงเป็นเปอร์เซ็นต์
* แจ้งเตือน Low Battery

---

## api_client

หน้าที่

* ส่งข้อมูลขึ้น Server
* Retry เมื่อส่งไม่สำเร็จ
* รองรับ Timeout

---

## storage_manager

หน้าที่

* เก็บข้อมูลชั่วคราวเมื่อ Offline
* ส่งย้อนหลังเมื่อกลับมา Online

---

## ota_manager

รองรับ

* Firmware Update
* Rollback
* Version Check

สำหรับ MVP สามารถปิด Module นี้ไว้ก่อน

---

# Data Packet

## Device Telemetry

```json
{
  "deviceId": "IV-10A-01",
  "weight": 312.4,
  "remainingMl": 262,
  "battery": 83,
  "rssi": -58,
  "firmwareVersion": "1.0.0",
  "timestamp": "2026-07-08T19:30:00Z"
}
```

---

# API Design

## Device Upload Endpoint

```text
POST /api/iot/telemetry
```

Request

```json
{
  "deviceId": "IV-10A-01",
  "weight": 312.4,
  "battery": 83,
  "rssi": -58
}
```

Response

```json
{
  "success": true,
  "serverTime": "2026-07-08T19:30:01Z"
}
```

---

# Calibration Flow

ทุกครั้งที่แขวนถุงน้ำเกลือใหม่

```text
Replace IV Bag
↓
Press Calibration Button
↓
Save Initial Weight
↓
Start Monitoring
```

ตัวอย่าง

| Description    | Weight |
| -------------- | ------ |
| Empty Bag      | 50 g   |
| New IV Bag     | 550 g  |
| Initial Liquid | 500 ml |

---

# Noise Reduction Strategy

เนื่องจากผู้ป่วยขยับตัวหรือมีการกระแทกเสา IV อาจทำให้ข้อมูลแกว่ง

แนวทางสำหรับ MVP

* Moving Average 10 ค่า
* Ignore Spike มากกว่า ±30g
* Update Dashboard ทุก 5 วินาที

---

# Device Status LED

| Status      | LED          |
| ----------- | ------------ |
| Booting     | Blue Blink   |
| Connected   | Green        |
| Warning     | Yellow Blink |
| Offline     | Red Blink    |
| Critical IV | Red Solid    |

---

# MQTT Topic Design (Phase 2)

```text
hospital/ward10a/bed01/telemetry
hospital/ward10a/bed01/status
hospital/ward10a/bed01/alert
```

ตัวอย่าง Publish

```json
{
  "remainingPercent": 12,
  "battery": 82
}
```

---

# Security

## MVP

* Device API Key
* HTTPS Only

Header

```text
x-device-key: DEVICE_SECRET_KEY
```

---

## Production

* JWT Device Token
* Certificate Authentication
* Device Rotation Key

---

# Estimated Cost per Device

| Component      | Price   |
| -------------- | ------- |
| ESP32          | 180 THB |
| HX711          | 45 THB  |
| Load Cell      | 120 THB |
| Battery        | 80 THB  |
| Charger Module | 35 THB  |
| PCB + Case     | 100 THB |

Total

```text
ประมาณ 560 - 700 บาท ต่อเตียง
```

---

# Final Hardware Architecture

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
API Server
 ↓
Database
 ↓
WebSocket
 ↓
Dashboard
```

หลักการสำคัญคือ

> Device ทำหน้าที่วัดและส่งข้อมูล
> Server ทำหน้าที่คิด วิเคราะห์ และแจ้งเตือน

---
title: "SMIS — IoT Overview"
project: Smart IV Monitoring System (SMIS)
type: overview
status: draft
version: 1.0
date: 2026-08-26
source: "[[IoT Architecture]], [[Hardware & Firmware Architecture]], [[Project Requirement Document (PRD) v2.1]] §11"
tags:
  - smis
  - iot
  - overview
---

# IoT Overview — SMIS

> เดิมไฟล์นี้ว่าง — ไฟล์นี้เป็น **landing page ระดับภาพรวม** ของ IoT Layer สำหรับคนที่ไม่ต้องการอ่าน spec เชิงลึกทั้งหมด (เช่น non-technical stakeholder, พยาบาล, ผู้บริหาร) ส่วนรายละเอียดเชิงเทคนิคเต็ม (pin mapping, firmware module, calibration, MQTT roadmap) อยู่ใน [[IoT Architecture]] และ [[Hardware & Firmware Architecture]] อยู่แล้ว — ไม่ duplicate ที่นี่

---

# 1. IoT ทำหน้าที่อะไรในระบบ SMIS

> วัดน้ำหนักน้ำเกลือ → คำนวณปริมาณคงเหลือ → ส่งข้อมูลขึ้น Server → แจ้งเตือนอัตโนมัติ

อุปกรณ์ IoT คือ "ตา" ของระบบ — ทำหน้าที่แค่ **วัดและส่งข้อมูล** ส่วนการคำนวณ วิเคราะห์ และแจ้งเตือนทั้งหมดเกิดขึ้นที่ Server ("Keep the Device Simple, Keep the Server Smart" — PRD §15.4) เพื่อให้ปรับ Logic ได้โดยไม่ต้องอัปเดต Firmware ทุกตัว

---

# 2. องค์ประกอบอุปกรณ์ (1 ชุด/เตียง)

| ลำดับ | Component | หน้าที่ |
|---|---|---|
| 1 | **Load Cell** (1kg MVP / 2kg Production) | วัดน้ำหนักถุงน้ำเกลือจริง |
| 2 | **HX711** | ขยายสัญญาณ Load Cell และแปลง Analog → Digital |
| 3 | **ESP32** | อ่านค่าเซนเซอร์, กรอง Noise, เชื่อมต่อ WiFi, ส่ง Telemetry |

ต้นทุนประมาณ **560–700 บาท/เตียง** — รายละเอียดใน [[Hardware & Firmware Architecture]] §Estimated Cost per Device

---

# 3. วงจรข้อมูล (Data Cycle) แบบย่อ

```text
1. อ่านน้ำหนัก (ทุก 1 วินาที)
2. กรอง Noise (Moving Average + ตัด spike)
3. ส่งขึ้น Server (ทุก 5–10 วินาที ปกติ / ทันทีถ้า Critical/Empty/Offline)
4. Server คำนวณ Remaining %, Flow Rate, ETE, Priority Score
5. Server สร้าง Alert ถ้าเข้าเงื่อนไข
6. Dashboard อัปเดตทันที (< 10 วินาที) ผ่าน Socket.IO
```

รายละเอียด payload/endpoint จริง → [[API Specification|API]] §5 · รายละเอียด algorithm → [[Detailed Design]] §2

---

# 4. สถานะอุปกรณ์ที่พยาบาลจะเห็น

| สถานะ | เงื่อนไข |
|---|---|
| Online | ได้รับข้อมูลภายใน 30 วินาทีล่าสุด |
| Warning | ไม่ได้รับข้อมูล > 30 วินาที |
| Offline | ไม่ได้รับข้อมูล > 60 วินาที → สร้าง Alert อัตโนมัติ |
| Low Battery | Battery < 10% |

(PRD §11.4, [[IoT Architecture]] §Device Status Logic)

---

# 5. การติดตั้งและ Calibration (สรุปสำหรับผู้ใช้งาน/ผู้ติดตั้ง)

1. เปิดอุปกรณ์ → เชื่อมต่อ WiFi โรงพยาบาล → ลงทะเบียน Device ID → ผูกกับ Ward/Bed
2. ทุกครั้งที่แขวนถุงน้ำเกลือใหม่: แขวนถุง → กด Calibration Button → ระบบบันทึกน้ำหนักตั้งต้น → เริ่มติดตาม

ขั้นตอนละเอียด → [[Hardware & Firmware Architecture]] §Calibration Flow, §Device Provisioning

---

# 6. Roadmap ย่อ

| Phase | สิ่งที่เพิ่ม |
|---|---|
| MVP | HTTP POST ทุก 5–10s, Device API Key, Moving Average Filter |
| Phase 2 | MQTT Transport, OTA Firmware Update, Edge Processing |
| Phase 3+ | AI Flow Prediction, Leakage/Occlusion Detection ด้วย ML |

---

# 7. เอกสารเชิงลึกที่เกี่ยวข้อง

| ต้องการอะไร | ไปที่ |
|---|---|
| Pin mapping, firmware module, noise filter algorithm, security | [[Hardware & Firmware Architecture]] |
| Communication architecture (MVP vs Production), device provisioning flow, MQTT roadmap | [[IoT Architecture]] |
| Telemetry endpoint contract | [[API Specification\|API]] §5 |
| Schema ของ `devices`/`iv_readings` | [[Database]] |
| Sequence diagram ของ ingestion pipeline | [[Detailed Design]] §3.1 |

---

## Related

- [[IoT Architecture]]
- [[Hardware & Firmware Architecture]]
- [[System Architecture]]
- [[API Specification|API]]
- [[Database]]
- [[Detailed Design]]
- [[Project Requirement Document (PRD) v2.1]]

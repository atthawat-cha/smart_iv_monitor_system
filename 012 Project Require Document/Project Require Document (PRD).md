	This is a product requirement document of the Smart IV Monitoring

## 1. Project Overview

### Product Name

Smart IV Monitoring System - SMIS

### Product Vision

ระบบติดตามปริมาณสารน้ำอัจฉริยะแบบ Real-time สำหรับโรงพยาบาล เพื่อช่วยให้พยาบาลและเจ้าหน้าที่สามารถตรวจสอบสถานะสารน้ำทุกเตียงได้จากศูนย์กลาง ลดปัญหาสารน้ำหมดโดยไม่รู้ตัว ลดภาระการเดินตรวจ และเพิ่มความปลอดภัยให้ผู้ป่วย

---

# 2. Problem Statement

ปัจจุบันพยาบาลต้องเดินตรวจสารน้ำแต่ละเตียงด้วยตนเอง

ปัญหาที่พบ

* สารน้ำหมดโดยไม่มีการแจ้งเตือน
* พยาบาลใช้เวลาเดินตรวจจำนวนมาก
* ไม่สามารถเห็นภาพรวมของทั้งวอร์ดได้
* ไม่สามารถจัดลำดับความสำคัญของเตียงที่ต้องดูแลก่อน

---

# 3. Objectives

## Primary Goals

* แสดงปริมาณสารน้ำแบบ Real-time
* แจ้งเตือนก่อนสารน้ำหมด
* แสดงเตียงที่ต้องได้รับการดูแลก่อน
* ลดเวลาการตรวจสอบของพยาบาล

## Success Metrics

* ลดเวลาตรวจวอร์ด > 50%
* แจ้งเตือนก่อนสารน้ำหมด 100%
* Dashboard Update < 10 วินาที
* รองรับ 100+ เตียง

---

# 4. User Roles

## Nurse

* ดูสถานะเตียง
* ดูสารน้ำใกล้หมด
* รับการแจ้งเตือน

## Head Nurse

* ดูสถานะทุกวอร์ด
* วิเคราะห์สถิติ

## Administrator

* จัดการอุปกรณ์ IoT
* จัดการผู้ใช้งาน
* ตั้งค่าระบบ

---

# 5. Dashboard Architecture

## Sidebar

* Dashboard
* Wards
* Patients
* Devices
* Alerts
* Analytics
* Settings

---

# 6. Dashboard Overview Page

## KPI Cards

### Active Beds

จำนวนเตียงที่กำลังใช้งาน

### Critical IV

จำนวนเตียงที่เหลือน้อยกว่า 20%

### Warning IV

จำนวนเตียงที่เหลือน้อยกว่า 50%

### Connected Devices

จำนวน IoT Device Online

### Average Flow Rate

ค่าเฉลี่ยการไหลของสารน้ำ

### Estimated Refill

เวลาที่คาดว่าจะมีสารน้ำหมดถัดไป

---

# 7. Real-time Charts

## Consumption Trend

กราฟแสดงอัตราการใช้สารน้ำย้อนหลัง

ช่วงเวลา

* 30 นาที
* 1 ชั่วโมง
* 24 ชั่วโมง

---

## Ward Distribution

จำนวนเตียงในแต่ละวอร์ด

---

## Alert Timeline

เหตุการณ์แจ้งเตือนย้อนหลัง

* IV Low
* IV Empty
* Device Offline

---

# 8. Ward Management

## Ward List

ตัวอย่าง

* ICU A
* ICU B
* Ward 10A
* Ward 10B

ข้อมูลที่แสดง

* จำนวนเตียง
* จำนวนเตียง Critical
* จำนวนเตียง Warning
* จำนวนเตียง Normal

---

# 9. Ward Detail Page

ตัวอย่าง Ward 10A

## KPI

* Total Beds
* Critical Beds
* Warning Beds
* Normal Beds

---

## Bed Grid View

แสดงเตียงทั้งหมด

ตัวอย่าง

Bed 01
HN-245678
12%
58 ml
13 min

Bed 02
HN-245679
25%
120 ml
31 min

---

## Sorting

เรียงตาม

* Remaining %
* Remaining ml
* Estimate Time
* Bed Number

---

## Filtering

กรองตาม

* Critical
* Warning
* Normal

---

# 10. Bed Card Specification

## Header

* Bed Number
* HN

## IV Bottle Visualization

Bottle Animation

ระดับสี

100-70%
Green

69-40%
Yellow

39-10%
Orange

9-1%
Red

0%
Gray

---

## Metrics

### Remaining %

เปอร์เซ็นต์คงเหลือ

### Remaining ml

ปริมาณคงเหลือ

### Flow Rate

ml/min

### Estimated Empty Time

เวลาคาดการณ์หมด

---

# 11. Digital Twin Ward View

Alternative View

จำลองผังวอร์ดจริง

ตัวอย่าง

Bed 01
Bed 02
Bed 03

Corridor

Bed 06
Bed 07
Bed 08

แสดงสีสถานะของแต่ละเตียง

เป้าหมาย

ให้พยาบาลเข้าใจภาพรวมวอร์ดทันที

---

# 12. Patient Detail Drawer

เมื่อกดที่เตียง
แสดง
## Patient Information

* HN
* Ward
* Bed

## IV Information

* Remaining %
* Remaining ml
* Flow Rate
* Started Time
* Estimated Empty

## Historical Chart

ย้อนหลัง 1 ชั่วโมง

---

# 13. Alert Center


## Estimated Time to Empty (ETE) 
[[Estimated Time to Empty (ETE)]]
- ETE (minutes) = Remaining Volume (mL) / Flow Rate (mL/min)
- **Estimated Time to Empty (ETE)** คือ **เวลาที่คาดการณ์ว่าอุปกรณ์หรือทรัพยากรจะหมดลง** โดยคำนวณจาก **ปริมาณที่เหลืออยู่ในปัจจุบัน** และ **อัตราการใช้งานหรืออัตราการไหลในขณะนั้น**

## Critical Alert
IV Remaining < 20%

## Empty Alert
IV Remaining = 0%

## Device Offline
Device Disconnect

## Flow Blockage / Occlusion Warning
ถ้าน้ำหนัก (Remaining ml) ไม่ลดลงเลยติดต่อกันเกิน X นาที (ตาม Flow rate ปกติที่ควรจะเป็น) ให้แจ้งเตือนทันที

*แล้วถ้าหากเป็นการไปเข้าห้องน้ำและต้องเอากระปุกสารน้ำไปด้วย จะทำยังไง*

---

## Notification Channels

* Dashboard Notification
* LINE OA
* Telegram
* Email
* Web Application Notify

---

# 14. Device Monitoring

## Device List

ข้อมูล

* Device ID
* Battery
* RSSI
* Last Seen
* Status

---

## Device Status

- Online
- Offline
- Low Battery

*เรื่องแบตจะยุ่งยากพยาบาลที่ต้องดูไหมเพราะบางทีพยาบาลดูไม่เป็น สามารถต่อสายได้ไหม หรือแบตอยู่ได้นานแค่ไหน*

---

# 15. Analytics

## Top Critical Beds

เรียงจากน้อยที่สุด

---

## Average Consumption

ต่อวอร์ด

---

## Device Reliability

อัตรา Online ของอุปกรณ์

---

## Daily Statistics

* เติมสารน้ำกี่ครั้ง
* Alert กี่ครั้ง
* Average Empty Time

---

# 16. Real-time Features

ใช้

WebSocket

หรือ

Socket.IO

อัปเดตทุก 5-10 วินาที

*หากส่งค่าบ่อยเกินไปจะเป็นการ ยิง server ไหม มีวิธีแก้ไขอย่างไร*

---

# 17. UI Design System

## Design Style

Vercel
Stripe
Linear

---

## Theme

Dark Mode

Glassmorphism

---

## Components

Glass Card

Gradient Border

Animated KPI

Progress Ring

Skeleton Loading

Toast Notification

Drawer

Command Palette

---

# 18. Priority Queue Engine

ระบบจัดลำดับเตียงอัตโนมัติ

Priority Score

คำนวณจาก

Remaining %

Flow Rate

Estimated Empty Time

---

Dashboard จะแสดงเตียงที่ควรดูแลก่อนอยู่บนสุดเสมอ

---

# 19. Future AI Features

## Predictive Refill

AI คาดการณ์เวลาหมด

---

## Anomaly Detection

ตรวจจับการไหลผิดปกติ

---

## Auto-Bag Change Detection Algorithm

ถ้าน้ำหนักลดลงใกล้ 0 แล้วจู่ๆ เพิ่มขึ้นอย่างรวดเร็วและคงที่ ให้ระบบตีความว่า "เปลี่ยนถุงใหม่" (Refill) และ Reset ค่าเริ่มต้นอัตโนมัติ โดยที่พยาบาลไม่ต้องกดปุ่มใดๆ ในแอป

---

# 20. Technical Stack

Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* shadcn/ui
* Framer Motion
* Recharts

Backend

* NestJS
* tRPC
* PostgreSQL
* Prisma

Realtime

* Socket.IO

IoT

* ESP32
* Load Cell
* HX711

Deployment

* Docker
* Vercel
* VPS / Cloud

---

# MVP Scope 

Phase 1

✓ Dashboard Overview

✓ Ward Detail

✓ Bed Grid

✓ IV Visualization

✓ Realtime Mock Data

✓ Alert Center

✓ Priority Queue

✓ Telegram Notification

เป้าหมาย

สร้าง Smart Hospital Command Center ที่แสดงภาพรวมของทุกเตียงในโรงพยาบาลแบบ Real-time และช่วยให้พยาบาลเห็นเตียงที่ต้องดูแลก่อนภายในไม่กี่วินาที

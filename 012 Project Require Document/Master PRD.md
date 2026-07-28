# Product Requirements Document (PRD)

# Smart IV Monitoring System (SMIS)

> **Real-time Clinical Workflow Intelligence Platform for Hospitals**

**Version:** 2.0  
**Status:** MVP / Prototype  
**Product Type:** Healthcare IoT + SaaS + Clinical Workflow Intelligence  
**Target Market:** Hospitals, Wards, Medical Centers  
**Primary Users:** Nurses, Head Nurses, Hospital Administrators

---

# 1. Executive Summary

Smart IV Monitoring System (SMIS) คือแพลตฟอร์ม **Real-time Clinical Workflow Intelligence** สำหรับโรงพยาบาล ที่ใช้ IoT Sensor ในการติดตามสถานะสารน้ำของผู้ป่วยแบบ Real-time และเปลี่ยนข้อมูลจากอุปกรณ์ IoT ให้เป็นข้อมูลที่ทีมพยาบาลสามารถนำไปใช้ตัดสินใจได้ทันที

ระบบไม่ได้มุ่งเน้นเพียงการแสดงว่า

> "สารน้ำเหลือกี่เปอร์เซ็นต์"

แต่ต้องสามารถตอบคำถามสำคัญของพยาบาลได้ว่า

> **"ตอนนี้เตียงไหนต้องได้รับการดูแลก่อน?"**

SMIS จะรวบรวมข้อมูลจากอุปกรณ์ IoT ที่ติดตั้งกับเสาน้ำเกลือ วิเคราะห์ระดับสารน้ำ อัตราการไหล และ Estimated Time to Empty (ETE) จากนั้นจัดลำดับความสำคัญของเตียงโดยอัตโนมัติ พร้อมแจ้งเตือนเมื่อพบสถานการณ์สำคัญ

ระบบมีเป้าหมายเพื่อลดการตรวจสอบแบบ Manual ลดเวลาการเดินตรวจ เพิ่มประสิทธิภาพการจัดการ Ward และเพิ่ม Patient Safety

---

# 2. Product Vision

> **To become the real-time clinical workflow intelligence layer that helps healthcare teams know what needs attention first.**

ภาษาไทย:

> **สร้างระบบอัจฉริยะที่ช่วยให้ทีมพยาบาลเห็นสถานะผู้ป่วยและอุปกรณ์แบบ Real-time และรู้ว่า "เตียงไหนควรได้รับการดูแลก่อน" ภายในไม่กี่วินาที**

---

# 3. Product Positioning

## 3.1 Positioning

SMIS ไม่ควรถูกวางตำแหน่งเป็นเพียง

> Smart IV Scale

หรือ

> IoT IV Monitoring Device

แต่ควรวางตำแหน่งเป็น

> **Real-time Clinical Workflow Intelligence Platform**

โดยแบ่งระบบออกเป็น 4 Layers

```text
┌────────────────────────────────────────────┐
│ Clinical Workflow Intelligence             │
│ Priority Queue / Analytics / AI             │
├────────────────────────────────────────────┤
│ Real-time Monitoring Platform               │
│ Dashboard / Alerts / Ward Overview          │
├────────────────────────────────────────────┤
│ IoT Data Layer                              │
│ Weight / Flow / Battery / Device Status     │
├────────────────────────────────────────────┤
│ Physical Environment                        │
│ IV Bag / IV Stand / Patient Bed             │
└────────────────────────────────────────────┘
```

---

# 4. Problem Statement

## 4.1 Current Workflow

ในปัจจุบันพยาบาลต้องเดินตรวจสถานะสารน้ำของผู้ป่วยแต่ละเตียงด้วยตนเอง

Workflow:

```text
Nurse
  ↓
เดินตรวจแต่ละเตียง
  ↓
ตรวจระดับสารน้ำ
  ↓
ประเมินว่าสารน้ำใกล้หมดหรือไม่
  ↓
จำสถานะ
  ↓
กลับไปดูเตียงอื่น
  ↓
เดินกลับมาเปลี่ยนถุง
```

เมื่อจำนวนเตียงเพิ่มขึ้น Workflow นี้จะใช้เวลาและทรัพยากรของพยาบาลมากขึ้น

---

## 4.2 Key Problems

### Problem 1: IV หมดโดยไม่มีการแจ้งเตือน

อาจเกิดกรณีสารน้ำหมดก่อนที่พยาบาลจะกลับมาตรวจ

---

### Problem 2: Nurse Walking Time

พยาบาลต้องเดินตรวจหลายเตียงซ้ำ ๆ แม้ว่าผู้ป่วยส่วนใหญ่จะไม่มีปัญหา

---

### Problem 3: Lack of Ward Overview

พยาบาลไม่สามารถเห็นสถานะของผู้ป่วยทุกเตียงได้จากจุดเดียว

---

### Problem 4: No Priority

พยาบาลต้องประเมินเองว่าเตียงไหนควรไปดูแลก่อน

---

### Problem 5: Limited Historical Data

ไม่มีข้อมูลย้อนหลังเพียงพอสำหรับวิเคราะห์

- IV Consumption
    
- Alert Frequency
    
- Response Time
    
- Nurse Workflow
    
- Device Reliability
    

---

# 5. Product Goals

## Primary Goals

1. แสดงสถานะสารน้ำแบบ Real-time
    
2. แจ้งเตือนก่อนสารน้ำหมด
    
3. ระบุเตียงที่ควรได้รับการดูแลก่อน
    
4. ลดเวลาการเดินตรวจแบบ Manual
    
5. ลดความเสี่ยงจากสารน้ำหมดโดยไม่รู้ตัว
    
6. เพิ่มภาพรวมของ Ward ให้พยาบาลเห็นได้ทันที
    

---

## Secondary Goals

1. เก็บ Historical Data
    
2. วิเคราะห์การใช้สารน้ำ
    
3. วิเคราะห์ Alert
    
4. วิเคราะห์ Device Reliability
    
5. รองรับ AI Predictive Monitoring ในอนาคต
    

---

# 6. Non-Goals สำหรับ MVP

MVP จะยังไม่มุ่งเน้น

- การควบคุม IV Pump
    
- การปรับอัตราการไหลอัตโนมัติ
    
- การวินิจฉัยโรค
    
- การตัดสินใจทางการแพทย์
    
- การแทนที่การตรวจสอบของพยาบาล
    
- การเชื่อมต่อ Hospital Information System แบบเต็มรูปแบบ
    
- AI ที่ซับซ้อน
    
- การรองรับอุปกรณ์หลายประเภทจำนวนมาก
    

SMIS เป็นระบบ **Decision Support และ Workflow Assistance**

ไม่ใช่ระบบที่ตัดสินใจทางการแพทย์แทนบุคลากร

---

# 7. Target Customers

## Primary Customers

### Private Hospitals

Pain Points:

- ต้องการเพิ่ม Patient Safety
    
- ต้องการลด Operational Cost
    
- ต้องการ Digital Transformation
    
- มีงบประมาณด้าน Healthcare Technology
    

---

### Public Hospitals

Pain Points:

- จำนวนผู้ป่วยมาก
    
- บุคลากรจำกัด
    
- Nurse Workload สูง
    
- ต้องการเพิ่ม Operational Efficiency
    

ข้อจำกัด:

- Procurement
    
- Budget Cycle
    
- Regulatory Requirement
    

---

### Hospital Networks

SMIS สามารถขยายเป็น

> Central Hospital Command Center

เพื่อดูข้อมูลหลายโรงพยาบาลจากระบบเดียว

---

# 8. User Roles

## 8.1 Nurse

Responsibilities:

- ดูสถานะเตียง
    
- ดูสถานะ IV
    
- รับ Alert
    
- ตรวจสอบ Critical Bed
    
- จัดการงานตาม Priority
    

---

## 8.2 Head Nurse

Responsibilities:

- ดูสถานะทั้ง Ward
    
- ตรวจสอบ Workload
    
- วิเคราะห์ Alert
    
- ดู Performance
    
- ตรวจสอบ Nurse Response
    

---

## 8.3 Hospital Administrator

Responsibilities:

- ดู Performance ของโรงพยาบาล
    
- วิเคราะห์ Operational Efficiency
    
- ดู KPI
    
- วิเคราะห์ ROI
    

---

## 8.4 System Administrator

Responsibilities:

- จัดการ User
    
- จัดการ Ward
    
- จัดการ Bed
    
- จัดการ Device
    
- ตั้งค่า Alert
    

---

# 9. Value Proposition

## For Nurses

> **Know what needs attention first.**

ช่วยให้พยาบาลรู้ว่าเตียงไหนควรได้รับการดูแลก่อน โดยไม่ต้องเดินตรวจทุกเตียงด้วยตนเอง

---

## For Head Nurses

> **See the entire ward at a glance.**

เห็นภาพรวมของ Ward และจัดลำดับความสำคัญของงานได้ดีขึ้น

---

## For Hospital Administrators

> **Turn clinical monitoring data into operational intelligence.**

เปลี่ยนข้อมูลการดูแลผู้ป่วยเป็นข้อมูลสำหรับวิเคราะห์ Workflow และ Operational Efficiency

---

# 10. Business Value

## 10.1 Reduce Nurse Walking Time

เปลี่ยน Workflow จาก

```text
Check Every Bed
      ↓
Find Problem
```

เป็น

```text
Monitor All Beds
      ↓
Priority Queue
      ↓
Check Critical Beds
```

เป้าหมายคือให้พยาบาลใช้เวลาไปกับผู้ป่วยที่ต้องการการดูแลจริงมากขึ้น

---

## 10.2 Reduce Operational Risk

ลดความเสี่ยงจาก

- IV Empty
    
- IV Low
    
- Flow Abnormal
    
- Device Offline
    
- Missed Alert
    

---

## 10.3 Improve Patient Safety

ระบบช่วยให้บุคลากรสามารถตรวจพบสถานการณ์ที่ต้องให้ความสนใจได้เร็วขึ้น

SMIS เป็นระบบสนับสนุนการทำงาน ไม่ใช่ระบบทดแทนการตัดสินใจทางคลินิก

---

## 10.4 Improve Workflow Efficiency

ข้อมูลจากระบบสามารถนำไปวิเคราะห์

- Nurse Walking Time
    
- Alert Response Time
    
- IV Change Frequency
    
- Ward Consumption
    
- Device Reliability
    

---

# 11. Business Model

SMIS ใช้โมเดล

> **Hybrid Hardware + SaaS + Service + AI**

Revenue Streams:

```text
Hardware
+
SaaS Subscription
+
Installation
+
Maintenance
+
Premium Analytics / AI
```

---

# 12. Revenue Model

## 12.1 Hardware Revenue

ขายหรือให้เช่า

- Smart IV Device
    
- Load Cell
    
- IoT Gateway
    
- Power System
    
- Accessories
    

Model:

```text
One-time Hardware Purchase
```

หรือ

```text
Hardware Rental
```

---

## 12.2 SaaS Subscription

ค่าบริการระบบรายเดือนหรือรายปี

แบ่งตาม

- จำนวนเตียง
    
- จำนวน Ward
    
- จำนวน Device
    
- จำนวน User
    
- Analytics Features
    

ตัวอย่าง Pricing Assumption สำหรับการทดลอง Business Model:

### Starter

สำหรับ Ward ขนาดเล็ก

```text
$299–$499 / month
```

### Professional

สำหรับโรงพยาบาลขนาดกลาง

```text
$1,000–$3,000 / month
```

### Enterprise

สำหรับโรงพยาบาลขนาดใหญ่

```text
Custom Pricing
```

Pricing จริงต้อง Validate กับลูกค้าและตลาดก่อน Commercial Launch

---

## 12.3 Installation & Integration

รายได้จาก

- Installation
    
- Device Setup
    
- Network Configuration
    
- Training
    
- Hospital System Integration
    

---

## 12.4 Maintenance

รายได้จาก

- Hardware Maintenance
    
- Calibration
    
- Device Replacement
    
- Technical Support
    
- SLA
    

---

## 12.5 Premium AI

ในอนาคต

- Predictive Refill
    
- Anomaly Detection
    
- Workflow Analytics
    
- Predictive Maintenance
    

---

# 13. Cost Structure

## 13.1 Hardware Cost

ต้นทุนประกอบด้วย

- ESP32
    
- Load Cell
    
- HX711
    
- Battery / Power
    
- PCB
    
- Enclosure
    
- Assembly
    
- Calibration
    
- Packaging
    

Estimated Prototype BOM:

```text
$20–$100 / Device
```

หมายเหตุ:

ต้นทุน Commercial จริงอาจสูงกว่านี้ เนื่องจากต้องรวม

- Certification
    
- Testing
    
- Warranty
    
- Logistics
    
- Replacement
    
- Manufacturing
    

---

## 13.2 Software Infrastructure

ต้นทุน

- Cloud
    
- Database
    
- Backend
    
- Realtime Infrastructure
    
- Monitoring
    
- Logging
    
- Notification
    

---

## 13.3 Development Cost

- IoT Development
    
- Frontend Development
    
- Backend Development
    
- UX/UI
    
- QA
    
- DevOps
    
- AI/Data
    

---

## 13.4 Operational Cost

- Customer Support
    
- Installation
    
- Training
    
- Calibration
    
- Maintenance
    
- Device Replacement
    

---

## 13.5 Regulatory Cost

เมื่อเข้าสู่การใช้งานจริง ต้องพิจารณา

- Medical Device Classification
    
- Electrical Safety
    
- EMC
    
- Data Privacy
    
- Cybersecurity
    
- Hospital IT Security
    
- Patient Data Protection
    

---

# 14. Unit Economics

ตัวอย่างสมมติฐาน

```text
Hardware Selling Price
$150

Hardware Landed Cost
$60

Hardware Gross Profit
$90
```

SaaS:

```text
SaaS Revenue
$10 / Device / Month

Cloud Cost
$1 / Device / Month

Support Cost
$2 / Device / Month

Estimated SaaS Gross Profit
$7 / Device / Month
```

Revenue Model:

```text
Year 1 Revenue
=
Hardware Revenue
+
12 Months SaaS
```

เป้าหมายคือเปลี่ยน

```text
One-time Hardware Revenue
```

เป็น

```text
Recurring SaaS Revenue
```

---

# 15. ROI Model

SMIS ควรมี ROI Calculator สำหรับโรงพยาบาล

Input:

- Number of Beds
    
- Number of Nurses
    
- Nurse Cost / Hour
    
- Manual Checking Frequency
    
- Average Checking Time
    
- Expected Time Reduction
    

Output:

- Nurse Hours Saved
    
- Estimated Operational Value
    
- Annual SMIS Cost
    
- Estimated ROI
    
- Payback Period
    

Formula:

```text
Annual Labor Value Saved
=
Hours Saved × Labor Cost / Hour
```

ROI:

```text
ROI
=
(Annual Value Created - Annual SMIS Cost)
÷ Annual SMIS Cost
× 100
```

---

# 16. Success Metrics

## Product Metrics

- Dashboard Update < 10 seconds
    
- Device Uptime > 99%
    
- Alert Accuracy > 95%
    
- False Alert Rate
    
- ETE Accuracy
    

---

## Clinical Workflow Metrics

- Nurse Walking Time Reduction > 50%
    
- Manual IV Check Reduction
    
- Critical Alert Response Time
    
- Average Alert Response Time
    

---

## Business Metrics

- CAC
    
- MRR
    
- ARR
    
- LTV
    
- Gross Margin
    
- Churn Rate
    
- Payback Period
    

---

# 17. Dashboard Architecture

## Sidebar

- Dashboard
    
- Wards
    
- Patients
    
- Devices
    
- Alerts
    
- Analytics
    
- Settings
    

---

# 18. Dashboard Overview

## KPI Cards

### Active Beds

จำนวนเตียงที่กำลังใช้งาน

### Critical IV

จำนวน IV ที่เหลือน้อยกว่า 20%

### Warning IV

จำนวน IV ที่เหลือน้อยกว่า 50%

### Connected Devices

จำนวน Device Online

### Average Flow Rate

ค่าเฉลี่ยการไหลของสารน้ำ

### Estimated Refill

เวลาที่คาดว่าจะมี IV หมดถัดไป

---

# 19. Real-time Charts

## Consumption Trend

ช่วงเวลา

- 30 Minutes
    
- 1 Hour
    
- 24 Hours
    

---

## Ward Distribution

แสดงจำนวน

- Normal
    
- Warning
    
- Critical
    
- Empty
    

แยกตาม Ward

---

## Alert Timeline

แสดง

- IV Low
    
- IV Empty
    
- Device Offline
    
- Flow Anomaly
    

---

# 20. Ward Management

## Ward List

ตัวอย่าง

- ICU A
    
- ICU B
    
- Ward 10A
    
- Ward 10B
    

ข้อมูล

- Total Beds
    
- Critical Beds
    
- Warning Beds
    
- Normal Beds
    

---

# 21. Ward Detail

## Ward KPI

- Total Beds
    
- Critical Beds
    
- Warning Beds
    
- Normal Beds
    

---

## Bed Grid

ตัวอย่าง

```text
Bed 01
HN-245678
12%
58 ml
13 min
```

---

## Sorting

- Remaining %
    
- Remaining ml
    
- Estimated Time
    
- Bed Number
    
- Priority Score
    

---

## Filtering

- Critical
    
- Warning
    
- Normal
    
- Offline
    

---

# 22. Bed Card

## Header

- Bed Number
    
- HN
    

---

## IV Visualization

สถานะ

```text
100–70%  Green
69–40%   Yellow
39–10%   Orange
9–1%     Red
0%       Gray
```

---

## Metrics

- Remaining %
    
- Remaining ml
    
- Flow Rate
    
- Estimated Time to Empty
    

---

# 23. Estimated Time to Empty (ETE)

ETE คือเวลาที่คาดการณ์ว่าสารน้ำจะหมด

Formula:

```text
ETE (minutes)
=
Remaining Volume (ml)
÷
Flow Rate (ml/min)
```

ตัวอย่าง

```text
Remaining Volume = 120 ml
Flow Rate = 4 ml/min

ETE = 30 minutes
```

ระบบควรคำนวณ ETE จากข้อมูล Flow Rate ที่ผ่านการ Smoothing เพื่อป้องกันความผันผวนของ Sensor

---

# 24. Priority Queue Engine

ระบบจะจัดลำดับเตียงอัตโนมัติ

Priority Score อาจประกอบด้วย

```text
Remaining %
+
Flow Rate
+
ETE
+
Alert Severity
+
Patient Context
```

ตัวอย่าง Priority

```text
P1 Critical
ETE < 15 min

P2 High
ETE 15–30 min

P3 Warning
ETE 30–60 min

P4 Normal
ETE > 60 min
```

ระบบจะแสดงเตียงที่มี Priority สูงสุดด้านบน

---

# 25. Alert Center

## Critical Alert

IV Remaining < 20%

---

## Empty Alert

IV Remaining = 0%

---

## Device Offline

Device ไม่ส่งข้อมูลเกิน Threshold

---

## Flow Blockage / Occlusion Warning

หากระบบพบว่า

```text
Expected Flow > 0
แต่
Measured Volume Change ≈ 0
```

ติดต่อกันเกิน X นาที

ระบบแจ้งเตือน

> Possible Flow Blockage / Occlusion

หมายเหตุ:

ระบบควรใช้คำว่า **Possible** หรือ **Suspected** เนื่องจากอาจเกิดจากหลายสาเหตุ เช่น

- สายพับ
    
- Clamp ปิด
    
- Sensor Error
    
- ผู้ป่วยเคลื่อนย้าย
    
- IV Bag ถูกยกขึ้น
    

ไม่ควรระบุว่าเป็น Occlusion แน่นอนโดยไม่มีการตรวจสอบเพิ่มเติม

---

# 26. Patient Mobility & Temporary Disconnection

กรณีผู้ป่วยต้อง

- ไปห้องน้ำ
    
- ไปตรวจ
    
- ย้ายเตียง
    
- เคลื่อนย้ายผู้ป่วย
    

ระบบควรมีสถานะ

> **Temporary Mobility Mode**

Workflow:

```text
Nurse / Staff
      ↓
กด Temporary Mobility
      ↓
Suspend Alert ชั่วคราว
      ↓
ย้าย IV Device ไปพร้อมผู้ป่วย
      ↓
Device ติดตามต่อ
      ↓
เมื่อกลับ Ward
      ↓
Resume Monitoring
```

ในอนาคตสามารถใช้

- Device ID
    
- Patient ID
    
- Bed ID
    

เพื่อให้ระบบรู้ว่า Device อยู่กับผู้ป่วยคนใด แม้ผู้ป่วยจะเปลี่ยนตำแหน่ง

---

# 27. Auto Bag Change Detection

ระบบตรวจจับเหตุการณ์

```text
Volume ลดลง
      ↓
ใกล้ 0
      ↓
Volume เพิ่มขึ้นอย่างรวดเร็ว
      ↓
ระดับใหม่คงที่
```

ระบบตีความว่า

> Possible New IV Bag

จากนั้น

```text
Reset Baseline
Calculate New Flow Rate
Calculate New ETE
```

สำหรับ MVP อาจใช้ Rule-based Algorithm ก่อน

ในอนาคตพัฒนาเป็น AI Model

---

# 28. Device Monitoring

## Device Information

- Device ID
    
- Battery
    
- RSSI
    
- Last Seen
    
- Status
    
- Firmware Version
    

---

## Device Status

- Online
    
- Offline
    
- Low Battery
    

---

# 29. Device Power Strategy

เพื่อลดภาระพยาบาล

MVP ควรออกแบบให้

> **ไม่ต้องชาร์จแบตเตอรี่ทุกวัน**

แนวทางที่แนะนำ:

### Option A: USB-C Power

เหมาะกับ Prototype

ข้อดี:

- ใช้งานง่าย
    
- ไม่ต้องเปลี่ยนแบต
    
- ต้นทุนต่ำ
    

---

### Option B: Long-life Battery

เหมาะกับ Commercial Device

ควรมี

- Battery Indicator
    
- Low Battery Alert
    
- Predictive Battery Warning
    

เป้าหมาย:

> Battery Life ≥ 30 Days

ทั้งนี้ต้อง Validate จาก Sampling Rate และ Wireless Protocol จริง

---

### Recommended MVP

ใช้

> USB-C / External Power Bank

สำหรับ Prototype

และพัฒนา Battery Optimization ใน Phase Commercial

---

# 30. Real-time Architecture

SMIS ไม่จำเป็นต้องส่งข้อมูลทุกวินาที

แนะนำ Architecture:

```text
Load Cell
    ↓
ESP32
    ↓
Local Filtering
    ↓
Send Data Every 5–10 sec
    ↓
IoT Gateway / Backend
    ↓
Data Processing
    ↓
WebSocket / Socket.IO
    ↓
Dashboard
```

---

## Server Load Optimization

ไม่ควรให้ Device ทุกตัวยิง Database โดยตรงทุก 1 วินาที

ควรใช้

### Edge Filtering

ประมวลผลเบื้องต้นที่ ESP32

---

### Sampling

อ่าน Sensor ทุก 1 วินาที

แต่ส่งข้อมูลทุก 5–10 วินาที

---

### Event-based Update

ส่งทันทีเมื่อเกิด

- Critical
    
- Empty
    
- Device Offline
    
- Sudden Weight Change
    

---

### Database Strategy

แยก

```text
Current State
```

และ

```text
Historical Time Series
```

เพื่อไม่ให้ Database ทำงานหนักเกินไป

---

# 31. Digital Twin Ward View

แสดง Layout จำลองของ Ward

ตัวอย่าง

```text
Bed 01   Bed 02   Bed 03

         Corridor

Bed 06   Bed 07   Bed 08
```

ใช้สีแสดงสถานะ

- Green = Normal
    
- Yellow = Warning
    
- Orange = High Risk
    
- Red = Critical
    
- Gray = Offline
    

เป้าหมาย:

> ให้พยาบาลเข้าใจสถานะของ Ward ภายในไม่กี่วินาที

---

# 32. Patient Detail Drawer

เมื่อเลือก Bed

## Patient Information

- HN
    
- Ward
    
- Bed
    

---

## IV Information

- Remaining %
    
- Remaining ml
    
- Flow Rate
    
- Started Time
    
- ETE
    

---

## Historical Chart

ช่วงเวลา

- 30 Minutes
    
- 1 Hour
    
- 24 Hours
    

---

# 33. Notification Channels

MVP:

- Dashboard
    
- Telegram
    

Future:

- LINE OA
    
- Email
    
- Mobile Push
    
- SMS
    

Notification ต้องมี

```text
Alert Type
+
Bed
+
Patient
+
Remaining
+
ETE
+
Timestamp
```

---

# 34. Analytics

## Top Critical Beds

เรียงจาก Priority สูงสุด

---

## Average Consumption

วิเคราะห์ตาม Ward

---

## Device Reliability

แสดง

- Uptime
    
- Offline Frequency
    
- Battery Performance
    

---

## Daily Statistics

- จำนวน IV Change
    
- จำนวน Alert
    
- Average ETE
    
- Average Response Time
    

---

# 35. Future AI Features

## AI Predictive Refill

คาดการณ์เวลาที่ IV จะหมด

---

## Anomaly Detection

ตรวจจับ

- Flow ผิดปกติ
    
- Weight Jump
    
- Weight Drop
    
- Sensor Error
    

---

## Predictive Maintenance

คาดการณ์ว่า Device ใดมีแนวโน้มผิดปกติ

---

## Workflow Intelligence

วิเคราะห์

- Nurse Workload
    
- Ward Bottleneck
    
- Alert Pattern
    
- Peak Workload
    

---

# 36. Technical Architecture

## Frontend

- Next.js 15
    
- TypeScript
    
- TailwindCSS
    
- shadcn/ui
    
- Framer Motion
    
- Recharts
    

---

## Backend

- NestJS
    
- tRPC
    
- PostgreSQL
    
- Prisma
    

---

## Realtime

- Socket.IO
    

---

## IoT

- ESP32
    
- Load Cell
    
- HX711
    

---

## Infrastructure

- Docker
    
- Vercel
    
- VPS / Cloud
    

---

# 37. MVP Scope

## Phase 1

### Core Product

- Dashboard Overview
    
- Ward Detail
    
- Bed Grid
    
- IV Visualization
    
- Realtime Mock Data
    
- Alert Center
    
- Priority Queue
    
- Telegram Notification
    

---

## MVP IoT Prototype

- ESP32
    
- Load Cell
    
- HX711
    
- Real-time Weight Data
    
- Device Status
    
- Basic ETE
    

---

## MVP Business Demo

ระบบต้องสามารถแสดง

```text
10 Beds
      ↓
Real-time Monitoring
      ↓
Critical Alert
      ↓
Priority Queue
      ↓
Telegram Notification
      ↓
Nurse Action
```

---

# 38. MVP Success Criteria

MVP ถือว่าสำเร็จเมื่อสามารถสาธิตได้ว่า

1. Device ส่งข้อมูล Real-time
    
2. Dashboard แสดงข้อมูลภายใน < 10 วินาที
    
3. ระบบคำนวณ Remaining Volume
    
4. ระบบคำนวณ ETE
    
5. ระบบจัด Priority
    
6. ระบบแจ้งเตือน Critical
    
7. ระบบส่ง Telegram Notification
    
8. Nurse สามารถเห็นเตียงที่ต้องดูแลก่อน
    
9. สามารถแสดง Historical Data เบื้องต้น
    

---

# 39. Pilot Plan

## Phase 1: Prototype

```text
1–3 Devices
```

เป้าหมาย:

- Validate Sensor
    
- Validate Weight Accuracy
    
- Validate ETE
    
- Validate Connectivity
    

---

## Phase 2: Ward Pilot

```text
10–20 Beds
```

เป้าหมาย:

- Validate Workflow
    
- Measure Nurse Walking Time
    
- Measure Alert Accuracy
    
- Measure Response Time
    

---

## Phase 3: Ward Deployment

```text
50–100 Beds
```

เป้าหมาย:

- Validate Scalability
    
- Validate Infrastructure
    
- Validate Device Management
    

---

## Phase 4: Hospital Deployment

```text
100–500+ Beds
```

เพิ่ม

- Enterprise Dashboard
    
- Advanced Analytics
    
- Hospital Integration
    
- AI
    

---

# 40. Pilot Metrics

ก่อนและหลังติดตั้ง SMIS เปรียบเทียบ

### Operational Metrics

- Nurse Walking Time
    
- Manual IV Checks
    
- Average Response Time
    

### Product Metrics

- Alert Accuracy
    
- False Alert Rate
    
- ETE Accuracy
    
- Device Uptime
    

### User Metrics

- Nurse Satisfaction
    
- Ease of Use
    
- Alert Trust
    
- Workflow Acceptance
    

---

# 41. Go-to-Market Strategy

แนะนำการขยายตลาดแบบ

```text
1 Ward
    ↓
Pilot
    ↓
Measure ROI
    ↓
3–5 Wards
    ↓
Whole Hospital
    ↓
Hospital Network
```

---

# 42. Business KPI

## Revenue

- MRR
    
- ARR
    
- Revenue per Hospital
    

## Growth

- Number of Hospitals
    
- Number of Wards
    
- Number of Devices
    

## Economics

- CAC
    
- LTV
    
- Gross Margin
    
- Payback Period
    

## Retention

- Churn Rate
    
- Renewal Rate
    

---

# 43. Business Flywheel

```text
More Devices
      ↓
More Clinical Data
      ↓
Better Prediction
      ↓
Better Alert
      ↓
Better Workflow Intelligence
      ↓
More Hospital Value
      ↓
More Hospitals
      ↓
More Data
```

ระยะยาว Competitive Moat ของ SMIS ควรอยู่ที่

> Clinical Workflow Data + Intelligence + Hospital Integration

มากกว่าการแข่งขันด้าน Hardware เพียงอย่างเดียว

---

# 44. Product Roadmap

## Phase 1 — MVP

Focus:

> Visibility

Features:

- Real-time Dashboard
    
- Ward View
    
- Bed Grid
    
- IV Monitoring
    
- Alert
    
- Priority Queue
    

---

## Phase 2 — Pilot

Focus:

> Workflow Optimization

Features:

- Real IoT Device
    
- Device Management
    
- Historical Data
    
- Analytics
    
- Telegram / LINE
    

---

## Phase 3 — Hospital Scale

Focus:

> Operational Intelligence

Features:

- Multi-Ward
    
- Multi-Hospital
    
- Advanced Analytics
    
- Hospital Integration
    

---

## Phase 4 — AI Platform

Focus:

> Predictive Intelligence

Features:

- Predictive Refill
    
- Anomaly Detection
    
- Predictive Maintenance
    
- Workflow Intelligence
    

---

# 45. Risk & Mitigation

## Hardware Accuracy

Risk:

Load Cell อ่านค่าไม่แม่น

Mitigation:

- Calibration
    
- Filtering
    
- Sensor Validation
    

---

## Connectivity

Risk:

Wi-Fi หลุด

Mitigation:

- Local Buffer
    
- Auto Reconnect
    
- Offline Detection
    

---

## False Alert

Risk:

Alert มากเกินไป

Mitigation:

- Threshold Tuning
    
- Alert Debouncing
    
- Confidence Score
    

---

## Battery

Risk:

Device หมดแบต

Mitigation:

- External Power
    
- Low Battery Alert
    
- Battery Monitoring
    

---

## Clinical Adoption

Risk:

พยาบาลไม่ใช้ระบบ

Mitigation:

- Simple UI
    
- Minimal Interaction
    
- Priority-first Design
    
- Pilot กับ Nurse จริง
    

---

## Regulatory

Risk:

ข้อกำหนด Medical Device

Mitigation:

- Regulatory Assessment
    
- Medical Device Classification
    
- Security & Privacy Review
    

---

# 46. Core Product Principle

SMIS ต้องออกแบบโดยยึดหลัก

> **Don't Make Nurses Monitor More. Make Nurses Monitor Less, but Act Better.**

ระบบไม่ควรเพิ่มข้อมูลให้พยาบาลต้องอ่านมากขึ้น

แต่ควรลด Cognitive Load โดยแปลง

```text
Raw IoT Data
```

เป็น

```text
Actionable Information
```

และสุดท้ายเป็น

```text
Clinical Action
```

---

# 47. Final Product Vision

SMIS เริ่มต้นจากการแก้ปัญหา

> "สารน้ำใกล้หมด"

แต่เป้าหมายระยะยาวคือการสร้าง

> **Real-time Clinical Workflow Intelligence Platform**

ที่สามารถช่วยทีมโรงพยาบาลตอบคำถามว่า

> **What needs attention?**

> **How urgent is it?**

> **Who should act?**

> **What should happen next?**

และในอนาคตสามารถขยายจาก

```text
IV Monitoring
```

ไปสู่

```text
Patient Monitoring
+
Ward Intelligence
+
Clinical Workflow Intelligence
+
Hospital Operations Intelligence
```

โดยมี IoT เป็น Data Layer และ AI เป็น Intelligence Layer

---

# 48. One-line Value Proposition

> **SMIS helps nurses know which patient needs attention first—using real-time IoT data and intelligent priority management to reduce manual monitoring, improve workflow efficiency, and enhance patient safety.**

ภาษาไทย:

> **SMIS ช่วยให้พยาบาลรู้ว่า "ผู้ป่วยคนไหนต้องได้รับการดูแลก่อน" ด้วยข้อมูล Real-time จาก IoT และระบบจัดลำดับความสำคัญอัจฉริยะ เพื่อลดภาระการตรวจแบบ Manual เพิ่มประสิทธิภาพการทำงาน และยกระดับความปลอดภัยของผู้ป่วย**
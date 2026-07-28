# SMIS — Pitch Deck

## Smart IV Monitoring System

### From Manual Monitoring to Proactive Patient Care

**Real-time Clinical Workflow Intelligence Platform**

ระบบติดตามสารน้ำอัจฉริยะที่ช่วยให้พยาบาลรู้ว่า **“ผู้ป่วยคนไหนต้องได้รับการดูแลก่อน”** พร้อมแจ้งเตือนแบบ Real-time และจัดลำดับความเร่งด่วนโดยอัตโนมัติ

**Keywords**

AI · IoT · Real-time · Smart Hospital · Patient Safety

---

# Slide 1 — Cover

## Smart IV Monitoring System

### From Manual Monitoring to Proactive Patient Care

**Real-time Clinical Workflow Intelligence Platform**

ระบบติดตามสารน้ำอัจฉริยะที่ช่วยให้พยาบาลรู้ว่า

> “ผู้ป่วยคนไหนต้องได้รับการดูแลก่อน”

พร้อมแจ้งเตือนแบบ Real-time และจัดลำดับความเร่งด่วนโดยอัตโนมัติ

**Keywords**

- AI
- IoT
- Real-time
- Smart Hospital
- Patient Safety

---

# Slide 2 — The Problem

## พยาบาลยังต้องเดินตรวจ IV ทีละเตียง

ปัจจุบันการติดตามสารน้ำส่วนใหญ่ยังอาศัยการตรวจสอบแบบ Manual

พยาบาลต้อง:

> เดินตรวจ → สังเกตระดับน้ำเกลือ → ประเมินด้วยตนเอง → จดจำ → เดินกลับไปเปลี่ยน

เมื่อจำนวนผู้ป่วยเพิ่มขึ้น ปัญหาก็เพิ่มขึ้นตามมา

### 01 — Patient Safety Risk

สารน้ำหมดโดยไม่มีการแจ้งเตือน

อาจทำให้เกิดความเสี่ยงต่อความปลอดภัยของผู้ป่วย และทำให้พยาบาลตรวจพบเหตุการณ์ล่าช้า

### 02 — Nursing Workload

พยาบาลเสียเวลาเดินตรวจและตรวจสอบสารน้ำหลายเตียง

ลดเวลาที่ควรนำไปใช้ในการดูแลผู้ป่วยโดยตรง

### 03 — No Real-time Visibility

ไม่สามารถมองเห็นสถานะของสารน้ำทุกเตียงใน Ward หรือหลาย Ward ได้จากจุดเดียวแบบ Real-time

### 04 — No Priority Management

ไม่สามารถจัดลำดับได้อย่างชัดเจนว่า

> “เตียงไหนควรได้รับการดูแลก่อน?”

---

# Slide 3 — The Hidden Problem

## พยาบาลไม่ได้ขาดข้อมูล
## แต่ขาด “ข้อมูลที่นำไปสู่การตัดสินใจ”

ใน Ward ที่มีผู้ป่วยจำนวนมาก

100 Beds
↓
100 IV Bags
↓
หลายระดับการไหล
↓
หลายเวลาที่จะหมด
↓
พยาบาลต้องตัดสินใจว่า
“เตียงไหนต้องไปก่อน?”

ปัญหาที่แท้จริงจึงไม่ใช่แค่

> “IV เหลือเท่าไร?”

แต่คือ

> “ผู้ป่วยคนไหนต้องได้รับการดูแลก่อน?”

นี่คือจุดที่ SMIS เข้ามาแก้ปัญหา

---

# Slide 4 — Our Solution

## Smart IV Monitoring System

SMIS เปลี่ยนการติดตาม IV จาก

### Reactive Monitoring

> เดินตรวจ → พบปัญหา → แก้ไข

เป็น

### Proactive Patient Care

> Monitor → Predict → Alert → Prioritize → Act

ระบบเชื่อมต่อ

IoT Device
↓
Real-time Data
↓
Intelligent Monitoring
↓
Alert & Priority Engine
↓
Nurse Workflow

### Core Value Proposition

SMIS ช่วยให้พยาบาลเห็นสถานะสารน้ำของผู้ป่วยทุกเตียงแบบ Real-time พร้อมจัดลำดับเตียงที่ต้องดูแลก่อน ลดการเดินตรวจที่ไม่จำเป็น และแจ้งเตือนความผิดปกติก่อนเกิดเหตุการณ์สำคัญ

---

# Slide 5 — How It Works

## From IV Bag to Action

IV Bag
↓
Load Cell Sensor
↓
ESP32
↓
Real-time Data
↓
SMIS Cloud Platform
↓
Alert Engine + Priority Engine
↓
Nurse Dashboard
↓
Take Action

### ผลลัพธ์

พยาบาลไม่ต้องถามว่า

> “ต้องเดินตรวจเตียงไหนก่อน?”

ระบบจะช่วยตอบว่า

> “เตียงไหนต้องได้รับการดูแลก่อน”

### Core Workflow

> Monitor → Alert → Prioritize → Act

---

# Slide 6 — Product

## One Dashboard. Every Bed. Real-time.

Dashboard แสดงข้อมูลสำคัญของทุกเตียงจากศูนย์กลาง

### IV Monitoring

- Remaining %
- Remaining Volume (mL)
- Flow Rate
- Estimated Time to Empty (ETE)

### Smart Alert

- IV Low
- IV Empty
- Device Offline
- Abnormal Flow
- Occlusion

### Priority Queue

ระบบจัดลำดับเตียงตาม:

- Remaining %
- Flow Rate
- ETE
- Alert Severity

### Dashboard Overview

- Ward Overview
- Bed Status
- IV Status
- Alert Status
- Device Status
- Real-time KPI
- Analytics

---

# Slide 7 — Priority Queue

## From Data to Decision

แทนที่จะให้พยาบาลดูข้อมูล 100 เตียงเอง

SMIS เปลี่ยนข้อมูลเป็น Actionable Priority

### Example

🚨 CRITICAL

Bed 08

IV Empty

Action Required

---

🔴 HIGH

Bed 03

ETE 12 min

---

🟠 MEDIUM

Bed 05

ETE 35 min

---

🟢 NORMAL

Bed 01

ETE 3 hr

### Core Value

> พยาบาลไม่ต้องตรวจทุกเตียงด้วยความเร่งด่วนเท่ากัน

แต่สามารถ

> “จัดลำดับการดูแลตามความเร่งด่วน”

---

# Slide 8 — Intelligent Monitoring

## IoT + AI

### Today — Rule-based Intelligence

ระบบสามารถตรวจจับ:

- IV ใกล้หมด
- IV หมด
- Flow ผิดปกติ
- Device Offline

ตัวอย่าง Rule:

Remaining < 20%
→ Low IV

ETE < 30 min
→ High Priority

Device Offline > 5 min
→ Device Alert

---

### Tomorrow — AI-powered Intelligence

#### Anomaly Detection

ตรวจจับรูปแบบการไหลที่ผิดปกติ

- IV ไม่ไหล
- ไหลเร็วผิดปกติ
- น้ำหนักลดผิดปกติ
- Sensor ผิดปกติ
- Device ถูกถอด

↓

#### Predictive Refill

คาดการณ์เวลาที่ควรเปลี่ยน IV ล่วงหน้า

↓

#### Auto-Bag Change Detection

ตรวจจับการเปลี่ยนถุงสารน้ำอัตโนมัติจากข้อมูลน้ำหนัก

### AI Roadmap

Rule-based
↓
Anomaly Detection
↓
Predictive Intelligence

### Vision

> จาก Monitoring System สู่ Predictive Clinical Intelligence

---

# Slide 9 — Technology

## Built for Real-time Healthcare

### IoT Layer

ESP32 + Load Cell + HX711

วัดน้ำหนักสารน้ำ → คำนวณปริมาณคงเหลือ → ส่งข้อมูลแบบ Real-time

### Backend

- NestJS
- tRPC
- PostgreSQL
- Prisma ORM

ใช้สำหรับจัดการข้อมูล Business Logic และระบบ Backend

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts

ใช้สำหรับสร้าง Nurse Dashboard และ Management Dashboard

### Real-time Communication

- Socket.IO
- WebSocket

อัปเดตข้อมูลประมาณทุก 5–10 วินาที

### Deployment

- Docker
- Vercel
- VPS / Cloud

---

# Slide 10 — Who Benefits?

## One Platform. Multiple Stakeholders.

### Nurse

> เห็นทุกเตียง → รับ Alert → รู้ว่าใครต้องดูแลก่อน

ประโยชน์:

- ลดการเดินตรวจที่ไม่จำเป็น
- เห็นสถานะ IV แบบ Real-time
- จัดลำดับงานตามความเร่งด่วน
- ตอบสนองต่อเหตุการณ์ได้เร็วขึ้น

---

### Head Nurse

> เห็นภาพรวมทั้ง Ward → วิเคราะห์ประสิทธิภาพ → บริหารทรัพยากร

ประโยชน์:

- เห็นสถานะของทุกเตียง
- ติดตาม Performance ของ Ward
- วิเคราะห์ Alert และ Incident
- บริหารภาระงานของทีม

---

### Hospital

> ลดภาระงาน → เพิ่ม Patient Safety → Data-driven Healthcare

ประโยชน์:

- ลด Manual Monitoring
- เพิ่มประสิทธิภาพการใช้บุคลากร
- ลดความเสี่ยงจาก IV หมด
- สร้างข้อมูลสำหรับ Smart Hospital

---

### System Administrator

> จัดการ IoT → ตรวจสอบ Device → จัดการ User & Access

ประโยชน์:

- Device Monitoring
- User Management
- Role & Permission
- System Configuration
- Notification Management

---

# Slide 11 — Value Proposition

## We Don't Sell an IV Sensor

### We Sell Better Nursing Workflow

SMIS ช่วยให้โรงพยาบาล:

### 01 — Reduce Manual Monitoring

ลดเวลาที่พยาบาลต้องเดินตรวจ IV โดยไม่จำเป็น

### 02 — Improve Patient Safety

แจ้งเตือนก่อนเกิดเหตุการณ์สำคัญ

### 03 — Prioritize Nursing Work

ช่วยให้พยาบาลดูแลผู้ป่วยตามระดับความเร่งด่วน

### 04 — Enable Data-driven Healthcare

เปลี่ยนข้อมูลจาก IoT ให้เป็นข้อมูลสำหรับการตัดสินใจ

### Core Value Proposition

> SMIS ไม่ได้ขาย “อุปกรณ์วัดน้ำเกลือ”

แต่ขาย

> “ระบบที่ช่วยให้พยาบาลรู้ว่าใครต้องได้รับการดูแลก่อน และลดงานตรวจที่ไม่จำเป็น”

---

# Slide 12 — Business Model

## Hardware-enabled Healthcare SaaS

เราไม่ได้มุ่งกำไรหลักจากการขาย Hardware

แต่สร้าง Recurring Revenue จาก Software และ Service

### Revenue Streams

1. Subscription
2. Device Rental
3. Implementation
4. HIS Integration
5. Analytics
6. Maintenance
7. Enterprise SLA
8. White-label / OEM

### Pricing Concept

Subscription แบบคิดตามจำนวนเตียงต่อเดือน

Target Pricing:

> ประมาณ 500–700 บาท / เตียง / เดือน

หมายเหตุ:

ตัวเลขนี้เป็น Preliminary Estimate และต้อง Validate จาก Pilot

---

# Slide 13 — Unit Economics

## Build Once. Scale Across Beds.

### Target Economics

Subscription
ประมาณ 500–700 บาท / Bed / Month

↓

Recurring Revenue

↓

Cloud + Support
+ Maintenance
+ Device Replacement

↓

Contribution Margin

### Key Principle

> Hardware เป็นตัวเปิดประตู

> Software + Data + Workflow เป็นตัวสร้าง Recurring Revenue

### Target

> Unit Economics Payback < 6 Months

หมายเหตุ:

ต้องคำนวณจาก Contribution Margin จริง ไม่ใช่ Gross Profit เพียงอย่างเดียว

ต้องพิจารณา:

- Hardware Cost
- Installation
- Calibration
- Cloud
- Support
- Maintenance
- Warranty
- Device Failure
- Battery Replacement
- Sales Cost
- Customer Acquisition Cost

---

# Slide 14 — ROI for Hospital

## The Value Is Not Just Cost Saving

SMIS ไม่ได้มุ่งลดจำนวนพยาบาล

แต่ช่วยให้พยาบาลใช้เวลาไปกับ

> Patient Care มากขึ้น

แทนที่จะใช้เวลาไปกับ

> Manual IV Monitoring

### Value Shift

#### Before

Manual Checking
↓
Walking
↓
Re-checking
↓
Low-value Tasks

#### After

Real-time Monitoring
↓
Smart Alert
↓
Priority Queue
↓
Focused Patient Care

### Pilot KPI

เราจะพิสูจน์ด้วย Time-motion Study

เพื่อวัด:

- เวลาที่ใช้ตรวจ IV
- ระยะทางการเดิน
- เวลาตอบสนองต่อ Alert
- เวลาจัดการ Alert
- เวลาที่นำกลับไปใช้กับ Patient Care

### Key Principle

ไม่ควรอ้างว่าเป็น “Labor Cost Saved” โดยตรง

แต่ควรวัด

> Nursing Time Reallocated

หรือ

> เวลาของพยาบาลที่ถูกนำกลับไปใช้ในการดูแลผู้ป่วย

---

# Slide 15 — Go-to-Market

## Land → Prove → Expand → Integrate → Platform

### Phase 1 — Proof of Value

ติดตั้ง 1 Ward / ประมาณ 20 Beds

เป้าหมาย:

- Time-motion Study
- Alert Accuracy
- False Alert Rate
- Nurse Adoption
- Device Reliability

↓

### Phase 2 — Paid Pilot

เริ่มจากโรงพยาบาลเอกชนขนาดกลาง 2–3 แห่ง

เป้าหมาย:

- Validate Willingness to Pay
- Validate Pricing
- Validate Workflow
- Validate Unit Economics

↓

### Phase 3 — Scale & Integrate

ขยายไปหลาย Ward

เพิ่ม:

- HIS Integration
- API
- Analytics
- Enterprise Dashboard

↓

### Phase 4 — Platform

ขยายจาก IV Monitoring ไปสู่ Medical Monitoring Use Cases อื่น

---

# Slide 16 — Market Expansion

## From One Use Case to a Healthcare Platform

เริ่มจาก

### IV Monitoring

↓

ขยายไปยัง

### Urine Output

ติดตามปริมาณปัสสาวะเพื่อสนับสนุนการติดตามผู้ป่วยใน ICU

↓

### Wound Drain

ติดตามปริมาณสารระบายจากแผล

↓

### Enteral Feeding

ติดตามปริมาณอาหารทางสายให้อาหาร

↓

### Oxygen

ติดตามปริมาณออกซิเจนและอุปกรณ์ที่เกี่ยวข้อง

↓

### Medical Device Monitoring

ต่อยอดสู่การติดตามอุปกรณ์ทางการแพทย์ประเภทอื่น

### Long-term Vision

> One Platform for Multiple Clinical Monitoring Use Cases

ข้อได้เปรียบ:

- Reuse Backend
- Reuse IoT Infrastructure
- Reuse Dashboard
- Reuse Data Platform
- Reuse AI
- Reuse Hospital Integration
- Reuse Sales Network

---

# Slide 17 — Competitive Advantage

## Our Moat Is Not the Hardware

Hardware สามารถถูกเลียนแบบได้

แต่สิ่งที่สร้างความได้เปรียบระยะยาวคือ:

### 01 — Data

ข้อมูลการไหลและพฤติกรรมการใช้งานจริง

### 02 — Workflow

ระบบเข้าไปอยู่ในกระบวนการทำงานจริงของพยาบาล

### 03 — Integration

เชื่อมต่อกับ HIS และระบบโรงพยาบาล

### 04 — Clinical Validation

มีหลักฐานว่าสามารถลดภาระงานและเพิ่ม Patient Safety ได้จริง

### 05 — Regulatory

ผ่านกระบวนการรับรองที่สร้าง Barrier to Entry

### Competitive Moat

> Data + Workflow + Integration + Regulatory + Clinical Validation

---

# Slide 18 — Validation & KPIs

## What We Need to Prove

### Clinical KPI

- Alert Detection Accuracy
- False Alert Rate
- Missed Event Rate
- Abnormal Flow Detection Accuracy

### Operational KPI

- Nurse Monitoring Time
- Nurse Walking Distance
- Response Time
- Alert Resolution Time
- Nursing Time Reallocated

### Technical KPI

- Sensor Accuracy
- Device Uptime
- Battery Life
- Data Transmission Reliability
- Device Failure Rate

### Business KPI

- Revenue / Bed
- COGS / Bed
- Contribution Margin
- CAC
- LTV
- Customer Retention
- Expansion Revenue
- Payback Period

---

# Slide 19 — Regulatory & Risk

## Build for Healthcare. Validate Before Scale.

เนื่องจาก SMIS เป็นระบบที่เกี่ยวข้องกับ Healthcare และอาจเกี่ยวข้องกับ Medical Device Regulation จำเป็นต้องประเมิน Regulatory Classification ก่อนการลงทุนเชิงพาณิชย์

### สิ่งที่ต้องประเมิน

- Intended Use
- Medical Device Classification
- Clinical Risk
- Software Classification
- Electrical Safety
- EMC
- Risk Management
- Cybersecurity
- Clinical Evaluation
- Quality Management System

### Potential Standards / Certifications

- อย.
- ISO 13485
- IEC 60601-1
- EMC
- IEC 62304

หมายเหตุ:

ค่าใช้จ่ายและข้อกำหนดจริงขึ้นอยู่กับ Intended Use และ Regulatory Classification

ควรทำ:

> Regulatory Classification Assessment

ก่อนลงทุนพัฒนาเชิงพาณิชย์เต็มรูปแบบ

---

# Slide 20 — Future Vision

## From Smart IV Monitoring
## to Smart Hospital Intelligence

SMIS
↓
IV Monitoring
↓
Clinical Monitoring
↓
Predictive Intelligence
↓
Smart Hospital Platform

### Vision

> เปลี่ยนข้อมูล Real-time จากอุปกรณ์ IoT ให้กลายเป็น Intelligence ที่ช่วยให้บุคลากรทางการแพทย์ตัดสินใจได้เร็วขึ้น และใช้เวลาไปกับผู้ป่วยมากขึ้น

---

# Slide 21 — Closing

## The Future of Patient Care
## Is Proactive, Not Reactive.

วันนี้พยาบาลต้อง

> เดินหา → ตรวจสอบ → ตัดสินใจ

ด้วย SMIS

> ระบบมองเห็น → ระบบแจ้งเตือน → ระบบจัดลำดับ → พยาบาลลงมือดูแล

### Smart IV Monitoring System

> “Know Who Needs Care First.”

### Final Message

> From Manual Monitoring
> to Proactive Patient Care.

---

# Business Model Summary

## Core Business

SMIS เป็น

> Hardware-enabled Healthcare SaaS

ไม่ใช่เพียงอุปกรณ์ IoT สำหรับวัดน้ำหนักถุง IV

แต่เป็น Platform ที่เชื่อมต่อ:

IoT Device
↓
Real-time Data
↓
Monitoring
↓
Alert
↓
Priority Engine
↓
Nurse Workflow
↓
Analytics
↓
AI

---

# Business Model Canvas

## Customer Segments

### Primary

- Private Hospitals
- Medium-sized Hospitals
- Hospitals with high nurse workload
- Medical Ward
- ICU

### Secondary

- Government Hospitals
- Smart Hospital Projects
- Medical Device Distributors
- Research Institutions

---

## Value Proposition

> Real-time IV Monitoring ที่ช่วยให้พยาบาลรู้ว่า “เตียงไหนต้องดูแลก่อน” โดยไม่ต้องเดินตรวจทุกเตียงด้วยความเร่งด่วนเท่ากัน

---

## Channels

- Direct Hospital Sales
- Medical Device Distributor
- Hospital Innovation Program
- Government Smart Hospital Program
- Research Partnership

---

## Customer Relationship

- Proof of Value
- Pilot Program
- Onboarding
- Training
- Customer Success
- SLA Support
- Maintenance

---

## Revenue Streams

- SaaS Subscription
- Device Rental
- Implementation
- HIS Integration
- Analytics
- Maintenance
- Enterprise SLA
- White-label / OEM

---

## Key Resources

- IoT Hardware
- Software Platform
- Clinical Data
- AI Models
- Regulatory Certification
- Hospital Partnerships
- Clinical Validation

---

## Key Activities

- Hardware Development
- Firmware Development
- Software Development
- Clinical Validation
- Regulatory Compliance
- Hospital Deployment
- Customer Support
- Data Analysis

---

## Key Partners

- Hospitals
- Nurses
- Medical Device Distributors
- IoT Manufacturers
- Cloud Providers
- Universities
- Research Institutions

---

## Cost Structure

- Hardware R&D
- Software R&D
- Firmware R&D
- Hardware Production
- Cloud Infrastructure
- Regulatory Certification
- Clinical Validation
- Customer Support
- Calibration
- Warranty
- Device Replacement
- Sales & Marketing

---

# Recommended Pitch Flow

สำหรับ Pitch ประมาณ 5–7 นาที แนะนำใช้ประมาณ 10–12 Slides

1. Cover
2. Problem
3. Hidden Problem
4. Solution
5. How It Works
6. Priority Queue
7. Business Value
8. Business Model
9. Go-to-Market
10. Validation
11. Competitive Advantage
12. Vision / Closing

---

# Core Pitch Narrative

พยาบาลไม่ได้ต้องการข้อมูลเพิ่ม

แต่ต้องการรู้ว่า

> “ใครต้องได้รับการดูแลก่อน”

ปัจจุบันการตรวจ IV แบบ Manual ทำให้พยาบาลต้องเดินตรวจทีละเตียง

↓

เมื่อมีผู้ป่วยจำนวนมาก

↓

ไม่สามารถเห็นภาพรวมแบบ Real-time

↓

ไม่สามารถจัดลำดับความเร่งด่วนได้อย่างมีประสิทธิภาพ

↓

เกิดความเสี่ยงและภาระงานที่ไม่จำเป็น

SMIS จึงเข้ามาเปลี่ยน

> Data → Insight → Priority → Action

จาก

> Reactive Monitoring

เป็น

> Proactive Patient Care

และในระยะยาว

> IoT → Data → AI → Clinical Intelligence → Smart Hospital

---

# Core Positioning

## SMIS is a Real-time Clinical Workflow Intelligence Platform

SMIS ไม่ใช่เพียงเครื่องวัดน้ำเกลือ

แต่เป็นระบบที่ช่วยให้โรงพยาบาล:

- เห็นสถานะผู้ป่วยแบบ Real-time
- ตรวจพบความผิดปกติเร็วขึ้น
- จัดลำดับความเร่งด่วน
- ลดงาน Manual Monitoring
- เพิ่มเวลาที่พยาบาลใช้ในการดูแลผู้ป่วย
- สร้างข้อมูลสำหรับ Data-driven Healthcare
- วางรากฐานสู่ Smart Hospital

---

# One-line Value Proposition

> **SMIS ช่วยให้พยาบาลเห็นสถานะสารน้ำของผู้ป่วยทุกเตียงแบบ Real-time พร้อมจัดลำดับเตียงที่ต้องดูแลก่อน ลดการเดินตรวจที่ไม่จำเป็น และแจ้งเตือนความผิดปกติก่อนเกิดเหตุการณ์สำคัญ**

---

# One-line Business Positioning

> **SMIS คือ Hardware-enabled Healthcare SaaS ที่เปลี่ยนข้อมูลจาก IoT ให้เป็น Clinical Workflow Intelligence เพื่อช่วยให้พยาบาลตัดสินใจได้เร็วขึ้นและใช้เวลาไปกับผู้ป่วยมากขึ้น**

---

# One-line Vision

> **เปลี่ยนการบริหาร IV จาก Reactive Monitoring เป็น Proactive Patient Care และต่อยอดสู่ Clinical Monitoring Platform สำหรับ Smart Hospital**

---

# Key Message

> ## We Don't Sell an IV Sensor.
> ## We Sell Better Nursing Workflow.

และในระยะยาว

> ## We Don't Just Monitor.
> ## We Help Healthcare Teams Know Who Needs Care First.
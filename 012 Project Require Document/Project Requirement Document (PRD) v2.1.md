---
title: "SMIS — Project Requirement Document (Consolidated)"
project: Smart IV Monitoring System (SMIS)
type: prd
status: draft
version: 2.1
date: 2026-08-22
supersedes: "[[Master PRD]] v2.0"
incorporates: "[[Root  Cause]] v1.0, [[Project Require Document (PRD)]], [[SMIS (Smart IV Monitoring System)]], 013 Architecture/*"
tags:
  - smis
  - prd
  - requirement
  - healthcare-iot
---

# Project Requirement Document (PRD) v2.1

> **สถานะเอกสาร:** เอกสารนี้เป็นฉบับ **รวมและปรับปรุง (Consolidated & Corrected)** จากเอกสารทั้งหมดในโฟลเดอร์นี้และเอกสาร Architecture ที่เกี่ยวข้อง โดยยึด [[Master PRD]] (v2.0) เป็นฐาน แล้ว **แก้ไขตามข้อค้นพบใน [[Root  Cause]]** ซึ่งชี้ว่าสมมติฐานหลายจุดของ v2.0 ยังไม่ได้ validate กับพยาบาลจริง ตัวเลข/สมมติฐานที่ยังไม่ยืนยันจะกำกับด้วย ⚠️ เสมอ

---

# 0. Change Log — สิ่งที่ต่างจาก Master PRD v2.0

เอกสารต้นทางในโฟลเดอร์นี้มีความไม่ตรงกันหลายจุด ตารางนี้บันทึกไว้เพื่อไม่ให้ทีมอ้างเลขคนละชุดกันอีก

| หัวข้อ | Master PRD v2.0 เดิม | อ้างจากเอกสารอื่น | **มติที่ใช้ในฉบับนี้ (v2.1)** |
|---|---|---|---|
| Positioning หลัก | "ลด Nurse Walking Time" | [[Root  Cause]]: พยาบาลเดินรอบรวมอยู่แล้ว IV เป็นแค่ 1 ใน 10 อย่างที่ดู | **"ลดงานแทรก (Interrupt-driven Task)"** เป็นคุณค่าหลัก, ลดเวลาเดินเป็นผลพลอยได้รอง (§5, §16) |
| Success Metric หลัก | Nurse Walking Time Reduction > 50% | [[Root  Cause]] ระบุเป็นสมมติฐานที่ตัวเลขไม่มีที่มา; [[User Stories]] เขียนไว้คนละค่า (40%/80%/30%) | ใช้ **"งานแทรกนอกรอบ" และ "IV หมดค้าง" เป็น metric หลัก** (⚠️ ทั้งคู่ต้องเก็บ baseline จริงก่อน) — เลขเดิมทุกชุดเก็บไว้เป็น legacy ในตาราง §16.3 |
| Head Nurse Value | Real-time Ward Overview | [[Root  Cause]]: หัวหน้าหอไม่อยู่หน้าจอ ต้องการรายงานย้อนหลัง | **Analytics/รายงานย้อนหลัง > Real-time Dashboard** สำหรับ Head Nurse (§7.2, §9) |
| ROI Model | ROI = ประหยัดค่าแรงพยาบาลจากชั่วโมงที่ลดได้ | [[Root  Cause]]: รพ. ไม่ลดคนตามชั่วโมงที่ประหยัด | ROI Calculator **คงไว้เป็นเครื่องมือเสริม** แต่ตัว value หลักเปลี่ยนเป็น **Risk Reduction / Patient Satisfaction / Staffing Evidence** (§14.2) |
| Regulatory | อยู่ในหัวข้อ Risk ท้ายเอกสาร | [[Root  Cause]]: ผู้เซ็นอนุมัติจริงถาม อย. เป็นข้อแรก | ย้ายเป็น **Go-to-Market Gate** ต้องผ่านก่อนเข้า Pilot ที่มีผู้ป่วยจริง ไม่ใช่ risk ปลายเอกสาร (§13.5, §17) |
| False Alert | ระบุเป็น Risk ทั่วไป | [[Root  Cause]]: เกิน 3–4 ครั้ง/วัน (ไม่จำเป็น) → เลิกใช้ใน 1 สัปดาห์ | เพิ่มเป็น **Hard Requirement**: False Alert ต้องต่ำกว่า threshold ที่ระบุ ไม่ใช่แค่ mitigation (§10.6, §12) |
| Device Offline Threshold | "เกิน Threshold" (ไม่ระบุตัวเลข) | [[IoT Architecture]]: Warning > 30s, Offline > 60s | ใช้ตัวเลขจาก IoT Architecture เป็นสเปกจริง (§11.4) |
| Priority Score | แนวคิด: Remaining% + Flow Rate + ETE + Severity + Context (ไม่มีสูตร) | [[Application Architecture]]: มีสูตรถ่วงน้ำหนักจริง | ใช้สูตรจาก Application Architecture เป็น MVP formula, ใช้ P1–P4 band ของ Master PRD เป็น label การแสดงผล (§10.5) |
| Update Interval | "5–10 sec" | [[IoT Architecture]]: sensor 1s / upload 5s / dashboard 1–5s | รวมเป็นสเปกเดียว: sensor sampling 1s → upload ปกติ 5–10s → event-based ทันทีเมื่อ Critical/Empty/Offline (§11.3) |
| Notification MVP | Dashboard + Telegram | [[Project Require Document (PRD)]] เขียนรวม LINE OA/Email/Telegram/Dashboard ไว้ด้วยกันไม่แยก MVP/Future | คง MVP = Dashboard + Telegram ตาม Master PRD/Application Architecture/Dev Plan Sprint 4; LINE OA/Email/SMS/Push = Future (§10.8) |

---

# 1. Document Overview

| Item | Detail |
|---|---|
| Product | Smart IV Monitoring System (SMIS) |
| Document Type | Project Requirement Document (Consolidated) |
| Version | 2.1 |
| Status | Draft — MVP / Prototype (ยังไม่ validate กับพยาบาลจริง) |
| Base Document | [[Master PRD]] v2.0 |
| Correction Source | [[Root  Cause]] v1.0 |
| Related | [[PRD For Pitch (Conclusion)]] · [[Project Require Document (PRD)]] · [[SMIS (Smart IV Monitoring System)]] · [[User Stories]] · [[Application Architecture]] · [[Hardware & Firmware Architecture]] · [[IoT Architecture]] · [[Development Plan]] · [[Phase Plan]] |

---

# 2. Executive Summary

Smart IV Monitoring System (SMIS) คือแพลตฟอร์ม **Real-time Clinical Workflow Intelligence** สำหรับโรงพยาบาล ที่ใช้ IoT Sensor ติดตามสถานะสารน้ำของผู้ป่วยแบบ Real-time และแปลงข้อมูลจากอุปกรณ์ IoT ให้เป็นข้อมูลที่ทีมพยาบาลใช้ตัดสินใจได้ทันที

ระบบไม่ได้มุ่งเน้นเพียงตอบว่า "สารน้ำเหลือกี่เปอร์เซ็นต์" แต่ต้องตอบคำถามของพยาบาลว่า **"ตอนนี้เตียงไหนต้องได้รับการดูแลก่อน"** และ (ตามข้อค้นพบใน Root Cause) ต้องช่วยลด **"งานแทรกที่ไม่ได้วางแผน"** ซึ่งเป็นสาเหตุจริงของปัญหา ไม่ใช่แค่การลดเวลาเดินตรวจ

> **Root Cause หลัก (ยืนยันจาก [[Root  Cause]]):** หอผู้ป่วยไม่มี "มิติเวลา" ของสารน้ำ — รู้แค่ *ตอนนี้เหลือเท่าไหร่* แต่ไม่รู้ *อีกนานแค่ไหนจะหมด* → งานเปลี่ยน IV จึงวางแผนล่วงหน้าไม่ได้และถูกบังคับให้เป็นงานแทรกเสมอ
>
> **นัยต่อโปรดักต์:** ฟีเจอร์แกนคือ **Estimated Time to Empty (ETE)** และ **Priority Queue** ไม่ใช่ Dashboard แสดง % สารน้ำเฉยๆ

---

# 3. Product Vision

> **To become the real-time clinical workflow intelligence layer that helps healthcare teams know what needs attention first — and act on it before it becomes an interruption.**

ภาษาไทย:

> **สร้างระบบอัจฉริยะที่ช่วยให้ทีมพยาบาลเห็นสถานะผู้ป่วยและอุปกรณ์แบบ Real-time รู้ว่า "เตียงไหนควรได้รับการดูแลก่อน" และวางแผนงานเปลี่ยน IV ล่วงหน้าได้ ไม่ใช่รอให้ญาติมาเรียก**

*(เพิ่มส่วน "วางแผนล่วงหน้าได้ ไม่ใช่รอให้ญาติมาเรียก" จาก Root Cause เพื่อให้ vision สะท้อน root cause จริง ไม่ใช่แค่ speed ของการแสดงผล)*

---

# 4. Product Positioning

SMIS ไม่ควรวางตำแหน่งเป็นเพียง "Smart IV Scale" หรือ "IoT IV Monitoring Device" แต่เป็น **Real-time Clinical Workflow Intelligence Platform** แบ่งเป็น 4 Layers:

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

# 5. Problem Statement (Revised)

## 5.1 Current Workflow

```text
Nurse → เดินตรวจแต่ละเตียง → ตรวจระดับสารน้ำ → ประเมินว่าใกล้หมดหรือไม่
      → จำสถานะ → กลับไปดูเตียงอื่น → เดินกลับมาเปลี่ยนถุง (มักถูกกระตุ้นโดยญาติ/กริ่ง)
```

เมื่อจำนวนเตียงเพิ่มขึ้น Workflow นี้ไม่ scale และงานเปลี่ยน IV กลายเป็น **งานแทรก** ที่ตัดจังหวะงานอื่น (เตรียมยา, ทำแผล) ซึ่งเป็นจุดเสี่ยงต่อความผิดพลาดทางคลินิก

## 5.2 Root Cause Chain (5 Whys — จาก [[Root  Cause]])

```text
งานเปลี่ยน IV กลายเป็นงานแทรกตลอดเวร
 └─ ทำไม? → รู้ว่า IV จะหมด ก็ต่อเมื่อมันหมดไปแล้วและมีคนมาเรียก
    └─ ทำไมรู้ช้า? → ประเมินได้แค่ตอนเดินผ่านเตียง = snapshot ไม่ใช่แนวโน้ม
       └─ ทำไมได้แค่ snapshot? → ดูระดับน้ำด้วยตา บอกได้แค่ "เหลือเท่าไหร่" ไม่บอก "อีกนานแค่ไหน"
          └─ ทำไมไม่รู้อีกนานแค่ไหน? → ไม่มีการวัดอัตราการไหลต่อเนื่อง คำนวณล่วงหน้าไม่ได้
             └─ ทำไมยังเป็นแบบนี้? → Workflow ทั้งระบบออกแบบให้ตอบสนองหลังเกิดเหตุ (reactive) ไม่ใช่วางแผนล่วงหน้า (proactive)
```

## 5.3 Key Problems (สำหรับ Requirement Traceability)

| ID | ปัญหา | ผู้เจอ | Requirement ที่ตอบ |
|---|---|---|---|
| P1 | IV หมดโดยไม่มีการแจ้งเตือนล่วงหน้า | Nurse | FR-ETE, FR-ALERT |
| P2 | งานเปลี่ยน IV เป็นงานแทรก ตัดจังหวะงานอื่น | Nurse | FR-PRIORITY, FR-ETE |
| P3 | เดินตรวจซ้ำเส้นทางเดิมทั้งที่ผู้ป่วยส่วนใหญ่ปกติ | Nurse | FR-DASHBOARD, FR-PRIORITY |
| P4 | ไม่เห็นภาพรวมทั้ง Ward จากจุดเดียว | Nurse, Head Nurse | FR-WARDVIEW |
| P5 | ไม่มีข้อมูลภาระงาน/เวลาตอบสนองของทีมเชิงตัวเลข | Head Nurse | FR-ANALYTICS |
| P6 | ไม่มีข้อมูลย้อนหลังเพียงพอสำหรับวิเคราะห์ | Head Nurse, Admin | FR-HISTORY, FR-ANALYTICS |

## 5.4 ⚠️ สมมติฐานที่ต้อง Validate ก่อน Commit เข้า Production Scope

จาก [[Root  Cause]] ภาคผนวก — สิ่งที่ PRD เดิมเชื่อ vs สิ่งที่ persona ชี้ (ยังไม่สัมภาษณ์พยาบาลจริง):

| สมมติฐานเดิม | สิ่งที่ Persona ชี้ | นัยต่อ Requirement |
|---|---|---|
| ลดเวลาเดินตรวจ 50% คือคุณค่าหลัก | พยาบาลเดินรอบรวมอยู่แล้ว IV เป็นแค่ 1 ใน 10 อย่างที่ดู | เปลี่ยน primary value เป็น "ลดงานแทรก" |
| ไม่มีใครรู้ว่า IV ใกล้หมด | ญาติเฝ้าไข้คือเซนเซอร์ตัวจริงที่มีอยู่แล้วและฟรี | คู่แข่งจริงไม่ใช่ "ไม่มีอะไรเลย" ต้องดีกว่าการรอญาติแจ้ง |
| Alert ยิ่งเยอะยิ่งดี | เกิน 3–4 ครั้ง/วันแบบไม่จำเป็น → เลิกใช้ใน 1 สัปดาห์ | False Alert Rate เป็น Hard Requirement |
| หัวหน้าหอต้องการ real-time overview | หัวหน้าหอไม่อยู่หน้าจอ ต้องการรายงานย้อนหลัง | Analytics ต้อง priority สูงกว่า live dashboard สำหรับ role นี้ |
| ROI = ประหยัดค่าแรงพยาบาล | รพ. ไม่ได้ลดคนตามชั่วโมงที่ประหยัดได้ | ROI ต้องรวม risk/satisfaction/staffing evidence |
| ผู้ใช้คือผู้ซื้อ | ผอ. + คณะกรรมการเครื่องมือแพทย์คือคนเซ็น และถาม อย. ก่อน | Regulatory เป็น gate ของ go-to-market ไม่ใช่ risk ท้ายเอกสาร |

**Action ก่อน Pilot จริง:** เก็บข้อมูล 1 ward × 1 สัปดาห์ (baseline งานแทรก/เวร, IV หมดค้าง/สัปดาห์, % ที่ญาติแจ้งก่อน) และสัมภาษณ์พยาบาลจริง 5–8 คน — ดู §16.4

---

# 6. Target Customers

## 6.1 Private Hospitals
Pain Points: ต้องการเพิ่ม Patient Safety, ลด Operational Cost, Digital Transformation, มีงบด้าน HealthTech

## 6.2 Public Hospitals
Pain Points: ผู้ป่วยมาก, บุคลากรจำกัด, Nurse Workload สูง
ข้อจำกัด: Procurement, Budget Cycle, Regulatory Requirement

## 6.3 Hospital Networks
ขยายเป็น **Central Hospital Command Center** ดูข้อมูลหลายโรงพยาบาลจากระบบเดียว (Phase 3+)

---

# 7. User Roles & Personas

## 7.1 Nurse (Primary User)

**Persona (จาก [[Root  Cause]]):** พยาบาลประจำการในหอผู้ป่วยสามัญ ดูแลผู้ป่วย 8–16 เตียง/เวร

Responsibilities:
- ดูสถานะเตียง / สถานะ IV แบบ Real-time
- รับ Alert และตรวจสอบ Critical Bed
- จัดการงานตาม Priority Queue โดยไม่ต้องเดินตรวจทุกเตียง

Pain Point ที่ระบบต้องแก้: ไม่รู้ล่วงหน้าว่า IV แต่ละเตียงจะหมดเมื่อไหร่ → วางแผนรอบเปลี่ยนถุงล่วงหน้าไม่ได้ → ถูกแทรกงานกลางคัน

## 7.2 Head Nurse (Buyer / Champion)

**Persona:** รับผิดชอบพยาบาล 12–18 คน และ 30+ เตียง

Responsibilities:
- ⚠️ **Analytics/รายงานย้อนหลัง สำคัญกว่า Real-time Dashboard** (ไม่ได้อยู่หน้าจอตลอดเวร)
- ตรวจสอบ Workload ของทีมด้วยข้อมูลจริง ไม่ใช่ความรู้สึก
- ใช้ข้อมูลนี้ประกอบการขออัตรากำลังคน / จัดเวร

Pain Point ที่ระบบต้องแก้: ไม่มีข้อมูลเชิงปริมาณเรื่องภาระงานและเวลาตอบสนองของทีม → บริหารกำลังคนด้วยความรู้สึก

## 7.3 Hospital Administrator

Responsibilities: ดู Performance ของโรงพยาบาล, วิเคราะห์ Operational Efficiency, KPI, ROI

## 7.4 System Administrator

Responsibilities: จัดการ User / Ward / Bed / Device, ตั้งค่า Alert Threshold

---

# 8. Product Goals

## 8.1 Primary Goals (Revised Priority Order)

1. **ให้ข้อมูล "อีกนานแค่ไหนจะหมด" (ETE)** ไม่ใช่แค่ "เหลือกี่ %" — ตอบ Root Cause ตรงจุด
2. จัดลำดับเตียงที่ควรได้รับการดูแลก่อน (Priority Queue)
3. แจ้งเตือนก่อนสารน้ำหมด โดยควบคุม False Alert Rate ให้อยู่ในระดับที่พยาบาลยอมรับ (ดู §12)
4. **ลดงานแทรกที่ไม่ได้วางแผน** (Primary Metric ใหม่ — แทนที่ walking time reduction)
5. เพิ่มภาพรวมของ Ward ให้พยาบาลเห็นได้ทันที
6. ลดความเสี่ยงจากสารน้ำหมดโดยไม่รู้ตัว

## 8.2 Secondary Goals

1. เก็บ Historical Data สำหรับ Head Nurse/Admin (Analytics-first สำหรับ role นี้)
2. วิเคราะห์ภาระงานพยาบาลเชิงตัวเลข (staffing evidence)
3. วิเคราะห์การใช้สารน้ำ / Alert Pattern / Device Reliability
4. รองรับ AI Predictive Monitoring ในอนาคต

---

# 9. Value Proposition

| Role | Value |
|---|---|
| Nurse | **Know what needs attention first — before it becomes an interruption.** วางแผนรอบเปลี่ยน IV ได้ล่วงหน้า ไม่ต้องเดินตรวจทุกเตียง |
| Head Nurse | **Turn gut-feeling staffing into evidence.** เห็นภาระงานจริงของทีมย้อนหลัง ใช้ประกอบการขออัตรากำลัง (ไม่ใช่ real-time overview) |
| Hospital Administrator | **Turn clinical monitoring data into operational + regulatory-ready intelligence.** |

---

# 10. Functional Requirements

## 10.1 Dashboard Overview (FR-DASHBOARD)

KPI Cards: Active Beds, Critical IV (<20%), Warning IV (<50%), Connected Devices, Average Flow Rate, Estimated Next Refill

Real-time Charts: Consumption Trend (30 min / 1h / 24h), Ward Distribution (Normal/Warning/Critical/Empty), Alert Timeline

Dashboard ต้องอัปเดตภายใน **< 10 วินาที** จาก event จริง (MVP success criterion — ดู §11.3 สำหรับสเปก transport)

## 10.2 Ward Management (FR-WARDVIEW)

- Ward List: Total/Critical/Warning/Normal Beds ต่อ Ward
- Ward Detail: Bed Grid (Bed No., HN, %, ml, ETE), Sort (Remaining %/ml/ETE/Bed No./Priority Score), Filter (Critical/Warning/Normal/Offline)
- Digital Twin Ward View: ผัง Ward จำลองพร้อมสีสถานะ ให้เข้าใจภาพรวมภายในไม่กี่วินาที

## 10.3 Bed Card / Patient Detail (FR-BEDCARD)

Header: Bed Number, HN
IV Visualization (color band — ดู §10.7)
Metrics: Remaining %, Remaining ml, Flow Rate, ETE
Patient Detail Drawer: Patient Info, IV Info, Historical Chart (30min/1h/24h)

## 10.4 Estimated Time to Empty — ETE (FR-ETE) — **Core Feature**

```text
ETE (minutes) = Remaining Volume (ml) ÷ Flow Rate (ml/min)
```

ตัวอย่าง: Remaining = 120 ml, Flow Rate = 4 ml/min → ETE = 30 min

**Requirement:** ETE ต้องคำนวณจาก Flow Rate ที่ผ่าน Smoothing (Moving Average) เพื่อป้องกันความผันผวนของ Sensor — ดูสเปก noise reduction ที่ §11.5

## 10.5 Priority Queue Engine (FR-PRIORITY) — **Core Feature**

**MVP Formula (จาก [[Application Architecture]] — ใช้เป็นสูตรคำนวณจริง):**

```text
priority_score =
  (100 - remaining_percent) * 0.6
  + (flow_rate * 0.2)
  + (minutes_to_empty * -0.2)
```

**Display Band (จาก Master PRD — ใช้เป็น label/สีในการแสดงผล):**

```text
P1 Critical   ETE < 15 min
P2 High       ETE 15–30 min
P3 Warning    ETE 30–60 min
P4 Normal     ETE > 60 min
```

Dashboard ต้องแสดงเตียง Priority สูงสุดไว้ด้านบนเสมอ Priority Score รุ่นถัดไปอาจรวม Alert Severity และ Patient Context เพิ่มเติม (Phase 2+)

## 10.6 Alert Center (FR-ALERT)

| Alert Type | Condition |
|---|---|
| Critical Alert | IV Remaining < 20% |
| Empty Alert | IV Remaining = 0% |
| Device Offline | ไม่มีข้อมูล > 60 วินาที (§11.4) |
| Flow Blockage / Occlusion Warning | Expected Flow > 0 แต่ Measured Change ≈ 0 ต่อเนื่องเกิน X นาที — ใช้คำว่า "Possible/Suspected" เท่านั้น ห้ามระบุว่าเป็น Occlusion แน่นอน |

**Hard Requirement — False Alert Control:** จาก §5.4 พยาบาลจะเลิกเชื่อ/เลิกใช้ระบบถ้าได้รับ alert ที่ไม่จำเป็นเกิน ~3–4 ครั้ง/เวร ⚠️ ต้องยืนยันตัวเลขจริงกับพยาบาล — ระบบต้องมี Threshold Tuning + Alert Debouncing + Confidence Score ก่อนส่ง Critical Alert และวัด **False Alert Rate เป็น Success Metric บังคับ** (§12) ไม่ใช่แค่ nice-to-have

## 10.7 IV Color Status (ใช้ตัวเลขเดียวกันทุกที่ในระบบ)

```text
70–100%  Green
40–69%   Yellow
10–39%   Orange
1–9%     Red
0%       Gray (Empty)
```

## 10.8 Notification (FR-NOTIFY)

- **MVP:** Dashboard Notification, Telegram Bot
- **Future (Phase 2+):** LINE OA, Email, Mobile Push, SMS

Notification ต้องมีข้อมูลครบ: Alert Type + Bed + Patient + Remaining + ETE + Timestamp

## 10.9 Device Monitoring (FR-DEVICE)

Device Info: Device ID, Battery, RSSI, Last Seen, Status, Firmware Version
Device Status: Online / Warning (no data > 30s) / Offline (no data > 60s) / Low Battery

## 10.10 Patient Mobility / Temporary Disconnection (FR-MOBILITY)

Workflow: Nurse กด "Temporary Mobility" → Suspend Alert ชั่วคราว → ย้าย Device ไปกับผู้ป่วย → Device ติดตามต่อ → เมื่อกลับ Ward กด Resume Monitoring

⚠️ **Open Question จากเอกสารต้นทาง (ยังไม่ปิด):** กรณีผู้ป่วยพกกระปุกสารน้ำไปเข้าห้องน้ำเอง (ไม่ผ่าน flow นี้) ระบบจะแยกแยะจาก Occlusion/Disconnect จริงได้อย่างไร — ต้องออกแบบ UX ที่ interaction น้อยที่สุด (ปุ่มเดียว) มิฉะนั้นพยาบาลจะไม่กด และเกิด False Alert ตามมา

## 10.11 Auto Bag Change Detection (FR-AUTOCHANGE, Phase 2)

Pattern: Volume ลดลงใกล้ 0 → เพิ่มขึ้นอย่างรวดเร็ว → คงที่ระดับใหม่ → ตีความ "Possible New IV Bag" → Reset Baseline + คำนวณ Flow Rate/ETE ใหม่ โดยพยาบาลไม่ต้องกดปุ่มใดๆ MVP ใช้ Rule-based ก่อน อนาคตพัฒนาเป็น AI Model

## 10.12 Analytics (FR-ANALYTICS) — **Priority สูงสำหรับ Head Nurse**

Top Critical Beds, Average Consumption per Ward, Device Reliability (Uptime/Offline Frequency/Battery), Daily Statistics (IV Change count, Alert count, Avg ETE, Avg Response Time)

⚠️ เพิ่มจาก Root Cause: ต้องมี **Nurse Workload Report ย้อนหลัง** (จำนวนงานแทรก/เวร, เวลาตอบสนอง) เพื่อให้ Head Nurse ใช้เป็นหลักฐานขออัตรากำลังคน — เดิมไม่มีใน Master PRD ชัดเจน

---

# 11. Non-Functional Requirements

## 11.1 Performance
- Dashboard reflects new data **< 10 seconds** (MVP demo success criterion)
- Device Uptime > 99%

## 11.2 Reliability
- Alert Accuracy > 95%
- False Alert Rate — ⚠️ ต้อง set threshold จริงจากการสัมภาษณ์พยาบาล (เป้าตั้งต้น: ไม่เกิน 3–4 ครั้ง/เวรที่ไม่จำเป็น)

## 11.3 Real-time Data Pipeline (สเปกรวมจาก Master PRD + IoT Architecture)

```text
Load Cell → ESP32 → Local Filtering (Moving Average)
   → Sensor sampling: 1 sec (internal)
   → Upload to server: every 5–10 sec (normal condition)
   → Event-based immediate push: Critical / Empty / Device Offline / Sudden Weight Change
→ Backend Processing → WebSocket/Socket.IO → Dashboard (<10 sec end-to-end)
```

Server Load Optimization: Edge Filtering ที่ ESP32, ห้าม Device ยิง Database ตรงทุก 1 วินาที, แยก Database เป็น Current State กับ Historical Time Series

## 11.4 Device Status Thresholds (สเปกจาก [[IoT Architecture]])

| Status | Condition |
|---|---|
| Online | ได้รับข้อมูลภายใน 30 วินาทีล่าสุด |
| Warning | ไม่ได้รับข้อมูล > 30 วินาที |
| Offline | ไม่ได้รับข้อมูล > 60 วินาที → สร้าง Alert อัตโนมัติ |

## 11.5 Sensor Noise Reduction

Moving Average 10 ค่า, Ignore Spike > ±30g, Update Dashboard ทุก 5 วินาที (จาก Hardware & Firmware Architecture)

## 11.6 Security & Data Privacy

- MVP: Device API Key (`x-device-key`), HTTPS Only
- Production: JWT Device Token, Certificate Authentication, Device Rotation Key
- ต้องพิจารณา Patient Data Protection ตามข้อกำหนดโรงพยาบาลไทย (PDPA) ตั้งแต่ MVP ที่มีข้อมูล HN จริง

## 11.7 Scalability

รองรับ 100+ Devices พร้อมกัน (Load Test ตาม Development Plan Phase 5)

---

# 12. Success Metrics (Revised)

## 12.1 Product Metrics
- Dashboard Update < 10 seconds
- Device Uptime > 99%
- Alert Accuracy > 95%
- **False Alert Rate** — ⚠️ hard requirement, threshold ต้องยืนยันกับพยาบาลจริงก่อน Pilot
- ETE Accuracy

## 12.2 Clinical Workflow Metrics (Primary — Revised จาก Root Cause)
- **⚠️ งานเปลี่ยน IV แบบแทรกนอกรอบ ลดลงจาก baseline** (baseline สมมติฐานเดิม ~4–6 ครั้ง/เวร — ต้องเก็บจริง)
- **⚠️ IV หมดค้างโดยไม่มีใครรู้ ลดลงจาก baseline** (baseline สมมติฐานเดิม ~2–3 ครั้ง/สัปดาห์/หอ — ต้องเก็บจริง)
- **⚠️ สัดส่วนที่ญาติแจ้งก่อนพยาบาล ลดลง** (baseline สมมติฐานเดิม ~50–70% ของเคส — ต้องเก็บจริง)
- Nurse Walking Time Reduction (secondary/legacy metric — เดิมตั้งเป้า >50%, คงไว้เพื่อ marketing แต่ไม่ใช่ตัวชี้วัดหลักอีกต่อไป)
- Critical Alert Response Time / Average Alert Response Time

## 12.3 Legacy Metric Variants (เพื่อ Traceability — ห้ามใช้ปนกันโดยไม่ระบุแหล่งที่มา)

| Metric | Master PRD v2.0 | Project Require Document (PRD).md | User Stories.md |
|---|---|---|---|
| ลดเวลาเดินตรวจ | >50% | >50% | 40% |
| ลดเหตุการณ์สารน้ำหมด | (ไม่ระบุ%, ใช้ "แจ้งเตือนก่อนหมด 100%") | 100% | 80% |
| ลดภาระพยาบาล | (ไม่ระบุ) | (ไม่ระบุ) | 30% |

**มติ:** ตัวเลขทั้งหมดข้างต้นเป็น ⚠️ สมมติฐานที่ไม่มีแหล่งข้อมูลอ้างอิง ห้ามใช้เป็น commitment ใน pitch/สัญญากับโรงพยาบาลจนกว่าจะมี baseline จริงจาก Pilot Phase 1 (§16.4)

## 12.4 Business Metrics
CAC, MRR, ARR, LTV, Gross Margin, Churn Rate, Payback Period (ดู §14)

---

# 13. Non-Goals สำหรับ MVP

MVP จะยังไม่มุ่งเน้น:
- การควบคุม/ปรับอัตราการไหลของ IV Pump อัตโนมัติ
- การวินิจฉัยโรคหรือการตัดสินใจทางการแพทย์แทนบุคลากร
- การเชื่อมต่อ Hospital Information System แบบเต็มรูปแบบ
- AI ที่ซับซ้อน (Predictive/Anomaly Detection — เป็น Phase 3+)
- การรองรับอุปกรณ์ทางการแพทย์ประเภทอื่นจำนวนมาก

SMIS เป็นระบบ **Decision Support และ Workflow Assistance** ไม่ใช่ระบบตัดสินใจทางการแพทย์แทนบุคลากร

## 13.5 Regulatory as Go-to-Market Gate (ย้ายจาก Risk มาเป็น Requirement — ตาม Root Cause)

⚠️ ผู้เซ็นอนุมัติจัดซื้อจริงคือ **ผู้อำนวยการโรงพยาบาล + คณะกรรมการเครื่องมือแพทย์** ซึ่งถามเรื่อง **อย. (การขึ้นทะเบียนเครื่องมือแพทย์)** เป็นคำถามแรก ก่อนเข้า Pilot ที่มีผู้ป่วยจริงต้อง:
- ประเมิน Medical Device Classification ของอุปกรณ์
- ตรวจสอบ Electrical Safety / EMC ตามมาตรฐาน
- ทำ Security & Privacy Review (ข้อมูล HN, PDPA)

---

# 14. Business Model (คงไว้จาก Master PRD, ปรับกรอบ ROI)

## 14.1 Revenue Streams
```text
Hardware + SaaS Subscription + Installation + Maintenance + Premium Analytics/AI
```
Pricing (⚠️ สมมติฐาน ต้อง validate ก่อน Commercial Launch): Starter $299–499/mo, Professional $1,000–3,000/mo, Enterprise Custom

## 14.2 ROI Model (Revised)

Formula เดิมยังใช้เป็นเครื่องมือคำนวณได้:
```text
ROI = (Annual Value Created − Annual SMIS Cost) ÷ Annual SMIS Cost × 100
```

⚠️ **ข้อควรระวัง (จาก Root Cause):** "ประหยัดเวลาพยาบาล X ชั่วโมง" **ไม่ได้แปลงเป็นเงินคืนตรงๆ** เพราะโรงพยาบาลไม่ลดจำนวนพยาบาลตามชั่วโมงที่ประหยัดได้ ROI ที่ใช้ pitch ต้องพูดถึง 3 มิติร่วมกัน:
1. **Risk Reduction** — ลด incident จาก IV หมดค้าง/สารน้ำผิดปกติ
2. **Patient/Family Satisfaction** — ลดเคสที่ญาติต้องแจ้งก่อน
3. **Staffing Evidence** — ข้อมูลภาระงานเชิงตัวเลขที่หัวหน้าหอใช้ขออัตรากำลังคนได้จริง

Unit Economics และ Cost Structure (Hardware BOM, Cloud, Development, Operational, Regulatory) — คงตามรายละเอียดใน [[Master PRD]] §12–14 (ไม่เปลี่ยนแปลง, ยืนยันตัวเลข BOM ~560–700 THB/device สอดคล้องกับ [[Hardware & Firmware Architecture]])

---

# 15. Technical Architecture (Summary — ดูรายละเอียดเต็มใน 013 Architecture)

## 15.1 Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Recharts |
| Backend | NestJS, tRPC/REST, PostgreSQL, Prisma |
| Realtime | Socket.IO |
| IoT | ESP32, Load Cell, HX711 |
| Infrastructure | Docker, Vercel (Frontend), VPS/Railway (Backend) |

## 15.2 High-Level Flow

```text
IV Bag → Load Cell → HX711 → ESP32 → WiFi → NestJS API
  → PostgreSQL (Current State + Historical Time Series)
  → Socket.IO → Next.js Dashboard → Nurse
```

## 15.3 Core Database Entities (จาก [[Application Architecture]] — เพื่อ sync กับ 014 Database ที่ยังว่าง)

`wards`, `beds` (ward_id, bed_number, patient_hn, device_id, status), `iv_status` (bed_id, remaining_ml, remaining_percent, flow_rate, estimated_empty_at, priority_score), `alerts` (bed_id, type, message, is_read), `devices` (device_code, battery, rssi, last_seen, status)

> **Action Item:** 014 Database/Database.md และ 015 Diagram/ER-Diagram.md ยังเป็นไฟล์ว่าง — ควรใช้ schema นี้เป็นจุดเริ่มต้นเพื่อไม่ให้หลุด sync กับ PRD นี้

## 15.4 Design Principle

> Device ทำหน้าที่วัดและส่งข้อมูลเท่านั้น ("Keep the Device Simple") — Server ทำหน้าที่คิด วิเคราะห์ และแจ้งเตือนทั้งหมด ("Keep the Server Smart") เพื่อปรับ Logic ได้โดยไม่ต้องอัปเดต Firmware ทุกตัว

---

# 16. MVP Scope & Roadmap

## 16.1 MVP Phase 1 — Core Product (ตรงกันทุกเอกสารต้นทาง)

- Dashboard Overview, Ward Detail, Bed Grid, IV Visualization
- Realtime Mock Data → Real Device (Sprint 3 ตาม Development Plan)
- Alert Center, Priority Queue Engine
- Telegram Notification

## 16.2 Build Timeline (จาก [[Development Plan]] / [[Phase Plan]])

3 เดือน (12 สัปดาห์), ทีม 2 Full Stack Developers, Agile Scrum, 6 Sprint × 2 สัปดาห์:

```text
Sprint 1  Foundation (Auth, DB, Layout)
Sprint 2  Ward Management (Ward/Bed/Patient/Device CRUD)
Sprint 3  Realtime (ESP32, Socket.IO, Live Dashboard)
Sprint 4  Alert Engine (Critical/Empty/Offline, Telegram)
Sprint 5  Analytics (Charts, KPI, Priority Queue)
Sprint 6  Stabilization (Bug Fix, Performance, Docs)
→ UAT → Production Deployment (Week 12)
```

## 16.3 MVP Success Criteria

1. Device ส่งข้อมูล Real-time ตามสเปก §11.3
2. Dashboard แสดงข้อมูลภายใน < 10 วินาที
3. ระบบคำนวณ Remaining Volume, ETE, Priority Score ถูกต้อง
4. ระบบแจ้งเตือน Critical และส่ง Telegram Notification ได้
5. Nurse เห็นเตียงที่ต้องดูแลก่อนจาก Priority Queue โดยไม่ต้องเดินตรวจทุกเตียง
6. แสดง Historical Data เบื้องต้นได้

## 16.4 Pilot Plan (Post-MVP — จาก Master PRD, เพิ่ม Validation Step ตาม Root Cause)

| Phase | Scale | เป้าหมาย |
|---|---|---|
| 0 (ใหม่ — เพิ่มจาก Root Cause) | Shadowing 1 ward × 1 สัปดาห์ | เก็บ baseline งานแทรก/เวร, IV หมดค้าง/สัปดาห์, %ญาติแจ้งก่อน + สัมภาษณ์พยาบาลจริง 5–8 คน |
| 1 Prototype | 1–3 Devices | Validate Sensor/Weight Accuracy/ETE/Connectivity |
| 2 Ward Pilot | 10–20 Beds | Validate Workflow, วัดงานแทรกที่ลดลงจริง, Alert Accuracy |
| 3 Ward Deployment | 50–100 Beds | Validate Scalability/Infrastructure |
| 4 Hospital Deployment | 100–500+ Beds | Enterprise Dashboard, Advanced Analytics, Hospital Integration |

**Phase 0 ต้องทำก่อน Phase 2** เสมอ เพราะตัวเลข success metric ทั้งหมดใน §12.2 ยังเป็นสมมติฐาน (⚠️) — ไม่มี baseline จริงจะวัด ROI/impact ของ Pilot ไม่ได้

---

# 17. Risk & Mitigation (Revised Priority)

| Risk | Mitigation | Priority |
|---|---|---|
| **Regulatory (อย./Medical Device Classification)** | Regulatory Assessment ก่อนเข้า Pilot ที่มีผู้ป่วยจริง — **Gate ไม่ใช่แค่ Risk** (§13.5) | 🔴 สูงสุด — ย้ายขึ้นจาก Master PRD |
| **False Alert / Alert Fatigue** | Threshold Tuning, Debouncing, Confidence Score, วัด False Alert Rate เป็น hard metric | 🔴 สูง — ยกระดับจาก Root Cause |
| Hardware Accuracy | Calibration, Filtering, Sensor Validation | 🟡 กลาง |
| Connectivity (WiFi หลุด) | Local Buffer, Auto Reconnect, Offline Detection | 🟡 กลาง |
| Battery | External Power (MVP: USB-C/Power Bank), Low Battery Alert | 🟡 กลาง |
| Clinical Adoption | Simple UI, Minimal Interaction (1-tap), Priority-first Design, **Pilot Phase 0 กับพยาบาลจริงก่อน** | 🔴 สูง — เชื่อมกับ §16.4 |

---

# 18. Core Product Principle

> **Don't Make Nurses Monitor More. Make Nurses Monitor Less, but Act Better — Before It Becomes an Interruption.**

*(ประโยคท้าย "Before It Becomes an Interruption" เพิ่มจาก Root Cause เพื่อให้ principle นี้ผูกกับ root cause จริง)*

ระบบต้องแปลง `Raw IoT Data → Actionable Information → Clinical Action` โดยไม่เพิ่ม Cognitive Load ให้พยาบาล

---

# 19. One-line Value Proposition (Revised)

> **SMIS helps nurses plan IV changes ahead of time instead of reacting to interruptions — using real-time IoT data and intelligent priority management to reduce unplanned work, improve workflow efficiency, and enhance patient safety.**

ภาษาไทย:

> **SMIS ช่วยให้พยาบาลวางแผนงานเปลี่ยนสารน้ำล่วงหน้าได้ แทนที่จะต้องรอให้ถูกแทรกงานกลางคัน ด้วยข้อมูล Real-time จาก IoT และระบบจัดลำดับความสำคัญอัจฉริยะ**

---

# 20. Next Actions / Open Items

- [ ] เก็บข้อมูล baseline จริง 1 ward × 1 สัปดาห์ (§16.4 Phase 0)
- [ ] สัมภาษณ์พยาบาลจริง 5–8 คน เพื่อยืนยัน/หักล้าง persona และ threshold ของ False Alert
- [ ] ตอบคำถาม ROI เชิงเงิน: ประหยัดเวลาพยาบาลแล้วโรงพยาบาลได้เงินคืนตรงไหน (§14.2)
- [ ] ตรวจสอบเส้นทาง อย. และมาตรฐานความปลอดภัยไฟฟ้าทางการแพทย์ก่อน Pilot Phase 2 (§13.5)
- [x] `014 Database/Database.md`, `015 Diagram/ER-Diagram.md` — เติมเนื้อหาแล้ว (schema เต็มจาก §15.3 + Feature List, sync กับ PRD นี้)
- [x] `013 Architecture/System Architecture.md` — เติมเนื้อหาแล้ว (High Level Architecture รวมจาก Application/IoT/Hardware & Firmware Architecture + Deployment Topology)
- [x] `017 API/API.md` — เติมเนื้อหาแล้ว (API Specification เต็ม, sync กับ Database + Feature List)
- [x] `022 Detailed Design/Detailed Design.md` — สร้างใหม่ (Module Design, Algorithm, Sequence Diagram, State Machine — Deliverable ตาม Phase Plan Phase 3)
- [x] `016 IoT/IoT.md` — เติมเนื้อหาแล้ว (landing overview, ไม่ duplicate IoT/Hardware Architecture)
- [x] `018 UXUI/Wireframe.md`, `UX-UI Design.md`, `Prototype.md` — เติมเนื้อหาแล้ว (documented จาก mockup จริงที่มีอยู่ `Main.dc.html` / `ward-detail-critical-alert.html`)
- [x] `020 Testing/Testing Plan.md` — เติมเนื้อหาแล้ว (QA strategy ระดับโปรเจกต์ ครอบ Test Spec ที่มีอยู่)
- [x] `021 MVP Scope/MVP Scope Checklist.md` — เติมเนื้อหาแล้ว (ดึงจาก Feature List Release=MVP; พบ inconsistency กับ summary count 27 vs 40 — ต้องให้ Product Owner ยืนยัน)
- [ ] `013 Architecture/Deployment Architecture.md` — ยังว่าง, เนื้อหา MVP เบื้องต้นย้ายไปรวมไว้ที่ [[System Architecture]] §5 แล้ว ถ้าต้องแยกเป็นเอกสารเต็ม (Production) ค่อยทำเพิ่ม
- [ ] ออกแบบ UX สำหรับ Patient Mobility ที่ interaction น้อยที่สุด เพื่อลดโอกาส False Alert จากผู้ป่วยพกกระปุกไปเข้าห้องน้ำ (§10.10)

---

## Related

- [[Master PRD]]
- [[Root  Cause]]
- [[PRD For Pitch (Conclusion)]]
- [[Project Require Document (PRD)]]
- [[SMIS (Smart IV Monitoring System)]]
- [[User Stories]]
- [[Application Architecture]]
- [[Hardware & Firmware Architecture]]
- [[IoT Architecture]]
- [[Development Plan]]
- [[Phase Plan]]

---
title: "SMIS — Feature List"
project: Smart IV Monitoring System (SMIS)
type: feature-list
status: draft
version: 1.0
date: 2026-08-22
source: "[[Project Requirement Document (PRD) v2.1]], [[Product Backlog]]"
tags:
  - smis
  - feature-list
  - scope
---

# Feature List — SMIS

> รวม Feature ทั้งหมดของ SMIS จาก [[Project Requirement Document (PRD) v2.1]] (Functional/Non-Functional Requirements) และ [[Product Backlog]] (Sprint 1–6 + Icebox) เข้าเป็นรายการเดียว จัดกลุ่มตาม Module เพื่อใช้เป็น scope reference กลาง — ทุกแถวอ้างกลับไปทั้ง PRD Section และ Backlog ID เพื่อไม่ให้สามเอกสารหลุด sync กัน

**คอลัมน์ Release:** `MVP` = อยู่ใน Sprint 1–6 (§16.1–16.3) · `Phase 2` = หลัง MVP / ช่วง Pilot (§16.4) · `Phase 3+` = Hospital Scale / AI Platform

**คอลัมน์ Status:** ทุก Feature ยังเป็น **Not Started** (ยังไม่มีการ implement จริงใน `000-Project-Code` ณ วันที่เขียนเอกสารนี้ — มีแค่ repo scaffold ว่าง)

---

# 0. Summary by Release

| Release | จำนวน Feature |
|---|---|
| MVP (Sprint 1–6) | 27 |
| Phase 2 (Pilot) | 8 |
| Phase 3+ (Scale/AI) | 7 |
| **รวม** | **42** |

---

# 1. Platform Foundation

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-001 | Dev Environment & CI | Docker Compose + repo setup สำหรับทีม dev | MVP | P0 | §15.1 | BL-101 | Not Started |
| FL-002 | Core Database Schema | Prisma schema: wards, beds, iv_status, alerts, devices | MVP | P0 | §15.3 | BL-102 | Not Started |
| FL-003 | Authentication (Login/Logout) | ระบบ login ด้วย username/password + session/JWT | MVP | P0 | §11.6 | BL-103 | Not Started |
| FL-004 | Dashboard Layout & Sidebar | Layout หลักพร้อม Sidebar 7 เมนู (Dashboard/Wards/Patients/Devices/Alerts/Analytics/Settings) | MVP | P0 | §10.1 | BL-104 | Not Started |
| FL-005 | Error Logging / Monitoring | Logging พื้นฐานสำหรับ debug ระหว่างพัฒนา | MVP | P1 | §11.6 | BL-106 | Not Started |

---

# 2. Ward & Bed Management

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-006 | Ward CRUD | สร้าง/แก้/ลบ Ward พร้อมสรุป Total/Critical/Warning/Normal Beds | MVP | P0 | §10.2 | BL-201 | Not Started |
| FL-007 | Bed CRUD & Assignment | ผูก Bed กับ Ward, Patient HN, Device ID | MVP | P0 | §10.2, §15.3 | BL-202 | Not Started |
| FL-008 | Bed Grid View | แสดงทุกเตียงใน Ward พร้อม %, ml, ETE | MVP | P0 | §10.3 | BL-203 | Not Started |
| FL-009 | Bed Sorting | เรียงเตียงตาม Remaining %/ml/ETE/Bed No./Priority Score | MVP | P0 | §10.2 | BL-204 | Not Started |
| FL-010 | Bed Filtering | กรองเตียงตาม Critical/Warning/Normal/Offline | MVP | P0 | §10.2 | BL-205 | Not Started |
| FL-011 | Patient Detail Drawer | Drawer แสดง Patient Info + IV Info + Historical Chart เมื่อกดเตียง | MVP | P0 | §10.3 | BL-206 | Not Started |
| FL-012 | Device Provisioning UI | ลงทะเบียน Device ID ผูกกับ Ward/Bed จากหน้า Admin | MVP | P1 | §10.9, §11.4 | BL-207 | Not Started |
| FL-013 | Digital Twin Ward View | ผัง Ward จำลองพร้อมสีสถานะรายเตียง | Phase 2 | P2 | §10.2 | BL-P2-04 | Not Started |

---

# 3. Realtime IoT Data Pipeline

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-014 | ESP32 Telemetry Firmware | อ่าน Load Cell/HX711 ส่งข้อมูลน้ำหนักทุก 5–10 วินาที | MVP | P0 | §11.3, §11.5 | BL-301 | Not Started |
| FL-015 | Telemetry Ingestion API | `POST /api/iot/telemetry` บันทึกข้อมูลและคำนวณ Remaining %/Flow Rate | MVP | P0 | §10.4, §11.3 | BL-302 | Not Started |
| FL-016 | Realtime Broadcast (Socket.IO) | Event `iv:update` / `alert:new` / `device:offline` ไป Dashboard | MVP | P0 | §11.3 | BL-303 | Not Started |
| FL-017 | Live Dashboard Update (<10s) | Dashboard/Bed Grid อัปเดตจาก event จริงภายใน 10 วินาที | MVP | P0 | §11.1, §11.3 | BL-304 | Not Started |
| FL-018 | Mock Device Simulator | เครื่องมือ generate telemetry traffic จำลอง สำหรับ demo/test | MVP | P0 | §16.1 | BL-305 | Not Started |
| FL-019 | Sensor Noise Smoothing | Moving Average + spike rejection ก่อนคำนวณ Flow Rate/ETE | MVP | P1 | §10.4, §11.5 | BL-306 | Not Started |

---

# 4. IV Monitoring Core (ETE & Priority)

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-020 | Remaining % / ml Calculation | คำนวณปริมาณคงเหลือจากน้ำหนักที่วัดได้ | MVP | P0 | §10.4 | BL-302 | Not Started |
| FL-021 | Estimated Time to Empty (ETE) | `ETE = Remaining Volume ÷ Flow Rate` — **Core Feature ตอบ Root Cause ตรงจุด** | MVP | P0 | §10.4 | BL-302 | Not Started |
| FL-022 | IV Color Status Band | 70–100% Green / 40–69% Yellow / 10–39% Orange / 1–9% Red / 0% Gray | MVP | P0 | §10.7 | BL-203 | Not Started |
| FL-023 | Priority Score Engine | คำนวณ `priority_score` ตามสูตรถ่วงน้ำหนัก (Remaining %, Flow Rate, minutes_to_empty) | MVP | P0 | §10.5 | BL-501 | Not Started |
| FL-024 | Priority Queue Display (P1–P4) | เรียงเตียงตาม Priority Score พร้อม label P1 Critical–P4 Normal บนสุดของ Dashboard เสมอ | MVP | P0 | §10.5 | BL-502 | Not Started |
| FL-025 | Auto Bag Change Detection | ตรวจจับรูปแบบ volume drop→spike→stable แล้ว reset baseline อัตโนมัติ (Rule-based) | Phase 2 | P2 | §10.11 | BL-P2-03 | Not Started |
| FL-026 | AI Predictive Refill | คาดการณ์เวลาหมดล่วงหน้าด้วย Model (ไม่ใช่ rule-based) | Phase 3+ | P3 | Master PRD §35 | BL-P3-01 | Not Started |
| FL-027 | Anomaly Detection (Flow/Weight) | ตรวจจับ flow/weight ผิดปกติเชิง AI | Phase 3+ | P3 | Master PRD §35 | BL-P3-02 | Not Started |

---

# 5. Alert & Notification

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-028 | Critical Alert (IV < 20%) | สร้าง alert เมื่อสารน้ำเหลือน้อยกว่า 20% | MVP | P0 | §10.6 | BL-401 | Not Started |
| FL-029 | Empty Alert (IV = 0%) | สร้าง alert เมื่อสารน้ำหมด | MVP | P0 | §10.6 | BL-402 | Not Started |
| FL-030 | Device Offline Alert | Warning ที่ >30s / Offline ที่ >60s ไม่มีข้อมูล | MVP | P0 | §10.6, §11.4 | BL-403 | Not Started |
| FL-031 | Telegram Notification | ส่ง alert (Critical/Empty/Offline) พร้อม Bed+Patient+Remaining+ETE+Timestamp ไป Telegram | MVP | P0 | §10.8 | BL-404 | Not Started |
| FL-032 | Alert Debouncing & Threshold Tuning | ป้องกัน False Alert ซ้ำถี่เกินไป — **Hard Requirement** ตาม §12.1 | MVP | P0 | §10.6, §12.1 | BL-405 | Not Started |
| FL-033 | Flow Blockage / Occlusion Warning | แจ้งเตือนแบบ "Possible/Suspected" เมื่อ flow คาดว่ามีแต่ volume ไม่เปลี่ยน | MVP | P1 | §10.6 | BL-406 | Not Started |
| FL-034 | Temporary Mobility Mode | ปุ่ม 1-tap suspend/resume alert เมื่อผู้ป่วยเคลื่อนย้ายพร้อม IV | MVP | P1 | §10.10 | BL-407 | Not Started |
| FL-035 | LINE OA Notification | ช่องทางแจ้งเตือนเพิ่มเติมผ่าน LINE OA | Phase 2 | P2 | §10.8 | BL-P2-01 | Not Started |
| FL-036 | Email Notification | ช่องทางแจ้งเตือนผ่าน Email | Phase 2 | P2 | §10.8 | BL-P2-02 | Not Started |
| FL-037 | Mobile Push / SMS Notification | ช่องทางแจ้งเตือนผ่าน Push/SMS | Phase 3+ | P3 | §10.8 | BL-P3-05 | Not Started |

---

# 6. Device Monitoring

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-038 | Device Status Tracking | แสดง Device ID, Battery, RSSI, Last Seen, Status, Firmware Version | MVP | P0 | §10.9 | BL-207 | Not Started |
| FL-039 | Device Reliability Report | Uptime, Offline Frequency, Battery Performance ต่ออุปกรณ์ | MVP | P0 | §10.12 | BL-504 | Not Started |
| FL-040 | OTA Firmware Update | อัปเดต firmware ESP32 ทางไกลทั้ง fleet | Phase 3+ | P3 | Hardware & Firmware Architecture | BL-P3-07 | Not Started |
| FL-041 | MQTT Transport Layer | เปลี่ยน transport จาก HTTP POST เป็น MQTT เพื่อรองรับสเกลใหญ่ | Phase 3+ | P3 | IoT Architecture §Future | BL-P3-06 | Not Started |

---

# 7. Analytics & Reporting

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-042 | Daily Statistics | จำนวน IV Change, Alert, Avg ETE, Avg Response Time ต่อวัน | MVP | P0 | §10.12 | BL-503 | Not Started |
| FL-043 | Consumption Trend & Ward Distribution Charts | กราฟช่วง 30 min/1h/24h + สรุป Normal/Warning/Critical/Empty ต่อ Ward | MVP | P0 | §10.1 | BL-505 | Not Started |
| FL-044 | Nurse Workload Report | รายงานย้อนหลังจำนวนงานแทรก/เวรและ response time — **staffing evidence สำหรับ Head Nurse** | MVP | P1 | §5.4, §10.12 | BL-506 | Not Started |
| FL-045 | Historical Analytics Dashboard | วิเคราะห์เชิงลึกเกินกว่า Daily Stats (แนวโน้มระยะยาว) | Phase 2 | P2 | §10.12 | BL-P2-05 | Not Started |
| FL-046 | Predictive Maintenance Report | คาดการณ์ device ที่มีแนวโน้มเสีย | Phase 3+ | P3 | Master PRD §35 | BL-P3-03 | Not Started |
| FL-047 | Multi-Ward / Multi-Hospital Command Center | ภาพรวมข้ามวอร์ด/ข้ามโรงพยาบาลจากศูนย์เดียว | Phase 3+ | P3 | §6.3 | BL-P3-04 | Not Started |

---

# 8. Quality, Deployment & Compliance

| Feature ID | Feature Name | คำอธิบาย | Release | Priority | PRD Ref | Backlog Ref | Status |
|---|---|---|---|---|---|---|---|
| FL-048 | Core Calculation Unit Tests | Test ETE / Priority Score / Alert logic | MVP | P0 | §10.4–10.6 | BL-601 | Not Started |
| FL-049 | End-to-End Integration Test | ทดสอบ IoT → Backend → Frontend ครบ pipeline | MVP | P0 | §11.3 | BL-602 | Not Started |
| FL-050 | Load Test (100+ Devices) | ยืนยัน scalability ตาม §11.7 | MVP | P0 | §11.7 | BL-603 | Not Started |
| FL-051 | UX Polish (loading/empty/error states) | ทำให้ MVP demo ดูสมบูรณ์ ไม่มี broken state | MVP | P0 | §10.1–10.3 | BL-604 | Not Started |
| FL-052 | Deployment & Rollback Guide | เอกสารและ script สำหรับ deploy/rollback production | MVP | P1 | §16.2 | BL-605 | Not Started |
| FL-053 | Regulatory Assessment (อย./Medical Device Classification) | ประเมินก่อนเข้า Pilot ที่มีผู้ป่วยจริง — **Go-to-Market Gate** | Phase 2 | P2 (blocking) | §13.5 | BL-P2-08 | Not Started |
| FL-054 | Pilot Baseline Data Collection | Shadow 1 ward × 1 สัปดาห์ เก็บ baseline งานแทรก/IV หมดค้าง/%ญาติแจ้งก่อน | Phase 2 | P2 (research) | §16.4 | BL-P2-06 | Not Started |
| FL-055 | Nurse Interview Program | สัมภาษณ์พยาบาลจริง 5–8 คน ยืนยัน False Alert threshold และ persona | Phase 2 | P2 (research) | §5.4, §12.1 | BL-P2-07 | Not Started |

---

# 9. Traceability Notes

- ทุก Feature ในตารางนี้ต้องมี FR/Section อ้างอิงใน [[Project Requirement Document (PRD) v2.1]] เสมอ — ถ้า Feature ใหม่ไม่มีที่มาจาก PRD ให้เพิ่ม Requirement ใน PRD ก่อน แล้วค่อยเพิ่มที่นี่ เพื่อไม่ให้ scope โตแบบไม่มี requirement รองรับ
- เมื่อ Sprint ใดเริ่ม implement Feature ใด ให้อัปเดตคอลัมน์ **Status** เป็น `In Progress` / `Done` ในไฟล์นี้ (ปัจจุบันยังเป็น `Not Started` ทั้งหมดเพราะ `000-Project-Code` ยังเป็น scaffold ว่าง)
- FL-053/054/055 เป็น **blocking gate** ก่อนเข้า Pilot Phase 2 จริง ไม่ใช่ feature พัฒนาซอฟต์แวร์ — ห้ามข้ามแม้ MVP demo ผ่านแล้ว (ดู §13.5, §16.4 ใน PRD)

---

## Related

- [[Project Requirement Document (PRD) v2.1]]
- [[Product Backlog]]
- [[Master PRD]]
- [[Root  Cause]]
- [[Development Plan]]
- [[Phase Plan]]

---
title: "SMIS — Testing Plan"
project: Smart IV Monitoring System (SMIS)
type: test-plan
status: draft
version: 1.0
date: 2026-08-26
source: "[[Phase Plan]] Phase 5, [[Test Spec - Priority Queue and Critical Alert]], [[Feature List]], [[Project Requirement Document (PRD) v2.1]] §11–12"
tags:
  - smis
  - testing
  - qa
---

# Testing Plan — SMIS

> เดิมไฟล์นี้ว่าง — เอกสารนี้เป็น **QA Strategy ระดับโปรเจกต์** (Test Level, Scope ต่อ Sprint, Environment, Entry/Exit Criteria, Defect Management) ส่วน Test Case ระดับละเอียดต่อ Feature อยู่ในไฟล์ Test Spec แยก (เช่น [[Test Spec - Priority Queue and Critical Alert]]) — ไฟล์นี้ทำหน้าที่เป็น index + policy ที่ครอบไว้ชั้นบน

---

# 1. Test Levels (ตาม [[Phase Plan]] Phase 5)

| Level | Scope | เครื่องมือ (แนะนำ) | Owner |
|---|---|---|---|
| Unit Test | Backend Logic: ETE, Priority Score, Alert Condition, Smoothing (§2 ของ Test Spec ต่างๆ) | Jest (NestJS default) | Backend Dev |
| Integration Test | IoT → Backend → Frontend pipeline, DB transaction, Socket.IO event | Jest + Supertest, Socket.IO client mock | Backend Dev |
| System Test | ทั้งระบบ end-to-end ผ่าน UI จริง | Manual / Playwright (ถ้ามีเวลา) | QA / Dev |
| UAT | ทดลองกับผู้ใช้งานจริง (พยาบาล) — ต้องรอ Pilot Phase 0 (PRD §16.4) | Manual, Structured Interview | Product + Head Nurse |
| Load Test | 100+ Device ส่ง telemetry พร้อมกัน (FL-050) | k6 / Artillery ยิง `/iot/telemetry` | Backend Dev |

---

# 2. Scope per Sprint (อ้าง [[Sprint List]])

| Sprint | สิ่งที่ต้อง Test | Test Level |
|---|---|---|
| Sprint 1 — Foundation | Auth (login/logout), DB migration, Layout render | Unit + Integration |
| Sprint 2 — Ward Management | Ward/Bed/Device CRUD, Bed Grid sort/filter | Unit + Integration |
| Sprint 3 — Realtime | Telemetry ingestion, Socket.IO broadcast, latency < 10s (FL-017) | Integration + System |
| Sprint 4 — Alert Engine | Critical/Empty/Offline Alert, Debounce, Telegram delivery | Unit + Integration → **[[Test Spec - Priority Queue and Critical Alert]]** |
| Sprint 5 — Analytics | Chart data accuracy, Priority Queue sort ถูกต้อง | Unit + Integration |
| Sprint 6 — Stabilization | Regression ทั้งหมด, Load Test, UX Polish edge case | System + Load |

---

# 3. Test Environment

| Environment | ใช้ทดสอบอะไร | Data |
|---|---|---|
| Local (Docker Compose) | Unit/Integration ระหว่าง dev | Seed/fixture data |
| Staging (Vercel Preview + Railway Staging) | System Test, Demo rehearsal | Mock Device Simulator (FL-018) |
| Pilot (โรงพยาบาลจริง, หลัง MVP) | UAT | ข้อมูลจริงบางส่วน — ต้องผ่าน Regulatory Gate ก่อน (PRD §13.5) |

---

# 4. Entry / Exit Criteria

## 4.1 Entry Criteria (ก่อนเริ่ม Test รอบใดๆ)

- Feature ที่จะทดสอบ implement เสร็จตาม Sprint Deliverable ([[Sprint List]])
- มี Test Spec ที่เกี่ยวข้องเขียนไว้แล้ว (ดู §5)
- Environment ที่ใช้ทดสอบพร้อม (DB migrate แล้ว, Mock Device รันได้)

## 4.2 Exit Criteria — MVP Ready (อ้าง PRD §16.3)

ต้องผ่านทั้งหมดก่อนประกาศ MVP Ready:

- [ ] Device ส่งข้อมูล Real-time ตามสเปก §11.3 (ผ่าน Load Test FL-050)
- [ ] Dashboard แสดงข้อมูลภายใน < 10 วินาที (TC-I-02)
- [ ] ระบบคำนวณ Remaining Volume, ETE, Priority Score ถูกต้อง (TC-U-01–04)
- [ ] ระบบแจ้งเตือน Critical และส่ง Telegram Notification ได้ (TC-U-05–07, TC-I-03)
- [ ] Nurse เห็นเตียงที่ต้องดูแลก่อนจาก Priority Queue โดยไม่ต้องเดินตรวจทุกเตียง (TC-E-02)
- [ ] แสดง Historical Data เบื้องต้นได้ (FL-011)
- [ ] Core Calculation Unit Test ผ่านทั้งหมด (FL-048)
- [ ] End-to-End Integration Test ผ่าน (FL-049)
- [ ] False Alert ไม่เกิน threshold ที่ตั้งไว้ระหว่าง regression run (TC-E-05) ⚠️ threshold จริงต้องยืนยันจาก Pilot Phase 0 ก่อน (PRD §5.4)

---

# 5. Test Spec Index (รายละเอียด Test Case)

| Test Spec | ครอบคลุม | สถานะ |
|---|---|---|
| [[Test Spec - Priority Queue and Critical Alert]] | ETE, Priority Score/Queue, Critical/Empty/Offline Alert, Debounce, Telegram, Bed Sort/Filter, Patient Detail | ✅ เขียนแล้ว |
| Test Spec — Auth & Ward/Bed/Device CRUD | FL-003, FL-006, FL-007, FL-012, FL-038 | ⬜ ยังไม่เขียน (ต้องทำก่อน Sprint 1–2 QA) |
| Test Spec — Analytics & Reporting | FL-042–044 | ⬜ ยังไม่เขียน (ต้องทำก่อน Sprint 5 QA) |
| Test Spec — Load & Scalability | FL-050 | ⬜ ยังไม่เขียน (ต้องทำก่อน Sprint 6 QA) |

> เมื่อเขียน Test Spec ใหม่ ให้เพิ่มแถวในตารางนี้ทันที เพื่อไม่ให้หลุด index

---

# 6. Defect Management

| Severity | นิยาม | SLA แก้ไข (MVP timeline) |
|---|---|---|
| Blocker | ระบบใช้งานไม่ได้ / คำนวณ ETE/Priority ผิด / Alert ไม่ยิง | แก้ก่อน merge เข้า main เสมอ |
| Major | Feature ใช้งานได้แต่ผิดตาม Spec (เช่น sort ผิดลำดับ) | แก้ภายใน Sprint เดียวกัน |
| Minor | UI/UX เล็กน้อย ไม่กระทบ Core Feature | แก้ใน Sprint 6 (Stabilization) ได้ |

Bug Report format: อ้างกลับ Test Case ID (`TC-xxx`) + Feature ID (`FL-xxx`) เสมอ เพื่อ traceability เดียวกับ [[Feature List]]

---

## Related

- [[Test Spec - Priority Queue and Critical Alert]]
- [[Phase Plan]]
- [[Sprint List]]
- [[Feature List]]
- [[Project Requirement Document (PRD) v2.1]]
- [[MVP Scope Checklist]]

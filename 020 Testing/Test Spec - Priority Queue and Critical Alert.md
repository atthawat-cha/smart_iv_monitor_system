---
title: "SMIS — Test Spec: Priority Queue & Critical Alert Response"
project: Smart IV Monitoring System (SMIS)
type: test-spec
status: draft
version: 1.0
date: 2026-08-22
source: "[[User Journey - Critical IV Alert Response]], [[Feature List]], [[Product Backlog]]"
tags:
  - smis
  - test-spec
  - qa
---

# Test Spec — Priority Queue & Critical Alert Response

> Test Spec นี้ครอบคลุม Stage 1–4 ของ [[User Journey - Critical IV Alert Response]] (Trigger → Detect & Notify → Triage → Investigate) ซึ่งคือ Feature หลัก: ETE (FL-021), Priority Score/Queue (FL-023/024), Critical/Empty/Offline Alert (FL-028/029/030), Alert Debounce (FL-032), Telegram Notification (FL-031), Bed Grid Sort/Filter (FL-009/010), Patient Detail Drawer (FL-011) — ทุก Test Case อ้างกลับ PRD Section ([[Project Requirement Document (PRD) v2.1]]) และ Backlog ID ([[Product Backlog]])

**Priority:** P0 = ต้องผ่านก่อน MVP Demo · P1 = ต้องผ่านก่อน Pilot
**Type:** Unit / Integration / E2E (End-to-End ตาม Journey Stage)
**Status:** Not Executed (ยังไม่มี implementation ให้ทดสอบ ณ วันที่เขียนเอกสารนี้)

---

# 1. Scope & Test Data

**In Scope:** การคำนวณ ETE/Priority Score, การสร้าง Alert ตาม threshold, การส่ง Telegram, การเรียง/กรอง Bed Grid, ความถูกต้องของข้อมูลใน Patient Detail Drawer, latency end-to-end < 10 วินาที

**Out of Scope:** Auto Bag Change Detection (Phase 2), LINE OA/Email (Phase 2), AI Predictive Refill (Phase 3) — ดู [[Feature List]] §4–5

**Test Data (Fixture):**

| Bed | Remaining % | Remaining ml | Flow Rate (ml/min) | Expected ETE (min) | Expected Status |
|---|---|---|---|---|---|
| Bed 10A-01 | 55% | 275 | 5 | 55 | Normal (Green/Yellow) |
| Bed 10A-05 | 12% | 58 | 4 | 14.5 | Critical (Red), P1 |
| Bed 10A-08 | 0% | 0 | 4 | 0 | Empty (Gray) |
| Bed 10A-09 | — | — | — | — | Offline (no telemetry > 60s) |

---

# 2. Unit Test Cases

| ID | Title | Precondition | Steps | Expected Result | Priority | Ref |
|---|---|---|---|---|---|---|
| TC-U-01 | ETE Calculation ถูกต้องตามสูตร | Remaining=58ml, FlowRate=4ml/min | เรียกฟังก์ชันคำนวณ ETE | ETE = 58 ÷ 4 = **14.5 นาที** (§10.4) | P0 | FL-021 / BL-302 |
| TC-U-02 | ETE ใช้ Flow Rate ที่ผ่าน Smoothing แล้ว ไม่ใช่ raw reading | ค่า Flow Rate มี spike ผิดปกติ ±30g ในช่วงสั้นๆ | ส่งชุดข้อมูลที่มี spike เข้าระบบ | ETE ไม่กระโดดผิดปกติจาก spike เดียว (Moving Average 10 ค่าทำงาน) (§11.5) | P1 | FL-019 / BL-306 |
| TC-U-03 | Priority Score คำนวณถูกต้องตามสูตรถ่วงน้ำหนัก | Bed 10A-05: remaining=12%, flow=4, minutes_to_empty=14.5 | เรียกฟังก์ชัน priority_score | `priority_score = (100-12)*0.6 + (4*0.2) + (14.5*-0.2)` = 52.8+0.8-2.9 = **50.7** (§10.5) | P0 | FL-023 / BL-501 |
| TC-U-04 | Priority Queue เรียง Bed ตาม Score จากสูง→ต่ำ | มี Bed 3 เตียงคะแนนต่างกัน | เรียก sort function | ลำดับ output ตรงกับคะแนนจากสูงสุดไปต่ำสุดเสมอ (§10.5) | P0 | FL-024 / BL-502 |
| TC-U-05 | Critical Alert trigger เมื่อ Remaining < 20% | Bed remaining = 19% | ส่งข้อมูล telemetry เข้าระบบ | สร้าง Alert type=Critical ทันที (§10.6) | P0 | FL-028 / BL-401 |
| TC-U-06 | Critical Alert **ไม่** trigger เมื่อ Remaining = 20% พอดี (boundary) | Bed remaining = 20% | ส่งข้อมูล telemetry | ไม่มี Alert Critical สร้างขึ้น (boundary test, "< 20%" ไม่รวม 20%) | P0 | FL-028 / BL-401 |
| TC-U-07 | Empty Alert trigger เมื่อ Remaining = 0% | Bed remaining = 0% | ส่งข้อมูล telemetry | สร้าง Alert type=Empty (§10.6) | P0 | FL-029 / BL-402 |
| TC-U-08 | Device Warning ที่ไม่มีข้อมูล > 30 วินาที | Device หยุดส่งข้อมูล | รอ 31 วินาที | Device status = Warning (§11.4) | P0 | FL-030 / BL-403 |
| TC-U-09 | Device Offline ที่ไม่มีข้อมูล > 60 วินาที | Device หยุดส่งข้อมูลต่อเนื่อง | รอ 61 วินาที | Device status = Offline + สร้าง Alert อัตโนมัติ (§11.4) | P0 | FL-030 / BL-403 |
| TC-U-10 | Alert Debounce ป้องกัน Alert ซ้ำสำหรับเหตุการณ์เดียวกัน | Bed คงอยู่ที่ Remaining < 20% ต่อเนื่อง 3 รอบ telemetry ติดกัน | ส่ง telemetry 3 ครั้งในช่วง debounce window | สร้าง Alert **ครั้งเดียว** ไม่ spam ซ้ำ (§10.6, §12.1 False Alert control) | P0 | FL-032 / BL-405 |
| TC-U-11 | Flow Blockage ใช้คำว่า "Possible/Suspected" เท่านั้น | Expected Flow > 0 แต่ Volume ไม่เปลี่ยนต่อเนื่องเกิน X นาที | Trigger blockage condition | ข้อความ Alert ต้องมีคำว่า "Possible" หรือ "Suspected" ไม่ระบุว่าเป็น Occlusion แน่นอน (§10.6) | P1 | FL-033 / BL-406 |

---

# 3. Integration Test Cases

| ID | Title | Precondition | Steps | Expected Result | Priority | Ref |
|---|---|---|---|---|---|---|
| TC-I-01 | Telemetry → Priority Recalculation → Socket Broadcast | Backend รับ telemetry ใหม่ | POST telemetry ที่ทำให้ Remaining ลดต่ำกว่า threshold | Priority Score อัปเดต และ event `iv:update`/`alert:new` ถูก broadcast ผ่าน Socket.IO (§11.3) | P0 | FL-016 / BL-303 |
| TC-I-02 | End-to-End Latency < 10 วินาที | Device ส่ง telemetry จริง (หรือ mock) | วัดเวลาจาก telemetry ถูกส่ง ถึง Dashboard แสดงผลอัปเดต | Latency รวม < 10 วินาที (§11.1, §11.3) | P0 | FL-017 / BL-304 |
| TC-I-03 | Telegram Message มีข้อมูลครบตาม Spec | Critical Alert ถูกสร้าง | ตรวจสอบ message ที่ส่งไป Telegram | ข้อความมี Alert Type + Bed + Patient (HN) + Remaining + ETE + Timestamp ครบ (§10.8) | P0 | FL-031 / BL-404 |
| TC-I-04 | Device Offline Alert ไม่ trigger ซ้ำระหว่างที่ Offline ต่อเนื่อง | Device offline ค้างอยู่ 5 นาที | ตรวจสอบจำนวน Alert ที่สร้างระหว่าง offline | สร้าง Alert ครั้งแรกที่เข้า Offline เท่านั้น ไม่ spam ซ้ำทุกรอบ polling (§10.6) | P1 | FL-032 / BL-405 |

---

# 4. End-to-End / Acceptance Test Cases (Gherkin — เทียบกับ Journey Stage)

```gherkin
Feature: Critical IV Alert Response (Journey Stage 2–4)

  Scenario: TC-E-01 — พยาบาลได้รับ Critical Alert ทาง Telegram ระหว่างทำงานอื่น
    Given เตียง 10A-05 มี Remaining % ลดลงต่ำกว่า 20%
    When ระบบประมวลผล telemetry ล่าสุด
    Then พยาบาลต้องได้รับข้อความ Telegram ภายใน 10 วินาที
    And ข้อความต้องระบุ Bed, HN, Remaining %, ETE, Timestamp

  Scenario: TC-E-02 — พยาบาลเปิด Dashboard แล้วเห็นเตียงวิกฤตอยู่บนสุดของ Priority Queue
    Given มีหลายเตียงที่สถานะแตกต่างกัน (Normal, Warning, Critical)
    When พยาบาลเปิดหน้า Ward Detail
    Then เตียง 10A-05 (Critical, Priority Score สูงสุด) ต้องอยู่แถวบนสุดของ Bed Grid
    And Label ต้องแสดง "P1 Critical"

  Scenario: TC-E-03 — พยาบาลกรอง Bed Grid เพื่อดูเฉพาะเตียง Critical
    Given Ward มีเตียงสถานะผสมกัน
    When พยาบาลเลือก Filter = "Critical"
    Then Bed Grid ต้องแสดงเฉพาะเตียงที่สถานะ Critical เท่านั้น

  Scenario: TC-E-04 — พยาบาลเปิด Patient Detail Drawer เพื่อดูรายละเอียดก่อนเดินไปเตียง
    Given พยาบาลกดที่ Bed Card ของเตียง 10A-05
    When Drawer เปิดขึ้น
    Then ต้องแสดง HN, Remaining %, Remaining ml, Flow Rate, ETE, และ Historical Chart ตรงกับข้อมูลจาก backend ล่าสุด

  Scenario: TC-E-05 — False Alert ต้องไม่เกิดถี่เกินไปในหนึ่งเวร (Hard Requirement)
    Given เตียงหนึ่งอยู่ในสถานะ Critical ต่อเนื่องโดยไม่มีการเปลี่ยนแปลงจริง
    When ระบบประมวลผล telemetry ซ้ำหลายรอบตลอดเวร
    Then จำนวน Alert ที่ไม่จำเป็นที่พยาบาลได้รับต้องไม่เกิน threshold ที่กำหนด (⚠️ ต้องยืนยันตัวเลขจริงจาก Pilot Phase 0 — PRD §16.4)
```

---

# 5. Traceability Matrix

| Journey Stage | Test Case IDs |
|---|---|
| Stage 1 — Trigger (ETE) | TC-U-01, TC-U-02 |
| Stage 2 — Detect & Notify | TC-U-05, TC-U-06, TC-U-07, TC-U-10, TC-I-03, TC-E-01, TC-E-05 |
| Stage 3 — Triage (Priority Queue) | TC-U-03, TC-U-04, TC-I-01, TC-I-02, TC-E-02, TC-E-03 |
| Stage 4 — Investigate (Patient Detail Drawer) | TC-E-04 |

---

## Related

- [[User Journey - Critical IV Alert Response]]
- [[Project Requirement Document (PRD) v2.1]]
- [[Feature List]]
- [[Product Backlog]]

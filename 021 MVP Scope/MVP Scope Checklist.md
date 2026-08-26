---
title: "SMIS — MVP Scope Checklist"
project: Smart IV Monitoring System (SMIS)
type: checklist
status: draft
version: 1.0
date: 2026-08-26
source: "[[Feature List]], [[Project Requirement Document (PRD) v2.1]] §16.1–16.3"
tags:
  - smis
  - mvp-scope
  - checklist
---

# MVP Scope Checklist — SMIS

> เดิมไฟล์นี้ว่าง — Checklist นี้ดึงทุก Feature ที่ Release = `MVP` จาก [[Feature List]] มาจัดเป็นรายการ tick-off จริง ใช้ตอนตรวจสอบว่า MVP ครบ scope หรือยังก่อนเข้า Sprint 6 (Stabilization) / Demo / UAT — ทุกแถวอ้าง Feature ID กลับไปที่ [[Feature List]] เสมอเพื่อไม่ให้ scope หลุด sync

⚠️ **หมายเหตุความไม่ตรงกันที่พบ:** [[Feature List]] §0 Summary ระบุ MVP = 27 Feature แต่เมื่อนับจริงจากคอลัมน์ Release ในตารางแต่ละหมวด (§1–8) พบว่ามี Feature ที่ tag `MVP` จริง **40 รายการ** (ตามรายการด้านล่าง) — ตัวเลข 27 ในสรุปน่าจะยังไม่ได้อัปเดตตามตารางละเอียด ควรให้ Product Owner ยืนยันและแก้ไขไฟล์ [[Feature List]] §0 ให้ตรงกับตารางจริง ไม่ใช่แก้ที่นี่

---

# 1. Checklist by Module (40 MVP Features)

## 1.1 Platform Foundation

- [ ] FL-001 — Dev Environment & CI
- [ ] FL-002 — Core Database Schema
- [ ] FL-003 — Authentication (Login/Logout)
- [ ] FL-004 — Dashboard Layout & Sidebar
- [ ] FL-005 — Error Logging / Monitoring

## 1.2 Ward & Bed Management

- [ ] FL-006 — Ward CRUD
- [ ] FL-007 — Bed CRUD & Assignment
- [ ] FL-008 — Bed Grid View
- [ ] FL-009 — Bed Sorting
- [ ] FL-010 — Bed Filtering
- [ ] FL-011 — Patient Detail Drawer
- [ ] FL-012 — Device Provisioning UI

## 1.3 Realtime IoT Data Pipeline

- [ ] FL-014 — ESP32 Telemetry Firmware
- [ ] FL-015 — Telemetry Ingestion API
- [ ] FL-016 — Realtime Broadcast (Socket.IO)
- [ ] FL-017 — Live Dashboard Update (<10s)
- [ ] FL-018 — Mock Device Simulator
- [ ] FL-019 — Sensor Noise Smoothing

## 1.4 IV Monitoring Core (ETE & Priority)

- [ ] FL-020 — Remaining % / ml Calculation
- [ ] FL-021 — Estimated Time to Empty (ETE) — **Core Feature**
- [ ] FL-022 — IV Color Status Band
- [ ] FL-023 — Priority Score Engine — **Core Feature**
- [ ] FL-024 — Priority Queue Display (P1–P4)

## 1.5 Alert & Notification

- [ ] FL-028 — Critical Alert (IV < 20%)
- [ ] FL-029 — Empty Alert (IV = 0%)
- [ ] FL-030 — Device Offline Alert
- [ ] FL-031 — Telegram Notification
- [ ] FL-032 — Alert Debouncing & Threshold Tuning — **Hard Requirement**
- [ ] FL-033 — Flow Blockage / Occlusion Warning
- [ ] FL-034 — Temporary Mobility Mode

## 1.6 Device Monitoring

- [ ] FL-038 — Device Status Tracking
- [ ] FL-039 — Device Reliability Report

## 1.7 Analytics & Reporting

- [ ] FL-042 — Daily Statistics
- [ ] FL-043 — Consumption Trend & Ward Distribution Charts
- [ ] FL-044 — Nurse Workload Report

## 1.8 Quality, Deployment & Compliance

- [ ] FL-048 — Core Calculation Unit Tests
- [ ] FL-049 — End-to-End Integration Test
- [ ] FL-050 — Load Test (100+ Devices)
- [ ] FL-051 — UX Polish (loading/empty/error states)
- [ ] FL-052 — Deployment & Rollback Guide

---

# 2. MVP Success Criteria (PRD §16.3 — ต้องผ่านทั้งหมด)

- [ ] Device ส่งข้อมูล Real-time ตามสเปก §11.3
- [ ] Dashboard แสดงข้อมูลภายใน < 10 วินาที
- [ ] ระบบคำนวณ Remaining Volume, ETE, Priority Score ถูกต้อง
- [ ] ระบบแจ้งเตือน Critical และส่ง Telegram Notification ได้
- [ ] Nurse เห็นเตียงที่ต้องดูแลก่อนจาก Priority Queue โดยไม่ต้องเดินตรวจทุกเตียง
- [ ] แสดง Historical Data เบื้องต้นได้

---

# 3. MVP Phase 1 Scope (PRD §16.1 — เช็คระดับ Epic)

- [ ] Dashboard Overview
- [ ] Ward Detail Page
- [ ] Bed Grid View
- [ ] IV Visualization
- [ ] Realtime Mock Data → Real Device
- [ ] Alert Center
- [ ] Priority Queue Engine
- [ ] Telegram Notification

---

# 4. Explicitly Out of MVP Scope (PRD §13 — ห้าม scope creep เข้ามา)

- ❌ การควบคุม/ปรับอัตราการไหลของ IV Pump อัตโนมัติ
- ❌ การวินิจฉัยโรคหรือการตัดสินใจทางการแพทย์แทนบุคลากร
- ❌ การเชื่อมต่อ Hospital Information System แบบเต็มรูปแบบ
- ❌ AI ที่ซับซ้อน (Predictive Refill FL-026, Anomaly Detection FL-027 — Phase 3+)
- ❌ Auto Bag Change Detection (FL-025 — Phase 2)
- ❌ LINE OA / Email / Push / SMS Notification (FL-035–037 — Phase 2/3+)
- ❌ MQTT / OTA Firmware Update (FL-040/041 — Phase 3+)
- ❌ Digital Twin Ward View (FL-013 — Phase 2)

---

# 5. Blocking Gates ก่อนเข้า Pilot จริง (ไม่ใช่ Feature ซอฟต์แวร์ — PRD §13.5, §16.4)

- [ ] FL-053 — Regulatory Assessment (อย./Medical Device Classification)
- [ ] FL-054 — Pilot Baseline Data Collection (1 ward × 1 สัปดาห์)
- [ ] FL-055 — Nurse Interview Program (5–8 คน)

---

## Related

- [[Feature List]]
- [[Project Requirement Document (PRD) v2.1]]
- [[Sprint List]]
- [[Testing Plan]]
- [[Product Backlog]]

---
title: "SMIS — User Journey: Critical IV Alert Response"
project: Smart IV Monitoring System (SMIS)
type: user-journey
status: draft
version: 1.0
date: 2026-08-22
source: "[[Project Requirement Document (PRD) v2.1]], [[Feature List]], [[Product Backlog]]"
tags:
  - smis
  - user-journey
  - nurse
---

# User Journey — Critical IV Alert Response

> เลือก Journey นี้เพราะเป็น journey ที่ตอบ **Root Cause หลัก** ของโปรดักต์ตรงที่สุด (§5 ของ [[Project Requirement Document (PRD) v2.1]]): "หอผู้ป่วยไม่มีมิติเวลาของสารน้ำ" — journey นี้แสดงให้เห็นว่า ETE + Priority Queue + Alert เปลี่ยนงานจาก **reactive (รอญาติเรียก)** เป็น **proactive (วางแผนล่วงหน้า)** ได้จริงหรือไม่ และเป็น journey เดียวที่ครอบคลุมทุก Core Feature ของ MVP (Dashboard, Bed Grid, Priority Queue, Alert Center, Telegram, Patient Detail Drawer)

---

# 1. Persona & Scenario

**Persona:** พยาบาลประจำการ (Primary User) — ดูแล 8–16 เตียงในหนึ่งเวร (อ้างจาก [[Root  Cause]] §Persona A)

**Scenario:** ระหว่างเวรบ่าย พยาบาลกำลังเตรียมยาให้ผู้ป่วยเตียงอื่นอยู่ ขณะที่สารน้ำของผู้ป่วยเตียง 10A-05 กำลังจะหมดโดยที่พยาบาลไม่ได้เดินผ่านเตียงนั้นมา 20 นาทีแล้ว

**Goal ของพยาบาล:** รู้ล่วงหน้าว่าต้องไปเปลี่ยน IV เตียงไหนก่อน โดยไม่ต้องเดินตรวจทุกเตียงและไม่ถูกงานแทรกกลางคัน

---

# 2. Journey Map

| # | Stage | Nurse Action / Goal | System Touchpoint (Feature) | Before SMIS (Pain Point) | After SMIS (Value Delivered) | Emotion (Before → After) | Feature/FR Ref |
|---|---|---|---|---|---|---|---|
| 1 | **Trigger** | ยังไม่รู้ตัวว่า IV ใกล้หมด — กำลังทำงานอื่นอยู่ | ระบบคำนวณ ETE ต่อเนื่องจาก Flow Rate แบบ real-time | ไม่มีมิติเวลา รู้แค่ "ตอนนี้เหลือเท่าไหร่" เมื่อเดินผ่าน | ETE คำนวณล่วงหน้าตั้งแต่ก่อนจะถึงจุดวิกฤต | 😐 เฉยๆ (ไม่รู้ว่ามีปัญหากำลังเกิด) → 🙂 อุ่นใจ (รู้ว่าระบบเฝ้าอยู่) | FL-021 ETE (§10.4) |
| 2 | **Detect & Notify** | ได้รับ Critical Alert ผ่าน Telegram ระหว่างทำงานอื่น | Alert Engine สร้าง Critical Alert (Remaining < 20%) + ส่ง Telegram พร้อม Bed/Patient/Remaining/ETE/Timestamp | เดิมรู้จาก **ญาติมาเรียก** (~50–70% ของเคส ตาม ⚠️ สมมติฐานใน [[Root  Cause]]) → เสียหน้า เสียเวลาสะดุดงาน | รู้ล่วงหน้าเองผ่านมือถือ **ก่อน** ญาติจะต้องมาเรียก | 😣 ถูกขัดจังหวะกะทันหัน → 😌 ได้รับแจ้งอย่างมีเวลาเตรียมตัว | FL-028 Critical Alert, FL-031 Telegram (§10.6, §10.8) |
| 3 | **Triage** | ทำงานที่ทำอยู่ให้เสร็จเป็นจังหวะ แล้วเปิด Dashboard เพื่อดูว่าต้องไปเตียงไหนก่อน | Dashboard Overview KPI (Critical IV count) → Ward Detail → Bed Grid **เรียงตาม Priority Score อัตโนมัติ** เตียงวิกฤตอยู่บนสุด | ต้องเดินสำรวจ/จำสถานะทุกเตียงเองว่าเตียงไหนหนักสุด | เห็นลำดับความสำคัญทันทีโดยไม่ต้องประเมินเอง — **ตัดสินใจได้ในไม่กี่วินาที** | 😩 ต้องคิดเองว่าเตียงไหนก่อน → 😊 ระบบจัดลำดับให้แล้ว | FL-023/024 Priority Queue, FL-009/010 Sort/Filter (§10.5) |
| 4 | **Investigate** | กดเข้าไปดูรายละเอียดเตียง 10A-05 ก่อนเดินไปจริง | Patient Detail Drawer: HN, Remaining %/ml, Flow Rate, ETE, Historical Chart | ต้องเดินไปดูของจริงถึงจะรู้รายละเอียด (เสียเวลาเดินซ้ำถ้าประเมินผิด) | รู้ล่วงหน้าว่าต้องเตรียมถุงน้ำเกลือขนาดไหน เดินไปครั้งเดียวพร้อมของ | 😖 เดินไปเก้อ/ต้องเดินสองรอบ → 🙂 เตรียมพร้อมก่อนเดิน | FL-011 Patient Detail Drawer (§10.3) |
| 5 | **Act** | เดินไปเปลี่ยนถุงน้ำเกลือที่เตียง 10A-05 (ออฟไลน์ — นอกระบบ) | — (physical action) | เป็น **งานแทรก** ที่ตัดจังหวะงานที่ทำอยู่กลางคัน | เป็น **งานที่วางแผนแล้ว** แทรกในจังหวะที่พยาบาลเลือกเอง ไม่ใช่ถูกบังคับ | 😤 ถูกบังคับหยุดงานกะทันหัน → 😌 เลือกจังหวะได้เอง | ตอบ Root Cause หลัก §5.3 (P2) |
| 6 | **Confirm & Resolve** | เปลี่ยนถุงเสร็จ ระบบตรวจจับ pattern น้ำหนักเพิ่มขึ้น→คงที่ → ตีความเป็น bag ใหม่ → Alert เคลียร์อัตโนมัติ | Auto Bag Change Detection (Phase 2) → Reset Baseline → Priority Score กลับสู่ปกติ | ไม่มีการยืนยันในระบบว่าเปลี่ยนแล้ว ต้องจำเองหรือบอกปากเปล่า | ระบบรู้เองว่าเปลี่ยนถุงแล้ว พยาบาลไม่ต้องกดปุ่มใดๆ | 😐 ไม่มี feedback ว่า "เคลียร์แล้วจริงไหม" → 🙂 มั่นใจว่าระบบตามต่อให้ | FL-025 Auto Bag Change Detection (§10.11, Phase 2) |
| 7 | **Reflect (End of Shift)** | หัวหน้าหอดูรายงานย้อนหลังว่าเวรนี้มีงานแทรกกี่ครั้ง ตอบสนองเร็วแค่ไหน | Nurse Workload Report / Daily Statistics | หัวหน้าหอมีแต่ "ความรู้สึกของน้องตอนส่งเวร" ไม่มีตัวเลข | มีข้อมูลเชิงปริมาณใช้ขออัตรากำลังคน/ปรับเวรได้จริง | 😕 ขาดหลักฐาน → 🙂 มีหลักฐานอ้างอิงได้ | FL-042/044 Daily Stats, Nurse Workload Report (§10.12) |

---

# 3. Edge Case Branch — Patient Mobility (ยังเป็น Open Question)

ที่ Stage 2 ถ้าสารน้ำไม่ได้หมดจริงแต่ผู้ป่วยพกกระปุกไปเข้าห้องน้ำเอง (ไม่ผ่านปุ่ม Temporary Mobility): ระบบอาจ misread เป็น Flow Blockage หรือ Sudden Weight Change → เกิด False Alert ⚠️ ต้องออกแบบ UX ให้พยาบาล/ผู้ป่วยกดปุ่มเดียวเพื่อ suspend alert ได้ง่ายพอที่จะถูกใช้จริง มิฉะนั้น journey นี้จะเจอ False Alert บ่อยจนพยาบาลเลิกเชื่อระบบ (ดู §5.4, §10.10 และ Risk ใน §17 ของ PRD)

---

# 4. Success Criteria สำหรับ Journey นี้ (อ้างจาก PRD §12)

- Stage 2→3: เวลาจาก Alert เกิดขึ้นจริง ถึง Telegram ส่งถึงมือถือพยาบาล < 10 วินาที (§11.1, §11.3)
- Stage 3: เตียงที่ Priority Score สูงสุดต้องอยู่บนสุดของ Bed Grid เสมอ (§10.5)
- Stage 2: False Alert ต้องไม่เกิด threshold ที่ทำให้พยาบาลเลิกเชื่อ (⚠️ ต้องยืนยันตัวเลขจริงจาก Pilot Phase 0 — §16.4)
- Stage 6: ⚠️ Auto Bag Change Detection เป็น Phase 2 — MVP อาจต้องให้พยาบาล mark-as-resolved เองก่อน (fallback ที่ไม่มีใน Journey เดิมของ Master PRD ต้องตัดสินใจใน Sprint Planning)

---

## Related

- [[Project Requirement Document (PRD) v2.1]]
- [[Feature List]]
- [[Product Backlog]]
- [[Root  Cause]]
- [[User Stories]]

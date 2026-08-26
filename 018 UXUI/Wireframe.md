---
title: "SMIS — Wireframe / Screen List"
project: Smart IV Monitoring System (SMIS)
type: wireframe
status: draft
version: 1.0
date: 2026-08-26
source: "[[Main.dc.html]], [[ward-detail-critical-alert.html]], [[Feature List]], [[Sprint List]]"
tags:
  - smis
  - wireframe
  - uxui
---

# Wireframe / Screen List — SMIS

> เดิมไฟล์นี้ว่าง — ในโฟลเดอร์นี้มี High-Fidelity Mockup ที่สร้างไว้แล้วจริงเป็นไฟล์ HTML (`Main.dc.html` = Dashboard/Ward Detail layout, `ward-detail-critical-alert.html` = Ward Detail พร้อม Critical Alert state) ไฟล์นี้ทำหน้าที่เป็น **screen inventory + layout note** ที่อธิบายโครงของแต่ละหน้าเป็นข้อความ เพื่อให้อ่านเร็วกว่าเปิด HTML และ track ว่าหน้าไหนออกแบบแล้ว/ยังไม่ออกแบบ เทียบกับ Sidebar 7 เมนูใน FL-004

**สถานะ Mockup จริง:** ดูภาพที่ `018 UXUI/Main.dc.html` (เปิดผ่าน Claude Design canvas) และ `018 UXUI/ward-detail-critical-alert.html` (เปิดเป็นหน้าเว็บเดี่ยวได้ตรง)

---

# 1. Global Layout (ใช้ทุกหน้า)

```text
┌───────────┬─────────────────────────────────────────────┐
│           │  Topbar: Page Title | Search (⌘K) | Avatar  │
│  Sidebar  ├─────────────────────────────────────────────┤
│  - Logo   │                                              │
│  - Dashboard                                              │
│  - Wards  │              Main Content Area               │
│  - Patients│                                              │
│  - Devices│                                              │
│  - Alerts │                                              │
│  - Analytics                                              │
│  - Settings│                                             │
│  - Avatar │                                              │
└───────────┴─────────────────────────────────────────────┘
```

Sidebar 7 เมนูตรงกับ FL-004 (Dashboard Layout & Sidebar) — implement แล้วใน `Main.dc.html` (fixed width 236px, dark theme)

---

# 2. Screen Inventory

| # | Screen | สถานะ Mockup | Feature Ref | ไฟล์ |
|---|---|---|---|---|
| 1 | Dashboard Overview | ✅ ออกแบบแล้ว (โครง sidebar + layout) | FL-004 | `Main.dc.html` |
| 2 | Ward Detail (Bed Grid + Priority Queue) | ✅ ออกแบบแล้ว (เต็มรูปแบบ) | FL-008, FL-009, FL-024 | `ward-detail-critical-alert.html` |
| 3 | Critical Alert Banner | ✅ ออกแบบแล้ว | FL-028 | `ward-detail-critical-alert.html` |
| 4 | Bed Detail Panel (สรุปด้านข้าง) | ✅ ออกแบบแล้ว | FL-011 (บางส่วน) | `ward-detail-critical-alert.html` |
| 5 | Patient Detail Drawer (เต็ม + Historical Chart) | ⬜ ยังไม่ออกแบบ | FL-011 | — |
| 6 | Patients List | ⬜ ยังไม่ออกแบบ | FL-007 | — |
| 7 | Devices List / Device Monitoring | ⬜ ยังไม่ออกแบบ | FL-012, FL-038 | — |
| 8 | Alert Center (list เต็ม, ไม่ใช่แค่ banner) | ⬜ ยังไม่ออกแบบ | FL-028–033 | — |
| 9 | Analytics Dashboard | ⬜ ยังไม่ออกแบบ | FL-042–044 | — |
| 10 | Settings (Threshold Tuning, User Management) | ⬜ ยังไม่ออกแบบ | FL-032, FL-003 | — |
| 11 | Login | ⬜ ยังไม่ออกแบบ | FL-003 | — |

> Sprint 2–3 ([[Sprint List]]) ต้องการ Ward Page, Bed Card, Patient Detail ก่อน — ลำดับ #5, #6 ควรออกแบบถัดไป

---

# 3. Ward Detail Screen — โครงหน้าที่มีอยู่แล้ว (จาก `ward-detail-critical-alert.html`)

```text
Topbar
 └─ "Ward 10A" + breadcrumb + search (⌘K) + avatar

Critical Alert Banner (แสดงเมื่อมี Critical Alert ที่ยัง unresolved)
 └─ "Critical Alert — Bed 10A-05" + timestamp ("Just now")

KPI Row (4 cards)
 ├─ Active Beds: 12
 ├─ Critical: 2
 ├─ Warning: 3
 └─ Normal: 7

Content — 2 columns
 ├─ ซ้าย: Priority Score list (เรียงจากสูงสุด, badge "Critical · 2")
 │    └─ แต่ละแถว: Bed No. + Remaining % + Priority indicator
 └─ ขวา: Bed Detail Panel (เตียงที่เลือก/critical ล่าสุด)
      ├─ Bed 10A-05 · HN-245678 · Ward 10A
      ├─ Remaining: 12% (สี Critical/แดง)
      ├─ Status label: "Critical · needs attention soon"
      ├─ ETE: ~15 min
      ├─ Remaining ml: 58 ml
      ├─ Flow Rate: 4.0 ml/min
      ├─ Last updated: 14:20
      └─ Device: IV-10A-05
```

โครงนี้ตรงกับ field ใน [[API Specification|API]] §3.1 (`ivStatus`) และ §3.3 (`beds/:id/detail`) เกือบทั้งหมด — field ที่ยังไม่มีใน mockup: Historical Chart (30min/1h/24h ตาม FL-011)

---

## Related

- [[UX-UI Design]]
- [[Prototype]]
- [[Feature List]]
- [[Sprint List]]
- [[API Specification|API]]
- [[Application Architecture]]

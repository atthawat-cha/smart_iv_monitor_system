---
title: "SMIS — Prototype Index"
project: Smart IV Monitoring System (SMIS)
type: prototype
status: draft
version: 1.0
date: 2026-08-26
source: "[[Main.dc.html]], [[canvas.json]], [[ward-detail-critical-alert.html]]"
tags:
  - smis
  - prototype
  - uxui
---

# Prototype Index — SMIS

> เดิมไฟล์นี้ว่าง — ไฟล์นี้เป็น index ที่บอกว่า Prototype ไฟล์ไหนอยู่ตรงไหน เปิดยังไง และครอบคลุม Feature อะไรแล้วบ้าง เทียบกับ [[Wireframe]] (screen inventory) และ [[UX-UI Design]] (design system)

---

# 1. Prototype Files ในโฟลเดอร์นี้

| ไฟล์ | ประเภท | เปิดยังไง | ครอบคลุม |
|---|---|---|---|
| `Main.dc.html` + `canvas.json` | Claude Design Canvas (editable artboard) | เปิดผ่าน Claude Design canvas editor (multi-artboard, click-to-select) | Global Layout: Sidebar 7 เมนู, Topbar, Dark Theme base |
| `ward-detail-critical-alert.html` | Static High-Fidelity Mockup (standalone HTML) | เปิดตรงในเบราว์เซอร์ได้เลย (ไม่ต้องใช้ canvas editor) | Ward Detail เต็มหน้า: KPI Row, Critical Alert Banner, Priority Score List, Bed Detail Panel |

`canvas.json` เก็บ layout ของ artboard (`Main.dc.html` ที่ตำแหน่ง 0,0 ขนาด 1600×960) — เป็น metadata สำหรับ canvas editor ไม่ใช่หน้าจอจริง

---

# 2. Fidelity Level

| Level | สถานะ |
|---|---|
| Wireframe (โครงเทา ไม่มีสี) | ข้าม — ไปเริ่มที่ High-Fidelity เลย |
| **High-Fidelity Mockup** | ✅ มีแล้ว 2 หน้า (Dashboard shell, Ward Detail เต็ม) — สี/font/animation ใกล้เคียงของจริง |
| Interactive Prototype (คลิกเปลี่ยนหน้าได้จริง) | ⬜ ยังไม่มี — ปัจจุบันเป็น static mockup ต่อหน้า ไม่ได้ link ข้ามหน้ากัน |
| Clickable Demo เชื่อมกับ Mock API | ⬜ ยังไม่มี — รอ Sprint 1–3 (Backend + Mock Device) |

---

# 3. Feature Coverage Snapshot

ดูรายละเอียดเต็มใน [[Wireframe]] §2 — สรุปสั้น:

- ✅ ออกแบบแล้ว: FL-004 (Sidebar Layout), FL-008/009 (Bed Grid), FL-024 (Priority Queue), FL-028 (Critical Alert Banner), FL-011 บางส่วน (Bed Detail แบบย่อ)
- ⬜ ยังไม่ออกแบบ: FL-003 (Login), FL-007 (Patients List), FL-012/038 (Devices), FL-032 (Alert Center list เต็ม), FL-042–044 (Analytics), Settings, Historical Chart (ส่วนที่เหลือของ FL-011)

---

# 4. Next Steps สำหรับ Design

1. เชื่อม `Main.dc.html` (Dashboard shell) กับเนื้อหา Dashboard Overview จริง (KPI: Active Beds, Critical IV, Warning IV, Connected Devices, Avg Flow Rate, Est. Next Refill — PRD §10.1)
2. เพิ่ม Historical Chart (30min/1h/24h) เข้า Bed Detail Panel ให้ครบ FL-011
3. ออกแบบ Patients List, Devices List, Alert Center (list เต็ม), Analytics, Settings, Login — ตามลำดับ Sprint 2–5 ([[Sprint List]])
4. ปิด gap สี 5-tier ตามที่ระบุใน [[UX-UI Design]] §1.1 ก่อนขึ้น mockup หน้าที่เหลือ เพื่อไม่ให้ inconsistent กันระหว่างหน้า

---

## Related

- [[Wireframe]]
- [[UX-UI Design]]
- [[Feature List]]
- [[Sprint List]]

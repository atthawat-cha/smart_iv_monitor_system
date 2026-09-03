# SCOPE.md — Smart IV Monitoring System (SMIS)

> Topic: **BL-201** — As a System Admin, I want to CRUD Wards so that hospital structure can be configured (ref: `019 Development Plan/Product Backlog.md`)

ระบบ SMIS เก็บข้อมูล Ward (แผนก/วอร์ด) ที่ System Admin เป็นผู้สร้างและแก้ไข แต่ละ Ward มีเตียง (Bed) ที่สถานะ Critical/Warning/Normal/Offline ถูกคำนวณและอัปเดตโดยระบบอัตโนมัติจากข้อมูลอุปกรณ์ IoT ที่ติดอยู่กับสาย IV ไม่ใช่จากคนกดเปลี่ยนเอง

## ตารางขอบเขต (Scope Table)

| # | องค์ประกอบ | ตัวอย่าง LeaveEasy | ของ SMIS |
|---|---|---|---|
| 1 | 📁 โฟลเดอร์หลัก | `leaveRequests` | `wards` |
| 2 | 📁 โฟลเดอร์ประเภท | `leaveTypes` | `wardType` (ICU / Medical Ward / Emergency / Surgical) |
| 3 | 📁 โฟลเดอร์ย่อย | `approvals` | `beds` (subcollection ใต้แต่ละ ward doc) |
| 4 | ✏️ ช่องบอกเป็นของใคร | `requesterId` · `requesterName` | `patientHn` (ระบุว่าเตียงนี้เป็นของผู้ป่วยคนไหน) |
| 5 | 🔀 สถานะทั้งหมด | รอพิจารณา · อนุมัติ · ไม่อนุมัติ | Critical · Warning · Normal · Offline |
| 6 | 📝 ช่องข้อความยาว (AI อ่าน) | `reason` | `note` (หมายเหตุของ Ward เช่นเหตุผลปิดปรับปรุงชั่วคราว) |
| 7 | 👤 คนที่สร้างรายการ | พนักงาน | System Admin |
| 8 | 👤 คนที่เปลี่ยนสถานะ | หัวหน้า (กดอนุมัติ/ไม่อนุมัติ) | ระบบ (Backend คำนวณอัตโนมัติจาก telemetry อุปกรณ์ IoT ไม่ใช่คนกด) |
| 9 | 🤖 งานที่ AI ช่วย (สัปดาห์ 8) | จัดประเภทให้อัตโนมัติ | สรุป/จัดประเภทข้อความใน `note` ของ Ward ให้อัตโนมัติ |

## หมายเหตุถึงอาจารย์

ระบบ SMIS จริงออกแบบให้ใช้ **PostgreSQL + Prisma** ตั้งแต่ Sprint 1 (ดู `000-Project-Code/smis/apps/api/prisma/schema.prisma`) โค้ดสำหรับการบ้านที่ต้องใช้ **Firestore** ตามที่คอร์สกำหนด จึงถูกแยกไว้ต่างหากใน [`raise2-homework/week6/`](raise2-homework/week6/) เป็น sandbox เฉพาะกิจ ไม่ปะปนกับ schema/โค้ดจริงของโปรเจกต์

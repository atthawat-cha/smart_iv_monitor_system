# CLAUDE.md — SMIS (Smart IV Monitoring System)

ระบบติดตามสารน้ำ (IV Fluid) แบบ Real-Time ด้วย IoT เอกสารออกแบบฉบับเต็มอยู่ใน Obsidian vault (โฟลเดอร์แม่ของ `000-Project-Code/`): PRD, Feature List, Product Backlog, MVP Scope Checklist, Sprint List, Detailed Design

## Repo layout

- repo นี้ (`000-Project-Code/smis`) เก็บ **โค้ดอย่างเดียว** เป็น git repo แยกจาก vault — เอกสารอยู่ที่ vault ไม่ใช่ที่นี่
- `apps/web` Next.js 15 · `apps/api` NestJS + Prisma + PostgreSQL + Socket.IO · `firmware/esp32-iv-node` · `tools/mock-device-simulator` · `e2e/`
- Branch หลัก: `main` (release) · `development` (integration) — งานทั้งหมด merge เข้า `development` ผ่าน PR

## สถานะ IoT

ตอนนี้ **จำลอง IoT บน Docker** ด้วย `tools/mock-device-simulator` (FL-018) ยังไม่มีฮาร์ดแวร์จริง

- simulator คือแหล่งข้อมูล telemetry หลัก ควรสมจริง: น้ำหนักลดตาม flow rate, มี noise/spike, จำลองเปลี่ยนถุงและอุปกรณ์หลุด
- FL-014 (ESP32 firmware) เลื่อนไปก่อน
- ห้ามอ้างว่าทดสอบกับฮาร์ดแวร์จริง ถ้าไม่ได้ทดสอบ

## ขั้นตอนทำงานต่อ 1 feature (ต้องทำตามทุกครั้ง)

1. **วางแผน** — อ่าน Acceptance Criteria ของ BL ที่เกี่ยวข้องใน Product Backlog แล้วแตกเป็น task ย่อย (Backlog ไม่มี task ย่อยให้) สรุปแผนสั้นๆ ให้ผู้ใช้เห็นก่อนลงมือ
2. **สร้าง branch** — `feature/FL-0xx-short-name` แตกจาก `development` (feature เล็กที่ผูกกันมาก เช่น sort + filter รวม branch เดียวได้)
3. **พัฒนา** — ส่วน core (ETE, Priority Score, Alert/Debouncing) ใช้ TDD เขียน test ก่อน
4. **ทดสอบบน branch** — unit test + lint + ตรวจ Acceptance Criteria ให้ผ่านก่อนเปิด PR
5. **เปิด Pull Request เข้า `development`** — ห้าม merge ตรง รอผู้ใช้ review และอนุมัติ; ใน PR ระบุ FL/BL ID, task ที่ทำ, ผลทดสอบ
6. **ทดสอบหลัง merge** — หลังผู้ใช้ merge แล้ว pull `development` และรัน test ทั้งชุดอีกรอบ
7. **อัปเดตเอกสารที่ vault** — ติ๊ก MVP Scope Checklist และเปลี่ยน Status ใน Feature List
8. **ไป feature ถัดไป** ตามลำดับ Sprint ใน Sprint List

## กฎการทำงาน

- ห้าม merge, push หรือลบ branch เองโดยไม่ได้รับอนุญาต; commit/push เมื่อผู้ใช้สั่งหรือเมื่อเปิด PR ตามขั้นตอนเท่านั้น
- ห้ามเพิ่ม feature นอก MVP (Phase 2/3+ เช่น LINE, MQTT, OTA, AI predictive, Digital Twin) และห้ามทำระบบควบคุมปั๊มหรือวินิจฉัยโรค
- scope MVP = 40 feature ตามตารางจริง (Feature List §0 ที่เขียน 27 ยังรอ PO ยืนยัน)
- รายงานผลตามจริง: ถ้า test ไม่ผ่านหรือข้ามขั้นตอน ให้บอกตรงๆ
- ตอบผู้ใช้เป็นภาษาไทย ส่วนโค้ดและชื่อ identifier เป็นภาษาอังกฤษ

## Commit & PR

- commit message สั้น ขึ้นต้นด้วย FL ID เช่น `FL-021: add ETE calculation`
- PR title: `FL-0xx — ชื่อ feature` base = `development`

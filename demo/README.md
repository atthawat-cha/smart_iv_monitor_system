# SMIS Demo (HTML/CSS/JS)

Demo แบบคลิกได้จริงของระบบ Smart IV Monitoring System (SMIS) ครบทุก flow ตั้งแต่ login จนถึง analytics — เขียนด้วย HTML/CSS/JS ล้วน ไม่มี build step ไม่มี backend จริง ข้อมูลทั้งหมด **mock/simulate ฝั่ง browser** โดยอ้างอิงสูตรคำนวณและ data model จากเอกสารในโปรเจกต์ (`012 Project Require Document/`, `013 Architecture/`, `014 Database/`, `017 API/`, `018 UXUI/`)

## วิธีเปิดดู

เปิดไฟล์ `login.html` ด้วยเบราว์เซอร์ได้เลย (รองรับ `file://` ไม่ต้องรันเซิร์ฟเวอร์)

1. เลือก role (nurse / head_nurse / admin / superadmin / guest) แล้วกด **Sign in**
2. ระบบจะ seed ข้อมูลจำลอง (3 wards, 26 เตียง) และเริ่มจำลอง telemetry แบบ real-time เอง (tick ทุก 1 วินาที)
3. คลิกไปตามเมนู sidebar เพื่อดูแต่ละหน้าจอ — สถานะทั้งหมดถูกเก็บใน `localStorage` ของเบราว์เซอร์ ดังนั้นสลับหน้าไปมาข้อมูลจะต่อเนื่องกันเหมือนมี backend จริง

> อยากเริ่มใหม่ให้สะอาด กด **Reset demo** ที่ panel มุมขวาล่าง (Demo Control Panel)

## สิทธิ์ตาม Role (`js/core/permissions.js`)

| Role | ขอบเขตที่เห็น | ทำ action คลินิกได้ไหม (Acknowledge/Resolve/Mobility/Alert) | Analytics | Settings |
|---|---|---|---|---|
| `nurse` | เฉพาะ ward ที่ตัวเองสังกัด (seed ผูก Nurse Suphada ไว้กับ Ward 10A) — เข้า ward อื่นทาง URL ตรงๆ จะเจอหน้า not-authorized | ✅ (เฉพาะ ward ตัวเอง) | ❌ ซ่อนเมนู | ❌ |
| `head_nurse` | ทุก ward | ✅ ทุก ward | ✅ | ❌ |
| `admin` | ทุก ward | ❌ ดูอย่างเดียว (read-only) | ✅ | ❌ |
| `superadmin` | ทุก ward | ❌ ดูอย่างเดียว (read-only, ไม่ใช่งานคลินิก) | ✅ | ✅ เต็มสิทธิ์ |
| `guest` | Login แล้วเด้งเข้า `tv.html` (Presentation board) ทันที — เข้าเพจอื่นในระบบไม่ได้เลย | ❌ | ❌ | ❌ |

Guest/public board ปิดบัง HN ผู้ป่วย (ขึ้น "Patient" แทน) และปิดการคลิกเตียงเพื่อเปิด drawer รายละเอียด — เหมาะสำหรับจอสาธารณะ (ล็อบบี้/ทางเดิน) ที่ไม่ควรเห็นข้อมูลระบุตัวผู้ป่วย

## หน้าจอที่มีให้ (11 หน้า + Presentation mode)

| ไฟล์ | หน้าจอ | เนื้อหา |
|---|---|---|
| `login.html` | Login | เลือก role แบบ mock (ไม่มี auth จริง) |
| `dashboard.html` | Dashboard | KPI รวมทั้งโรงพยาบาล, กราฟ Consumption Trend, Ward Distribution, Alert Timeline |
| `wards.html` | Wards List | รายชื่อ ward พร้อมสรุปจำนวนเตียงตามสถานะ (รวม Vacant) + ลิงก์ "Present this ward" |
| `ward-detail.html` | Ward Detail | **หน้าหลักที่ port มาจาก `018 UXUI/Main.dc.html`** — Critical Alert Banner, KPI, filter/sort (รวม filter Vacant), Bed Grid (Priority Queue) |
| — | Patient Detail Drawer | เปิดจากการคลิกเตียงในหน้าไหนก็ได้ — กราฟย้อนหลัง (30 min/1h/24h), ชนิดสารน้ำ, ปุ่ม Acknowledge / Mark IV changed / Temporary Mobility |
| `patients.html` | Patients | ตาราง HN ↔ ward/bed/ชนิดสารน้ำ พร้อมสถานะ (เฉพาะเตียงที่มีผู้ป่วย) |
| `devices.html` | Devices | Battery, RSSI, Last seen, Status (รวม Unassigned), Firmware ของแต่ละ IoT device |
| `alerts.html` | Alert Center | รายการ alert ทั้งหมด, filter All/Unread/Open/Resolved, mark read/resolve |
| `analytics.html` | Analytics | Top Critical Beds, Avg Consumption/Ward, Device Reliability, Daily Stats, Nurse Workload |
| `settings.html` | Settings (เฉพาะ `superadmin`) | ดูหัวข้อ **การจัดการฝั่ง Admin** ด้านล่าง |
| `tv.html` | **Presentation / TV Board** | ดูหัวข้อ **โหมด Presentation** ด้านล่าง — ปลายทางเดียวของ role `guest` |

## การจัดการฝั่ง Admin (`settings.html`, เฉพาะ role `superadmin`)

- **Alert Threshold Tuning** — สไลด์เดอร์ปรับ critical-low %, offline warning/alert วินาที, occlusion window แบบ live (มีผลกับ engine จริงทันที)
- **Wards** — เพิ่ม/ลบ ward (ลบไม่ได้ถ้ายังมีเตียงอยู่ในนั้น)
- **Fluid Types** — master catalog ชนิดสารน้ำ (เช่น 0.9% NSS, D5W, Ringer's Lactate) พร้อม default volume ต่อชนิด ใช้ตอน assign สารน้ำเข้าเตียง (ลบไม่ได้ถ้ามีเตียงใช้ชนิดนั้นอยู่)
- **Devices (IoT nodes)** — **provision อุปกรณ์แยกจากการเพิ่มเตียง** ตามสเปกจริง (`POST /devices` แยกจาก `POST /beds`): เพิ่มอุปกรณ์ใหม่จะอยู่สถานะ "Unassigned" (ยังไม่จำลอง telemetry ใดๆ) จนกว่าจะถูก assign เข้ากับเตียง — ลบอุปกรณ์ได้เฉพาะตัวที่ยัง unassigned
- **Beds & device assignment** — เพิ่มเตียงเปล่า (vacant, ยังไม่มีอุปกรณ์/ผู้ป่วย) ได้อิสระ จากนั้นกด **Assign device** เพื่อเลือกอุปกรณ์ที่ unassigned + ชนิดสารน้ำ + HN ผู้ป่วย (optional) มาผูกกับเตียงนั้น — เตียงจะเริ่มจำลอง telemetry จากสารน้ำเต็มถุงทันที; เตียงที่มีผู้ป่วยอยู่กด **Unassign** เพื่อ "จำหน่ายผู้ป่วย" คืนอุปกรณ์เป็น unassigned และล้าง alert/ประวัติของเตียงนั้น
- **Users** — เพิ่มผู้ใช้ + กำหนด role

## โหมด Presentation (`tv.html`) — สำหรับต่อทีวี/มอนิเตอร์

หน้าจอเต็มจอ ไม่มี sidebar/control panel ออกแบบให้เห็นชัดจากระยะไกล ใช้กด **ไอคอนจอทีวี** ที่ topbar (เปิดแท็บใหม่) หรือลิงก์ "Present this ward" ในหน้า Wards:

- `tv.html` (ไม่ระบุ ward) → ภาพรวมทั้งโรงพยาบาล: KPI ใหญ่ 6 ช่อง + เตียงทั้งหมดเรียงตาม Priority Score + รายการ alert ล่าสุด — เหมาะแขวนที่ล็อบบี้/สถานีพยาบาลกลาง
- `tv.html?ward=10A` → บอร์ดเฉพาะ ward นั้น (ครอบคลุมกรณีเอาไปติดมอนิเตอร์ในวอร์ดเองให้พยาบาลเห็น)
- `tv.html?rotate=8` → หมุนสลับแสดงภาพรวม/แต่ละ ward อัตโนมัติทุก 8 วินาที (ปรับตัวเลขวินาทีได้ที่ query param)
- มีนาฬิกาสดในตัว, ปุ่ม Fullscreen, และยังแตะเตียงเพื่อเปิด drawer ดูรายละเอียดได้ (รองรับจอสัมผัส)

## Flow หลักที่ demo ได้ (Critical IV Alert Response)

1. Login → Dashboard เห็นภาพรวม
2. Engine จำลอง telemetry อยู่เบื้องหลัง จนมีเตียงหนึ่ง remaining % ลดต่ำกว่า 20%
3. Alert `critical_low` ยิงอัตโนมัติ → toast แจ้งเตือน, badge นับที่ sidebar เพิ่ม, การ์ดเตียงเริ่ม pulse
4. เข้า Ward Detail → เห็น Critical Alert Banner + bed grid เรียงตาม Priority Score ขึ้นบนสุด (P1)
5. filter/sort ตามต้องการ, คลิกเตียงเพื่อเปิด drawer ดูรายละเอียด + กราฟย้อนหลัง
6. กด "Acknowledge & head to bed" แล้วกด "Mark IV changed / Resolve" → เตียงกลับมา ~100%, alert resolved, กราฟ/KPI อัปเดตทันที
7. เช็คที่ Alert Center ว่า resolved แล้ว, เช็คที่ Analytics ว่าตัวเลขสรุปขยับตาม
8. Edge case ที่มีให้ดูด้วย: เตียง offline (การ์ดจางๆ เส้นประ) และปุ่ม Temporary Mobility (ระงับ alert ชั่วคราว)

## สูตรคำนวณที่ implement ไว้ (`js/core/formulas.js`)

- `remaining % = remainingMl / initialMl * 100`
- `flow rate (ml/min)` = ค่าเฉลี่ยเคลื่อนที่จาก reading ล่าสุด ~10 ค่า, ตัดทิ้งถ้ากระโดด > 30 ml (สัญญาณรบกวน)
- `ETE (นาที) = remainingMl / flowRate` (ถ้าหมดถุงแล้ว ETE = 0, ถ้า flow ~0 แต่ยังไม่หมด ETE = ไม่ทราบค่า)
- `priority_score = (100 - remaining%) * 0.6 + (flowRate * 0.2) + (ETE_นาที * -0.2)` — เรียงเตียงจากคะแนนนี้จากมากไปน้อยเสมอ
- แถบ priority: P1 Critical (ETE < 15 นาที) / P2 High (15–30) / P3 Warning (30–60) / P4 Normal (≥60)
- แถบสีตาม remaining %: 70–100 เขียว, 40–69 เหลือง, 10–39 ส้ม, 1–9 แดง, 0 เทา (หมด)
- Alert แต่ละแบบมี debounce (ไม่ยิงซ้ำถ้ายังมี alert ประเภทเดียวกันค้างอยู่) และถูกระงับทั้งหมดถ้าเตียงอยู่ใน Temporary Mobility Mode

## โครงสร้างโค้ด

```
demo/
├── *.html                 หน้าจอทั้งหมด (แยกไฟล์ ไม่มี router, ใช้ localStorage คุยข้ามหน้า)
├── css/                   tokens (สี/ฟอนต์), shell (sidebar/topbar), components, charts, tv (Presentation mode)
└── js/
    ├── data/              seed.js (ข้อมูลเริ่มต้น + fluid type catalog), scenarios.js (ฟังก์ชัน tick จำลองอุปกรณ์ 5 แบบ)
    ├── core/               formulas.js, store.js (localStorage), engine.js (tick loop + Actions: CRUD ward/bed/device/fluid/user), alerts.js, permissions.js (role → ward scope / action rules)
    ├── ui/                 shell, bedcard (รองรับเตียง vacant), drawer, charts (SVG มือเขียน ไม่ใช้ library), toast, format
    ├── pages/              โค้ดเฉพาะแต่ละหน้า (*.page.js) รวม tv.page.js
    └── devtools/           control-panel.js — สปีดอัพ/บังคับ scenario/reset สำหรับ demo (ไม่แสดงใน tv.html)
```

## ข้อจำกัดที่ตั้งใจตัดออก (เพื่อความเรียบง่ายของ demo)

- ไม่มี backend/auth จริง, ไม่มี network call
- กราฟเป็น inline SVG มือเขียนทั้งหมด ไม่พึ่ง library ภายนอก
- ออกแบบมาสำหรับหน้าจอ desktop เท่านั้น (ไม่ทำ responsive/mobile)
- ตัวเลข analytics บางส่วน (response time, workload) คำนวณจาก action ที่เกิดใน session นี้เท่านั้น ไม่ใช่ประวัติจริง
- ชื่อผู้ป่วยเป็นข้อมูล mock คงที่
- โหมด Presentation ใช้ CSS `zoom` เพื่อขยายขนาดตัวอักษร/ส่วนประกอบ ซึ่งรองรับดีที่สุดในเบราว์เซอร์ตระกูล Chromium (เช่น Chrome/Edge) ตามที่คาดว่าจอ kiosk ส่วนใหญ่จะใช้

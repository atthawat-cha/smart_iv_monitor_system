# Smart IV Monitoring System (SMIS)

ระบบติดตามสารน้ำ (IV Fluid) อัจฉริยะ ช่วยให้บุคลากรทางการแพทย์รับรู้ปริมาณสารน้ำคงเหลือของแต่ละขวด/ถุงแบบ Real-Time ผ่านเซนเซอร์ IoT พร้อมระบบแจ้งเตือนล่วงหน้า เพื่อให้สามารถจัดการเปลี่ยนสารน้ำได้ทันก่อนที่จะหมด ลดความเสี่ยงต่อผู้ป่วยและภาระงานของพยาบาล

โฟลเดอร์นี้เป็น Obsidian vault ที่รวบรวมเอกสารทั้งหมดของโปรเจกต์ SMIS ตั้งแต่ pitch, requirement, architecture, database, API, UX/UI ไปจนถึงแผนพัฒนาและ test spec

## โครงสร้างไฟล์

| โฟลเดอร์ | เนื้อหา |
|---|---|
| `000-Project-Code/` | ซอร์สโค้ดของระบบ (โครง `smis/` เตรียมไว้ ยังไม่มีโค้ดจริง) |
| `009 Pre-Pitch Preparation/` | เตรียมข้อมูลสำหรับ pitch — Pitch Preparation, สรุปสำหรับ NotebookLM |
| `010 Content/` | เนื้อหา/ที่มาของไอเดียโปรเจกต์ (เชื่อมโยงกับ ADT-RAISE Batch 2 Overview) |
| `011 User Stories/` | User Stories และ User Journey (เช่น Critical IV Alert Response) |
| `012 Project Require Document/` | เอกสาร PRD หลายเวอร์ชัน, Feature List, Root Cause Analysis |
| `013 AI Skills/` | เอกสารสำหรับตั้งค่า Claude/Agent skill ของโปรเจกต์ (Agent-Skill, Claude.md, Design.md) |
| `013 Architecture/` | System, Application, Deployment, Hardware & Firmware, IoT Architecture |
| `014 Database/` | Database Schema |
| `015 Diagram/` | ER Diagram |
| `016 IoT/` | ภาพรวมด้าน IoT (เซนเซอร์, การเชื่อมต่ออุปกรณ์) |
| `017 API/` | API Specification |
| `018 UXUI/` | Prototype Index, UX/UI Design System, Wireframe/Screen List, ไฟล์ canvas/HTML mockup |
| `019 Development Plan/` | Development Plan, Phase Plan, Product Backlog, Sprint List (Phase 3) |
| `020 Testing/` | Testing Plan, Test Spec (Priority Queue & Critical Alert) |
| `021 MVP Scope/` | MVP Scope Checklist |
| `022 Detailed Design/` | Detailed Design |
| `Notebook LM.md` | สรุปโปรเจกต์สำหรับการนำเสนอ 4 นาที |
| `LICENSE` | MIT License |

## เอกสารสำคัญที่ควรเริ่มอ่าน

1. [Master PRD](<012 Project Require Document/Master PRD.md>) และ [Project Requirement Document (PRD) v2.1](<012 Project Require Document/Project Requirement Document (PRD) v2.1.md>)
2. [System Architecture](<013 Architecture/System Architecture.md>)
3. [Database Schema](<014 Database/Database.md>) และ [ER Diagram](<015 Diagram/ER-Diagram.md>)
4. [API Specification](<017 API/API.md>)
5. [UX/UI Design System & Flow](<018 UXUI/UX-UI Design.md>)
6. [Development Plan](<019 Development Plan/Development Plan.md>) และ [Product Backlog](<019 Development Plan/Product Backlog.md>)
7. [MVP Scope Checklist](<021 MVP Scope/MVP Scope Checklist.md>)

## License

MIT — ดูรายละเอียดที่ [LICENSE](LICENSE)

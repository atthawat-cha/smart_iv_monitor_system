import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, renderWards } from "./app.js";

// ข้อมูลตัวอย่างอิง schema จริง (Ward: name/floor, Bed: status Critical/Warning/Normal/Offline)
// ตาม SCOPE.md — หัวข้อ BL-201 (Ward CRUD)
const sampleWards = [
  { name: "ICU A", wardType: "ICU", floor: "4A", totalBeds: 8, criticalBeds: 2, warningBeds: 1, normalBeds: 5, offlineBeds: 0, note: "", createdBy: "system_admin" },
  { name: "ICU B", wardType: "ICU", floor: "4B", totalBeds: 8, criticalBeds: 1, warningBeds: 2, normalBeds: 5, offlineBeds: 0, note: "", createdBy: "system_admin" },
  { name: "Ward 10A", wardType: "Medical Ward", floor: "10", totalBeds: 20, criticalBeds: 0, warningBeds: 3, normalBeds: 16, offlineBeds: 1, note: "", createdBy: "system_admin" },
  { name: "Emergency Ward", wardType: "Emergency", floor: "1", totalBeds: 12, criticalBeds: 4, warningBeds: 2, normalBeds: 6, offlineBeds: 0, note: "อยู่ระหว่างปรับปรุงระบบไฟฟ้าสำรอง", createdBy: "system_admin" },
  { name: "Surgical Ward", wardType: "Surgical", floor: "6", totalBeds: 15, criticalBeds: 1, warningBeds: 1, normalBeds: 13, offlineBeds: 0, note: "", createdBy: "system_admin" },
];

async function seed() {
  const statusEl = document.getElementById("status");
  try {
    const existing = await getDocs(collection(db, "wards"));
    if (!existing.empty) {
      statusEl.textContent = `มีข้อมูลอยู่แล้ว ${existing.size} รายการ — ไม่ seed ซ้ำ`;
      return;
    }

    statusEl.textContent = "กำลัง seed ข้อมูลตัวอย่าง...";
    for (const ward of sampleWards) {
      await addDoc(collection(db, "wards"), ward);
    }
    statusEl.textContent = `Seed สำเร็จ ${sampleWards.length} ward`;
    await renderWards();
  } catch (err) {
    statusEl.textContent = `เกิดข้อผิดพลาด: ${err.message}`;
    console.error(err);
  }
}

document.getElementById("seed-btn").addEventListener("click", seed);

import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

// ข้อมูลตัวอย่าง เฉพาะ admin เท่านั้นที่ seed ได้ (rule เดียวกับ create ward ปกติ)
// ต่างจาก week6 ตรงที่ต้อง createdBy = uid ของแอดมินที่กด seed จริง ๆ เพราะ rule บังคับ
export function sampleWards(adminUid) {
  return [
    { name: "ICU A", wardType: "ICU", floor: "4A", totalBeds: 8, note: "", status: "Normal", createdBy: adminUid, createdAt: Date.now() },
    { name: "ICU B", wardType: "ICU", floor: "4B", totalBeds: 8, note: "", status: "Warning", createdBy: adminUid, createdAt: Date.now() },
    { name: "Ward 10A", wardType: "Medical Ward", floor: "10", totalBeds: 20, note: "", status: "Normal", createdBy: adminUid, createdAt: Date.now() },
    { name: "Emergency Ward", wardType: "Emergency", floor: "1", totalBeds: 12, note: "อยู่ระหว่างปรับปรุงระบบไฟฟ้าสำรอง", status: "Critical", createdBy: adminUid, createdAt: Date.now() },
    { name: "Surgical Ward", wardType: "Surgical", floor: "6", totalBeds: 15, note: "", status: "Normal", createdBy: adminUid, createdAt: Date.now() },
  ];
}

export async function seedWards(adminUid) {
  const existing = await getDocs(collection(db, "wards"));
  if (!existing.empty) {
    return { skipped: true, count: existing.size };
  }
  const wards = sampleWards(adminUid);
  for (const ward of wards) {
    await addDoc(collection(db, "wards"), ward);
  }
  return { skipped: false, count: wards.length };
}

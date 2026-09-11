import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

export const STATUSES = ["Normal", "Warning", "Critical", "Offline"];

// Create — สถานะเริ่มต้นเป็น "Normal" เสมอ ฟิลด์อื่นมาจากฟอร์ม
export async function createWard({ name, wardType, floor, totalBeds, note }, uid) {
  await addDoc(collection(db, "wards"), {
    name,
    wardType,
    floor,
    totalBeds: Number(totalBeds),
    note: note || "",
    status: "Normal",
    createdBy: uid,
    createdAt: Date.now(),
  });
}

// Update — แก้ได้เฉพาะ status ฟิลด์เดียว (rule ฝั่ง Firestore บังคับซ้ำอีกชั้น)
export async function updateWardStatus(wardId, status) {
  await updateDoc(doc(db, "wards", wardId), { status });
}

export async function deleteWard(wardId) {
  await deleteDoc(doc(db, "wards", wardId));
}

export async function listWards() {
  const q = query(collection(db, "wards"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

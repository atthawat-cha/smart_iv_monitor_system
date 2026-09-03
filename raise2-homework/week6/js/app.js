import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { initializeFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
// experimentalAutoDetectLongPolling: บาง network/proxy บล็อก WebChannel streaming (เห็น 503 วนซ้ำบน /Listen/channel)
// จึงให้ SDK สลับไปใช้ long-polling แทนอัตโนมัติ
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

export async function renderWards() {
  const listEl = document.getElementById("ward-list");
  const statusEl = document.getElementById("status");
  listEl.innerHTML = "";
  statusEl.textContent = "กำลังโหลด...";

  let snapshot;
  try {
    const q = query(collection(db, "wards"), orderBy("name"));
    snapshot = await getDocs(q);
  } catch (err) {
    statusEl.textContent = `เกิดข้อผิดพลาด: ${err.message}`;
    console.error(err);
    return;
  }

  if (snapshot.empty) {
    statusEl.textContent = "ยังไม่มีข้อมูล ward — กด \"Seed Sample Wards\" ก่อน";
    return;
  }

  snapshot.forEach((doc) => {
    const w = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${w.name}</strong> (${w.wardType}, ชั้น ${w.floor}) — `
      + `Total: ${w.totalBeds} · Critical: ${w.criticalBeds} · Warning: ${w.warningBeds} · `
      + `Normal: ${w.normalBeds} · Offline: ${w.offlineBeds}`
      + (w.note ? `<br><em>หมายเหตุ: ${w.note}</em>` : "");
    listEl.appendChild(li);
  });

  statusEl.textContent = `พบทั้งหมด ${snapshot.size} ward`;
}

document.getElementById("refresh-btn").addEventListener("click", renderWards);
renderWards();

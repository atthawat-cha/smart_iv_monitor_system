import { signup, login, logout, watchAuth, describeAuthError } from "./auth.js";
import { STATUSES, createWard, updateWardStatus, deleteWard, listWards } from "./wards.js";
import { seedWards } from "./seed.js";

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const sessionEl = document.getElementById("session");
const statusEl = document.getElementById("status");
const whoamiEl = document.getElementById("whoami");
const roleBadgeEl = document.getElementById("role-badge");
const wardListEl = document.getElementById("ward-list");
const createFormEl = document.getElementById("create-form");
const adminControls = document.querySelectorAll(".admin-only");

let currentUser = null;
let currentRole = null;
let justUpdatedWardId = null;

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("status-line--error", isError);
}

function applyRoleVisibility() {
  const isAdmin = currentRole === "admin";
  adminControls.forEach((el) => {
    el.hidden = !isAdmin;
  });
}

async function refreshWardList() {
  wardListEl.innerHTML = "";
  let wards;
  try {
    wards = await listWards();
  } catch (err) {
    setStatus(`เกิดข้อผิดพลาด: ${err.message}`, true);
    console.error(err);
    return;
  }

  if (wards.length === 0) {
    setStatus('ยังไม่มีข้อมูล ward — ถ้าเป็น admin กด "Seed Sample Wards" ได้');
    return;
  }

  wards.forEach((w) => {
    const li = document.createElement("li");
    // ward เก่าจาก week6 (schema คนละแบบ ไม่มี field status) อาจปนอยู่ใน collection เดียวกัน
    // ถ้าไม่มี status ที่รู้จัก ให้ถือว่า Offline ไปก่อน กันไม่ให้ทั้งหน้าพัง
    const status = STATUSES.includes(w.status) ? w.status : "Offline";
    const isOwnWard = currentRole === "admin" && w.createdBy === currentUser.uid;
    li.className = `ward-card status-${status.toLowerCase()}`;

    li.innerHTML = `
      <div class="ward-card-top">
        <span class="status-dot" aria-hidden="true"></span>
        <div>
          <h3 class="ward-name">${w.name}</h3>
          <p class="ward-meta">${w.wardType}, ชั้น ${w.floor}</p>
        </div>
      </div>
      <p class="ward-metric"><span class="metric-value">${w.totalBeds}</span> เตียงทั้งหมด</p>
      <p class="ward-status-label">สถานะปัจจุบัน: <strong>${status}</strong></p>
      ${w.note ? `<p class="ward-note">${w.note}</p>` : ""}
    `;

    if (currentRole === "admin") {
      const actions = document.createElement("div");
      actions.className = "ward-actions";

      const select = document.createElement("select");
      STATUSES.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        if (s === status) opt.selected = true;
        select.appendChild(opt);
      });

      const updateBtn = document.createElement("button");
      updateBtn.className = "btn btn-ghost";
      updateBtn.textContent = "Update status";
      updateBtn.disabled = isOwnWard;
      updateBtn.title = isOwnWard
        ? "แอดมินที่สร้าง ward นี้เปลี่ยนสถานะ ward ของตัวเองไม่ได้ ให้แอดมินคนอื่นเปลี่ยนแทน"
        : "";
      updateBtn.addEventListener("click", async () => {
        try {
          await updateWardStatus(w.id, select.value);
          setStatus(`อัปเดตสถานะ ${w.name} เป็น ${select.value} แล้ว`);
          justUpdatedWardId = w.id;
          await refreshWardList();
        } catch (err) {
          setStatus(`เกิดข้อผิดพลาด: ${err.message}`, true);
          console.error(err);
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm(`ยืนยันลบ ward "${w.name}" ? การลบนี้ย้อนกลับไม่ได้`)) return;
        try {
          await deleteWard(w.id);
          setStatus(`ลบ ${w.name} แล้ว`);
          await refreshWardList();
        } catch (err) {
          setStatus(`เกิดข้อผิดพลาด: ${err.message}`, true);
          console.error(err);
        }
      });

      actions.appendChild(select);
      actions.appendChild(updateBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(actions);

      if (isOwnWard) {
        const hint = document.createElement("p");
        hint.className = "ward-hint";
        hint.textContent = "สร้างโดยคุณเอง — เปลี่ยนสถานะเองไม่ได้";
        li.appendChild(hint);
      }
    }

    if (w.id === justUpdatedWardId) {
      li.classList.add("just-updated");
    }

    wardListEl.appendChild(li);
  });

  justUpdatedWardId = null;
  setStatus(`พบทั้งหมด ${wards.length} ward`);
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  try {
    await signup(email, password);
  } catch (err) {
    setStatus(`สมัครไม่สำเร็จ: ${describeAuthError(err)}`, true);
    console.error(err);
  }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await login(email, password);
  } catch (err) {
    setStatus(`ล็อกอินไม่สำเร็จ: ${describeAuthError(err)}`, true);
    console.error(err);
  }
});

document.getElementById("logout-btn").addEventListener("click", () => logout());

createFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("ward-name").value;
  const wardType = document.getElementById("ward-type").value;
  const floor = document.getElementById("ward-floor").value;
  const totalBeds = document.getElementById("ward-beds").value;
  const note = document.getElementById("ward-note").value;

  try {
    await createWard({ name, wardType, floor, totalBeds, note }, currentUser.uid);
    createFormEl.reset();
    setStatus(`สร้าง ward "${name}" แล้ว`);
    await refreshWardList();
  } catch (err) {
    setStatus(`เกิดข้อผิดพลาด: ${err.message}`, true);
    console.error(err);
  }
});

document.getElementById("seed-btn").addEventListener("click", async () => {
  try {
    const result = await seedWards(currentUser.uid);
    setStatus(result.skipped
      ? `มีข้อมูลอยู่แล้ว ${result.count} รายการ — ไม่ seed ซ้ำ`
      : `Seed สำเร็จ ${result.count} ward`);
    await refreshWardList();
  } catch (err) {
    setStatus(`เกิดข้อผิดพลาด: ${err.message}`, true);
    console.error(err);
  }
});

document.getElementById("refresh-btn").addEventListener("click", refreshWardList);

watchAuth((user, role) => {
  currentUser = user;
  currentRole = role;

  if (!user) {
    authSection.hidden = false;
    appSection.hidden = true;
    sessionEl.hidden = true;
    setStatus("กรุณาล็อกอินก่อนใช้งาน");
    return;
  }

  authSection.hidden = true;
  appSection.hidden = false;
  sessionEl.hidden = false;
  whoamiEl.textContent = user.email;
  roleBadgeEl.textContent = role;
  applyRoleVisibility();
  refreshWardList();
});

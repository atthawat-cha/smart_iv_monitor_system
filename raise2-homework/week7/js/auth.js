import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// สร้าง users/{uid} เมื่อ signup ครั้งแรก — role เริ่มต้นเป็น "staff" เสมอ
// (เปลี่ยนเป็น "admin" ต้องไปแก้เองใน Firebase Console เท่านั้น ดู ACL.md)
async function ensureUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email: user.email, role: "staff", createdAt: Date.now() });
  }
}

const AUTH_ERROR_MESSAGES = {
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-not-found": "ไม่พบบัญชีนี้ — ลองสมัครใหม่ก่อน",
  "auth/wrong-password": "รหัสผ่านไม่ถูกต้อง",
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/user-disabled": "บัญชีนี้ถูกระงับการใช้งาน",
  "auth/email-already-in-use": "อีเมลนี้มีบัญชีอยู่แล้ว — ลองล็อกอินแทน",
  "auth/weak-password": "รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร",
  "auth/too-many-requests": "ลองผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่",
  "auth/network-request-failed": "เชื่อมต่อเครือข่ายไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่",
};

// แปล error code ของ Firebase Auth เป็นข้อความไทยที่อ่านเข้าใจง่าย
// ถ้าไม่รู้จัก code นี้ ให้ fallback ไปโชว์ err.message ดิบแทน (ยังดีกว่าไม่โชว์อะไรเลย)
export function describeAuthError(err) {
  return AUTH_ERROR_MESSAGES[err.code] || err.message;
}

export async function signup(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(cred.user);
  return cred.user;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

export async function getCurrentRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : "staff";
}

// เรียก callback(user, role) ทุกครั้งที่สถานะล็อกอินเปลี่ยน — user เป็น null เมื่อยังไม่ล็อกอิน
export function watchAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }
    const role = await getCurrentRole(user.uid);
    callback(user, role);
  });
}

// 1) ใช้โปรเจกต์ Firebase เดิมจาก week6 ต่อได้เลย (หรือสร้างใหม่ก็ได้)
// 2) เปิด Authentication > Sign-in method > Email/Password (Enable)
// 3) Firestore Database ต้องเปิดอยู่แล้วจาก week6
// 4) Project Settings > Your apps > Web app > คัดลอกค่า config มาวางแทนด้านล่าง
// 5) copy ไฟล์นี้เป็น firebase-config.js (ไฟล์นั้นถูก .gitignore ไว้ไม่ให้หลุด key ขึ้น repo)

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

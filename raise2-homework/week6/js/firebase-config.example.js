// 1) ไปที่ Firebase Console > สร้างโปรเจกต์ใหม่ เช่น "smis-<ชื่อคุณ>"
// 2) เปิด Firestore Database ในโหมด Test mode, location: asia-southeast1
// 3) Project Settings > Your apps > Web app > คัดลอกค่า config มาวางแทนด้านล่าง
// 4) copy ไฟล์นี้เป็น firebase-config.js (ไฟล์นั้นถูก .gitignore ไว้ไม่ให้หลุด key ขึ้น repo)

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

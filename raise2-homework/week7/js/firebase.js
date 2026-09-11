import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

// experimentalAutoDetectLongPolling: บาง network/proxy บล็อก WebChannel streaming (เห็น 503 วนซ้ำบน /Listen/channel)
// จึงให้ SDK สลับไปใช้ long-polling แทนอัตโนมัติ (ยกมาจาก week6)
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
export const auth = getAuth(app);

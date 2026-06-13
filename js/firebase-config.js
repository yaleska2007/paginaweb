import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSDHg0VIb4EMfIwdToFPg6lFm4q2LUbU4",
  authDomain: "angelesnails2007-9c995.firebaseapp.com",
  projectId: "angelesnails2007-9c995",
  storageBucket: "angelesnails2007-9c995.firebasestorage.app",
  messagingSenderId: "860423923384",
  appId: "1:860423923384:web:caa807ab5094370e1a764d"
};

// Inicializar la App de Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios unificados en la versión 10.8.0
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
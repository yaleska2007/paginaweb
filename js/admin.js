import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, updateDoc,
  onSnapshot, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ── Configuración Inicial ──────────────────────────────────
const CLOUD_NAME = "dspfnujtv";
const UPLOAD_PRESET = "angelesnails_upload";
const tiempoCargaInicial = Date.now();

// ── Auth guard ────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (!user) window.location = "login.html";
});

// ── Notificaciones y Escuchadores en Tiempo Real ──────────
function initLiveListeners() {
  // Escuchar Citas (Asegúrate de que la colección sea 'appointments')
  onSnapshot(collection(db, "appointments"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        const created = data.creadoEn?.toMillis ? data.creadoEn.toMillis() : Date.now();
        if (created > tiempoCargaInicial) {
          mostrarAlerta("✨ Nueva Cita", `${data.name} quiere reservar: ${data.service}`);
          loadAppointments();
        }
      }
    });
  });

  // Escuchar Reseñas (Asegúrate de que la colección sea 'reviews')
  onSnapshot(collection(db, "reviews"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        const created = data.creadoEn?.toMillis ? data.creadoEn.toMillis() : Date.now();
        if (created > tiempoCargaInicial) {
          mostrarAlerta("⭐ Nueva Reseña", `${data.name} dice: ${data.comment}`);
          loadReviewsAdmin();
        }
      }
    });
  });
}

function mostrarAlerta(titulo, mensaje) {
  if (Notification.permission === "granted") {
    new Notification(titulo, { body: mensaje });
  } else {
    alert(`${titulo}: ${mensaje}`);
  }
}

// ── Funciones de Carga (Resumidas para brevedad) ──────────
async function loadAppointments() {
  const list = document.getElementById("appointments-list");
  if (!list) return;
  list.innerHTML = "";
  const snap = await getDocs(collection(db, "appointments"));
  snap.forEach(docSnap => {
    const a = docSnap.data();
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `<h3>${a.name}</h3><p>${a.service}</p><button class="confirm-btn">Confirmar</button>`;
    list.appendChild(div);
  });
}

async function loadReviewsAdmin() {
  const list = document.getElementById("reviews-list");
  if (!list) return;
  list.innerHTML = "";
  const snap = await getDocs(collection(db, "reviews"));
  snap.forEach(docSnap => {
    const r = docSnap.data();
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `<h3>${r.name}</h3><p>${r.comment}</p>`;
    list.appendChild(div);
  });
}

// ── Logout ────────────────────────────────────────────────
document.getElementById("btn-logout")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location = "login.html";
});

// ── Init Global ───────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "denied") Notification.requestPermission();
  
  // Carga inicial
  loadAppointments();
  loadReviewsAdmin();
  
  // Activar escuchadores
  initLiveListeners();
});
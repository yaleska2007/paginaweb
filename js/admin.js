import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  doc, getDoc, setDoc, collection,
  addDoc, getDocs, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const CLOUD_NAME = "dspfnujtv";
const UPLOAD_PRESET = "angelesnails_upload";

// ── Auth guard ────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (!user) window.location = "login.html";
});

// ── Cloudinary upload ─────────────────────────────────────
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
}

// ── Menú lateral ──────────────────────────────────────────
document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
    item.classList.add("active");
    document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active-section"));
    const section = document.getElementById(item.dataset.section + "-section");
    if (section) section.classList.add("active-section");
  });
});

// ── GALERÍA ───────────────────────────────────────────────
const uploadInput = document.getElementById("gallery-upload");
const uploadBtn   = document.getElementById("upload-btn");
const preview     = document.getElementById("gallery-preview");

uploadBtn?.addEventListener("click", () => uploadInput.click());

uploadInput?.addEventListener("change", async (e) => {
  for (const file of e.target.files) {
    const url = await uploadImage(file);
    await addDoc(collection(db, "gallery"), { url, createdAt: Date.now() });
  }
  loadGallery();
});

async function loadGallery() {
  if (!preview) return;
  preview.innerHTML = "";
  try {
    const snap = await getDocs(collection(db, "gallery"));
    snap.forEach(docSnap => {
      const { url } = docSnap.data();
      const container = document.createElement("div");
      container.classList.add("gallery-item");
      container.innerHTML = `
        <img src="${url}" alt="imagen">
        <button class="delete-btn">✕</button>
      `;
      container.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, "gallery", docSnap.id));
        loadGallery();
      });
      preview.appendChild(container);
    });
  } catch (error) {
    console.error("Error cargando galería:", error);
  }
  updateDashboard();
}

// ── SERVICIOS ─────────────────────────────────────────────
const saveServiceBtn = document.getElementById("save-service");
const servicesList   = document.getElementById("services-list");

saveServiceBtn?.addEventListener("click", async () => {
  const name        = document.getElementById("service-name").value;
  const description = document.getElementById("service-description").value;
  const price       = document.getElementById("service-price").value;
  const file        = document.getElementById("service-image").files[0];

  if (!name || !price) { alert("Completa los campos"); return; }
  if (!file)           { alert("Selecciona una imagen"); return; }

  const image = await uploadImage(file);
  await addDoc(collection(db, "services"), { name, description, price, image });

  document.getElementById("service-name").value        = "";
  document.getElementById("service-description").value = "";
  document.getElementById("service-price").value       = "";
  document.getElementById("service-image").value       = "";

  loadServices();
});

async function loadServices() {
  if (!servicesList) return;
  servicesList.innerHTML = "";
  try {
    const snap = await getDocs(collection(db, "services"));
    snap.forEach(docSnap => {
      const s = docSnap.data();
      const card = document.createElement("div");
      card.classList.add("service-card");
      card.innerHTML = `
        <img src="${s.image}" class="service-image">
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <strong>$${s.price}</strong><br><br>
        <button class="delete-srv">Eliminar</button>
      `;
      card.querySelector(".delete-srv").addEventListener("click", async () => {
        await deleteDoc(doc(db, "services", docSnap.id));
        loadServices();
      });
      servicesList.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando servicios:", error);
  }
  updateDashboard();
}

// ── REDES SOCIALES ────────────────────────────────────────
const saveSocialBtn = document.getElementById("save-social");

async function loadSocialData() {
  try {
    const snap = await getDoc(doc(db, "config", "social"));
    if (snap.exists()) {
      const d = snap.data();
      if(document.getElementById("whatsapp")) document.getElementById("whatsapp").value  = d.whatsapp  || "";
      if(document.getElementById("instagram")) document.getElementById("instagram").value = d.instagram || "";
      if(document.getElementById("tiktok")) document.getElementById("tiktok").value    = d.tiktok    || "";
    }
  } catch (error) {
    console.error("Error cargando redes:", error);
  }
}

saveSocialBtn?.addEventListener("click", async () => {
  await setDoc(doc(db, "config", "social"), {
    whatsapp:  document.getElementById("whatsapp").value,
    instagram: document.getElementById("instagram").value,
    tiktok:    document.getElementById("tiktok").value,
  });
  alert("Redes guardadas ✅");
});

// ── CONFIGURACIÓN ─────────────────────────────────────────
const saveSettingsBtn = document.getElementById("save-settings");

async function loadSettings() {
  try {
    const snap = await getDoc(doc(db, "config", "settings"));
    if (snap.exists()) {
      const d = snap.data();
      if(document.getElementById("business-map-url")) document.getElementById("business-map-url").value  = d.mapUrl   || "";
      if(document.getElementById("business-name")) document.getElementById("business-name").value     = d.name     || "";
      if(document.getElementById("business-address")) document.getElementById("business-address").value  = d.address  || "";
      if(document.getElementById("business-schedule")) document.getElementById("business-schedule").value = d.schedule || "";
      if (d.logo && document.getElementById("logo-preview")) {
        document.getElementById("logo-preview").innerHTML =
          `<img src="${d.logo}" style="width:150px;margin-top:20px;border-radius:12px;">`;
      }
    }
  } catch (error) {
    console.error("Error cargando configuración:", error);
  }
}

saveSettingsBtn?.addEventListener("click", async () => {
  const file = document.getElementById("business-logo").files[0];
  const old  = (await getDoc(doc(db, "config", "settings"))).data() || {};
  const logo = file ? await uploadImage(file) : (old.logo || "");

  await setDoc(doc(db, "config", "settings"), {
    mapUrl:   document.getElementById("business-map-url").value,
    name:     document.getElementById("business-name").value,
    address:  document.getElementById("business-address").value,
    schedule: document.getElementById("business-schedule").value,
    logo
  });

  loadSettings();
  alert("Configuración guardada ✅");
});

// ── CITAS (MUESTRA EL TEXTO MANUAL DEL CLIENTE) ───────────
const appointmentsList = document.getElementById("appointments-list");

async function loadAppointments() {
  if (!appointmentsList) return;
  appointmentsList.innerHTML = "";
  
  try {
    const snap = await getDocs(collection(db, "appointments"));

    if (snap.empty) {
      appointmentsList.innerHTML = "<p>No hay citas registradas.</p>";
      updateDashboard();
      return;
    }

    snap.forEach(docSnap => {
      const a = docSnap.data();
      const card = document.createElement("div");
      card.classList.add("service-card");
      
      // ${a.service} renderiza directamente la cadena de texto manual guardada por el cliente
      card.innerHTML = `
        <h3>${a.name}</h3>
        <p><strong>WhatsApp:</strong> ${a.phone}</p>
        <p><strong>Servicio:</strong> ${a.service}</p> 
        <p><strong>Fecha:</strong> ${a.date}</p>
        <p><strong>Mensaje:</strong> ${a.message || ""}</p>
        <p><strong>Estado:</strong> ${a.status}</p>
        <button class="confirm-btn">Confirmar</button>
        <button class="delete-btn-apt">Eliminar</button>
      `;

      card.querySelector(".confirm-btn").addEventListener("click", async () => {
        await updateDoc(doc(db, "appointments", docSnap.id), { status: "Confirmada" });
        const mensaje = `Hola ${a.name}, 😊\n\nTu cita para ${a.service} ha sido CONFIRMADA. 💅\n\n📅 Fecha: ${a.date}\n\nTe esperamos. Gracias por confiar en ANGELESNAILS2007 🌸`;
        window.open(`https://wa.me/57${a.phone}?text=${encodeURIComponent(mensaje)}`, "_blank");
        loadAppointments();
      });

      card.querySelector(".delete-btn-apt").addEventListener("click", async () => {
        await deleteDoc(doc(db, "appointments", docSnap.id));
        loadAppointments();
      });

      appointmentsList.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando citas:", error);
  }
  updateDashboard();
}

// ── RESEÑAS ADMIN ─────────────────────────────────────────
const reviewsList = document.getElementById("reviews-list");

async function loadReviewsAdmin() {
  if (!reviewsList) return;
  reviewsList.innerHTML = "";
  try {
    const snap = await getDocs(collection(db, "reviews"));
    snap.forEach(docSnap => {
      const r = docSnap.data();
      const card = document.createElement("div");
      card.classList.add("service-card");
      card.innerHTML = `
        <h3>${r.name}</h3>
        <p>⭐ ${r.stars}/5</p>
        <p><strong>Servicio:</strong> ${r.service}</p>
        <p>${r.comment}</p>
        <p>${r.date}</p>
        <p>Estado: ${r.approved ? "✅ Aprobada" : "⏳ Pendiente"}</p>
        ${!r.approved ? `<button class="approve-btn">Aprobar</button>` : ""}
        <button class="delete-rv">Eliminar</button>
      `;
      if (!r.approved) {
        card.querySelector(".approve-btn").addEventListener("click", async () => {
          await updateDoc(doc(db, "reviews", docSnap.id), { approved: true });
          loadReviewsAdmin();
        });
      }
      card.querySelector(".delete-rv").addEventListener("click", async () => {
        await deleteDoc(doc(db, "reviews", docSnap.id));
        loadReviewsAdmin();
      });
      reviewsList.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando reseñas en admin:", error);
  }
  updateDashboard();
}

// ── DASHBOARD ─────────────────────────────────────────────
async function updateDashboard() {
  try {
    const [gallery, services, appointments, reviews] = await Promise.all([
      getDocs(collection(db, "gallery")),
      getDocs(collection(db, "services")),
      getDocs(collection(db, "appointments")),
      getDocs(collection(db, "reviews")),
    ]);

    const galleryCountElem = document.getElementById("gallery-count");
    const servicesCountElem = document.getElementById("services-count");
    const appointmentsCountElem = document.getElementById("appointments-count");
    const reviewsCountElem = document.getElementById("reviews-count");

    if (galleryCountElem) galleryCountElem.textContent = gallery.size;
    if (servicesCountElem) servicesCountElem.textContent = services.size;
    if (appointmentsCountElem) appointmentsCountElem.textContent = appointments.size;
    if (reviewsCountElem) reviewsCountElem.textContent = reviews.size;
  } catch (error) {
    console.error("Error actualizando el dashboard:", error);
  }
}

// ── Logout ─────────────────────────────────────────────────
window.logout = async () => {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js");
  await signOut(auth);
  window.location = "login.html";
};

// ── Init ──────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  loadServices();
  loadSocialData();
  loadSettings();
  loadAppointments();
  loadReviewsAdmin();
});

// Registrar service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(err => console.error("SW err:", err));
}








// =========================================================================
// CONFIGURACIÓN DE NOTIFICACIONES PUSH (FIREBASE MESSAGING)
// =========================================================================
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const messaging = getMessaging();
const db = getFirestore();

function activarNotificacionesAdministrador() {
  // Solicitar permiso en el celular o PC
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permiso de notificaciones concedido.');

      // Obtener el Token usando tu clave pública de Firebase
      getToken(messaging, { vapidKey: 'BDeentbXItElajHvOcO4UDAOvpqibO7Kver65O4Wym2sGHpQSkyptKdgyuzMcQmVQttlXW2FsLivHSOZclWmtg' })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Token obtenido con éxito.");
            
            // Guardar el token en Firestore en la colección "admin_tokens"
            setDoc(doc(db, "admin_tokens", "dispositivo_admin"), {
              token: currentToken,
              actualizado: new Date().toISOString(),
              usuario: "Administrador / Yaleska"
            }).then(() => {
              console.log("Token registrado en la base de datos.");
            });

          } else {
            console.log('No se pudo generar el token.');
          }
        }).catch((err) => {
          console.error('Error al obtener token VAPID: ', err);
        });
    } else {
      console.warn('Permiso de notificaciones denegado.');
    }
  });
}

// Ejecutar la solicitud automáticamente al cargar el panel
window.addEventListener('load', () => {
  activarNotificacionesAdministrador();
});
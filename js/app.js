// ── 1. IMPORTACIONES DIRECTAS DE FIREBASE ─────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, getDocs, addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── 2. CONFIGURACIÓN DE TU PROYECTO ───────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDSDHg0VIb4EMfIwdToFPg6lFm4q2LUbU4",
  authDomain: "angelesnails2007-9c995.firebaseapp.com",
  projectId: "angelesnails2007-9c995",
  storageBucket: "angelesnails2007-9c995.firebasestorage.app",
  messagingSenderId: "860423923384",
  appId: "1:860423923384:web:caa807ab5094370e1a764d"
};

// Inicializar Firebase y Base de Datos en un solo lugar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── 3. VARIABLES GLOBALES ────────────────────────────────────
let selectedStars = 0;
const STAR_LABELS = ["", "Malo 😞", "Regular 😐", "Bueno 😊", "Muy bueno 😍", "¡Excelente! 🌟"];

// ── 4. NAVEGACIÓN SPA (Single Page Application) ──────────────
function switchView(id) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
  });
  
  const target = document.getElementById("view-" + id);
  if (target) { 
    target.classList.add("active"); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }
  
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });
  
  if (id === "galeria") buildGallery();
  if (id === "resenas") buildReviews();
}

// ── 5. GALERÍA ───────────────────────────────────────────────
async function buildGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid || grid.children.length) return; 
  
  try {
    const snap = await getDocs(collection(db, "gallery"));
    if (snap.empty) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--c-muted);font-style:italic;">Próximamente 🌸</div>`;
      return;
    }
    grid.innerHTML = "";
    snap.forEach(docSnap => {
      const { url } = docSnap.data();
      const div = document.createElement("div");
      div.className = "g-item";
      div.innerHTML = `<img src="${url}" alt="Nail art" loading="lazy"/><div class="g-overlay"><span>Ver</span></div>`;
      div.addEventListener("click", () => openLightbox(url, "Nail art"));
      grid.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar galería:", error);
  }
}

// ── 6. LIGHTBOX ──────────────────────────────────────────────
function openLightbox(src, alt) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox-img").alt = alt;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
document.getElementById("lightbox")?.addEventListener("click", e => { 
  if (e.target === e.currentTarget) closeLightbox(); 
});

// ── 7. SERVICIOS ─────────────────────────────────────────────
async function loadServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  
  try {
    const snap = await getDocs(collection(db, "services"));
    if (snap.empty) {
      grid.innerHTML = `<p style="color:var(--c-muted);font-style:italic;">Próximamente 🌸</p>`;
      return;
    }
    grid.innerHTML = "";
    snap.forEach(docSnap => {
      const s = docSnap.data();
      const card = document.createElement("div");
      card.classList.add("srv-card");
      card.innerHTML = `
        <div class="srv-img"><img src="${s.image}" alt="${s.name}"></div>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <span class="srv-price">$${s.price}</span>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }
}

// ── 8. REDES SOCIALES ────────────────────────────────────────
async function loadSocialLinks() {
  try {
    const snap = await getDoc(doc(db, "config", "social"));
    if (!snap.exists()) return;
    const d = snap.data();
    const whatsapp = d.whatsapp || "";
    const whatsappUrl = `https://wa.me/${whatsapp}?text=Hola,%20quiero%20agendar%20una%20cita`;

    document.getElementById("nav-whatsapp")   && (document.getElementById("nav-whatsapp").href   = whatsappUrl);
    document.getElementById("float-whatsapp") && (document.getElementById("float-whatsapp").href = whatsappUrl);
    document.getElementById("instagram-link") && (document.getElementById("instagram-link").href = d.instagram || "#");
    document.getElementById("tiktok-link")    && (document.getElementById("tiktok-link").href    = d.tiktok    || "#");
  } catch (error) {
    console.error("Error al cargar enlaces sociales:", error);
  }
}

// ── 9. CONFIGURACIÓN DEL NEGOCIO ─────────────────────────────
async function loadBusinessSettings() {
  try {
    const [settingsSnap, socialSnap] = await Promise.all([
      getDoc(doc(db, "config", "settings")),
      getDoc(doc(db, "config", "social")),
    ]);

    if (settingsSnap.exists()) {
      const d = settingsSnap.data();
      const map = document.getElementById("business-map");
      if (map && d.mapUrl) map.src = d.mapUrl;

      const address = document.getElementById("location-address");
      if (address) address.textContent = d.address || "";

      const schedule = document.getElementById("location-schedule");
      if (schedule) schedule.textContent = d.schedule || "";

      const logo = document.getElementById("business-logo-display");
      if (logo && d.logo) { logo.src = d.logo; logo.style.display = "block"; }

      const heroLogo = document.getElementById("hero-logo");
      if (heroLogo && d.logo) heroLogo.src = d.logo;

      const businessName = document.getElementById("business-name-display");
      if (businessName && d.name) {
        businessName.innerHTML = `<span class="dot">✦</span> ${d.name}`;
      }
    }

    if (socialSnap.exists()) {
      const d = socialSnap.data();
      const whatsapp = document.getElementById("location-whatsapp");
      if (whatsapp) whatsapp.textContent = d.whatsapp || "";
    }
  } catch (error) {
    console.error("Error al cargar ajustes del negocio:", error);
  }
}

// ── 10. RESEÑAS ──────────────────────────────────────────────
function starsHTML(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<i class="fa-solid fa-star${i >= n ? " empty" : ""}"></i>`
  ).join("");
}

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

async function buildReviews() {
  try {
    const snap = await getDocs(collection(db, "reviews"));
    const reviews = [];
    snap.forEach(d => { if (d.data().approved) reviews.push(d.data()); });

    buildSummary(reviews);

    const grid = document.getElementById("rv-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    if (!reviews.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--c-muted);font-style:italic;">Sé la primera en dejar tu reseña 🌸</div>`;
      return;
    }
    const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(r => {
      const card = document.createElement("div");
      card.className = "rv-card" + (r.featured ? " featured" : "");
      card.innerHTML = `
        <div class="rv-card-top">
          <div class="rv-avatar">${r.name.trim().charAt(0).toUpperCase()}</div>
          <div class="rv-card-stars">${starsHTML(r.stars)}</div>
        </div>
        <p class="rv-text">"${r.comment}"</p>
        <div class="rv-author">${r.name}<span class="rv-date">${formatDate(r.date)}</span></div>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al construir reseñas:", error);
  }
}

function buildSummary(reviews) {
  const avgEl = document.getElementById("rv-avg");
  if (!avgEl) return;

  const avg = reviews.reduce((a, r) => a + r.stars, 0) / (reviews.length || 1);
  avgEl.textContent = avg.toFixed(1);
  document.getElementById("rv-avg-stars").innerHTML = starsHTML(Math.round(avg));
  document.getElementById("rv-total-label").textContent = `${reviews.length} reseñas`;
}

// ── 11. SELECTOR DE ESTRELLAS FORMULARIO ─────────────────────
document.querySelectorAll("#star-picker button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedStars = parseInt(btn.dataset.v);
    document.querySelectorAll("#star-picker button").forEach((b, i) => {
      b.classList.toggle("lit", i < selectedStars);
    });
    document.getElementById("star-hint").textContent = STAR_LABELS[selectedStars];
  });
});

// ── 12. ENVIAR RESEÑA A FIRESTORE ────────────────────────────
document.getElementById("btn-submit-review")?.addEventListener("click", async () => {
  const name    = document.getElementById("rv-name").value.trim();
  const comment = document.getElementById("rv-comment").value.trim();
  
  if (!selectedStars || !name || !comment) return;

  try {
    const today = new Date().toISOString().split("T")[0];
    await addDoc(collection(db, "reviews"), {
      name, stars: selectedStars, comment, date: today, approved: false
    });
    alert("Reseña enviada con éxito 🌸");
  } catch (error) {
    console.error(error);
  }
});

// ── 13. INICIALIZACIÓN (DOM Content Loaded) ──────────────────
window.addEventListener("DOMContentLoaded", () => {
  // Activar botones de cambio de vista inmediatamente
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.querySelectorAll("[data-go-to]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.goTo));
  });

  // Cargar configuraciones iniciales
  loadSocialLinks();
  loadBusinessSettings();
  loadServices();
});
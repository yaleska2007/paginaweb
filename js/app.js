import { db } from "./firebase-config.js";
import { 
  doc, getDoc, collection, getDocs, addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── Variables Globales ────────────────────────────────────
let selectedStars = 0;
const STAR_LABELS = ["", "Malo 😞", "Regular 😐", "Bueno 😊", "Muy bueno 😍", "¡Excelente! 🌟"];

// ── Navegación SPA (Single Page Application) ──────────────
function switchView(id) {
  // Ocultar todas las vistas de forma segura
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
  });
  
  // Mostrar la vista seleccionada
  const target = document.getElementById("view-" + id);
  if (target) { 
    target.classList.add("active"); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }
  
  // Marcar como activo el botón correspondiente en los menús (Tab y Móvil)
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });
  
  // Cargar datos pesados de Firebase solo cuando el cliente entra a la sección
  if (id === "galeria") buildGallery();
  if (id === "resenas") buildReviews();
}

// ── Galería ───────────────────────────────────────────────
async function buildGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid || grid.children.length) return; // Si ya tiene fotos cargadas, no repite el proceso
  
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

// ── Lightbox (Visor de fotos) ─────────────────────────────
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
document.addEventListener("keydown", e => { 
  if (e.key === "Escape") closeLightbox(); 
});

// ── Servicios ─────────────────────────────────────────────
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

// ── Redes sociales ────────────────────────────────────────
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

// ── Configuración del negocio ─────────────────────────────
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

// ── Reseñas (Calculos y Render) ───────────────────────────
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
    const sorted = [...reviews].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });
    sorted.forEach(r => {
      const card = document.createElement("div");
      card.className = "rv-card" + (r.featured ? " featured" : "");
      card.innerHTML = `
        <div class="rv-card-top">
          <div class="rv-avatar ${r.featured ? "featured-av" : ""}">${r.name.trim().charAt(0).toUpperCase()}</div>
          <div class="rv-card-stars">${starsHTML(r.stars)}</div>
        </div>
        <p class="rv-text">"${r.comment}"</p>
        <div class="rv-author">${r.name}<span class="rv-date">${formatDate(r.date)}</span></div>
        ${r.service ? `<span class="rv-service">${r.service}</span>` : ""}
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
  document.getElementById("rv-avg-stars").querySelectorAll("i").forEach(i => i.style.color = "var(--c-gold)");
  document.getElementById("rv-total-label").textContent = reviews.length === 1 ? "1 reseña" : `${reviews.length} reseñas`;

  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => { if (r.stars >= 1 && r.stars <= 5) counts[r.stars - 1]++; });
  const barsEl = document.getElementById("rv-bars");
  if (!barsEl) return;
  barsEl.innerHTML = "";
  for (let s = 5; s >= 1; s--) {
    const pct = reviews.length ? Math.round((counts[s - 1] / reviews.length) * 100) : 0;
    barsEl.insertAdjacentHTML("beforeend", `
      <div class="rv-bar-row">
        <span>${s}</span>
        <i class="fa-solid fa-star" style="color:var(--c-gold);font-size:.7rem;flex-shrink:0"></i>
        <div class="rv-bar-track"><div class="rv-bar-fill" style="width:${pct}%"></div></div>
        <span class="rv-bar-count">${counts[s - 1]}</span>
      </div>
    `);
  }
}

// ── Selector de Estrellas (Formulario) ────────────────────
document.querySelectorAll("#star-picker button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedStars = parseInt(btn.dataset.v);
    document.querySelectorAll("#star-picker button").forEach((b, i) => {
      b.classList.toggle("lit", i < selectedStars);
      b.style.color = i < selectedStars ? "var(--c-gold)" : "";
    });
    document.getElementById("star-hint").textContent = STAR_LABELS[selectedStars];
  });
  btn.addEventListener("mouseenter", () => {
    const hovered = parseInt(btn.dataset.v);
    document.querySelectorAll("#star-picker button").forEach((b, i) => {
      b.style.color = i < hovered ? "var(--c-gold)" : "rgba(200,168,130,.25)";
    });
  });
  btn.addEventListener("mouseleave", () => {
    document.querySelectorAll("#star-picker button").forEach((b, i) => {
      b.style.color = i < selectedStars ? "var(--c-gold)" : "";
    });
  });
});

// ── Toast (Alertas Flotantes) ─────────────────────────────
function showToast(msg) {
  const t = document.getElementById("rv-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

// ── Enviar Reseña a Firestore ─────────────────────────────
document.getElementById("btn-submit-review")?.addEventListener("click", async () => {
  const name    = document.getElementById("rv-name").value.trim();
  const service = document.getElementById("rv-service").value;
  const comment = document.getElementById("rv-comment").value.trim();
  
  if (!selectedStars) { showToast("⭐ Por favor selecciona una calificación"); return; }
  if (!name)          { showToast("✏️ Escribe tu nombre para publicar"); return; }
  if (!comment)       { showToast("💬 Agrega un comentario sobre tu experiencia"); return; }

  try {
    const today = new Date().toISOString().split("T")[0];
    await addDoc(collection(db, "reviews"), {
      name, stars: selectedStars, service, comment,
      date: today, featured: false, approved: false
    });

    selectedStars = 0;
    document.getElementById("rv-name").value    = "";
    document.getElementById("rv-service").value = "";
    document.getElementById("rv-comment").value = "";
    document.getElementById("star-hint").textContent = "Selecciona una calificación:";
    document.querySelectorAll("#star-picker button").forEach(b => { b.classList.remove("lit"); b.style.color = ""; });

    showToast("🌸 ¡Gracias! Tu reseña fue enviada y será publicada pronto");
  } catch (error) {
    console.error("Error al enviar reseña:", error);
    showToast("❌ Hubo un problema al guardar tu reseña.");
  }
});

// ── Enviar Formulario de Citas a Firestore ────────────────
document.getElementById("btn-send-appointment")?.addEventListener("click", async () => {
  const name    = document.getElementById("f-name").value.trim();
  const phone   = document.getElementById("f-phone").value.trim();
  const service = document.getElementById("f-service").value.trim();
  const date    = document.getElementById("f-date").value;
  const message = document.getElementById("f-msg").value.trim();

  if (!name || !phone || !service || !date) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  try {
    await addDoc(collection(db, "appointments"), {
      name, phone, service, date,
      message: message || "",
      status: "Pendiente"
    });

    alert("Solicitud enviada correctamente ✅");
    document.getElementById("f-name").value    = "";
    document.getElementById("f-phone").value   = "";
    document.getElementById("f-service").value = "";
    document.getElementById("f-date").value    = "";
    document.getElementById("f-msg").value     = "";
  } catch (error) {
    console.error("Error al enviar cita:", error);
    alert("Hubo un error al procesar tu reserva. Inténtalo de nuevo.");
  }
});

// ── Sombra del Menú Superior en Scroll ────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("main-nav")?.classList.toggle("scrolled", window.scrollY > 10);
});

// ── Inicialización Segura (Init) ──────────────────────────
window.addEventListener("DOMContentLoaded", async () => {
  // 1. ACTIVAR BOTONES INMEDIATAMENTE (Evita congelamientos de interfaz)
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.querySelectorAll("[data-go-to]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.goTo));
  });

  // 2. CARGA DE BASES DE DATOS EN SEGUNDO PLANO
  try {
    await Promise.all([
      loadSocialLinks(),
      loadBusinessSettings(),
      loadServices()
    ]);
  } catch (err) {
    console.error("Error cargando componentes iniciales de Firebase:", err);
  }
});

// Registrar Service Worker para soporte PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(err => console.log("SW error:", err));
}
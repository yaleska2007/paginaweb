
    /* ── Gallery ─────────────────────────────────────────────── */

/*

const GALLERY_ITEMS = [
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', label: 'Acrílicas rosas', tall: true },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&sat=-20', label: 'Nude mate', tall: false },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&hue-rotate=30', label: 'Semipermanente', tall: false },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&brightness=1.1', label: 'Gel francés', tall: true },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&contrast=1.1', label: 'Nail art floral', tall: false },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&sepia=20', label: 'Acrílicas largas', tall: false },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&gray=50', label: 'Diseño especial', tall: false },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&sharp=10', label: 'Gel con diseño', tall: true },
];

function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (grid.children.length) return;
  GALLERY_ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className = 'g-item' + (item.tall ? ' tall' : '');
    div.innerHTML = `<img src="${item.url}" alt="${item.label}" loading="lazy"/><div class="g-overlay"><span>${item.label}</span></div>`;
    div.addEventListener('click', () => openLightbox(item.url, item.label));
    grid.appendChild(div);
  });
}

/* ── Lightbox ─────────────────────────────────────────────── */
/*
function openLightbox(src, alt) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').alt = alt;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => { if (e.target === e.currentTarget) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Reviews data ─────────────────────────────────────────── */
/*
let REVIEWS =
JSON.parse(
    localStorage.getItem("reviews")
) || [];

let selectedStars = 0;
const STAR_LABELS = ['', 'Malo 😞', 'Regular 😐', 'Bueno 😊', 'Muy bueno 😍', '¡Excelente! 🌟'];

function starsHTML(n) {
  return Array.from({length: 5}, (_, i) =>
    `<i class="fa-solid fa-star${i >= n ? ' empty' : ''}"></i>`
  ).join('');
}

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}

function buildReviews() {
  buildSummary();
  const grid = document.getElementById('rv-grid');
  grid.innerHTML = '';
  if (!REVIEWS.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--c-muted);font-weight:300;font-style:italic;">Sé la primera en dejar tu reseña 🌸</div>`;
    return;
  }
  const sorted = [...REVIEWS].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date) - new Date(a.date);
  });
  sorted.forEach(r => {
    const card = document.createElement('div');
    card.className = 'rv-card' + (r.featured ? ' featured' : '');
    card.style.animation = 'fadeUp .5s ease both';
    card.innerHTML = `
      <div class="rv-card-top">
        <div class="rv-avatar ${r.featured ? 'featured-av' : ''}">${r.name.trim().charAt(0).toUpperCase()}</div>
        <div class="rv-card-stars">${starsHTML(r.stars)}</div>
      </div>
      <p class="rv-text">"${r.comment}"</p>
      <div class="rv-author">${r.name}<span class="rv-date">${formatDate(r.date)}</span></div>
      ${r.service ? `<span class="rv-service">${r.service}</span>` : ''}
    `;
    grid.appendChild(card);
  });
}

function buildSummary() {
  const avg = REVIEWS.reduce((a, r) => a + r.stars, 0) / (REVIEWS.length || 1);
  document.getElementById('rv-avg').textContent = avg.toFixed(1);
  document.getElementById('rv-avg-stars').innerHTML = starsHTML(Math.round(avg));
  document.getElementById('rv-avg-stars').querySelectorAll('i').forEach(i => i.style.color = 'var(--c-gold)');
  document.getElementById('rv-total-label').textContent = REVIEWS.length === 1 ? '1 reseña' : `${REVIEWS.length} reseñas`;
  const counts = [0,0,0,0,0];
  REVIEWS.forEach(r => { if (r.stars >= 1 && r.stars <= 5) counts[r.stars - 1]++; });
  const barsEl = document.getElementById('rv-bars');
  barsEl.innerHTML = '';
  for (let s = 5; s >= 1; s--) {
    const pct = REVIEWS.length ? Math.round((counts[s-1] / REVIEWS.length) * 100) : 0;
    barsEl.insertAdjacentHTML('beforeend', `
      <div class="rv-bar-row">
        <span>${s}</span>
        <i class="fa-solid fa-star" style="color:var(--c-gold);font-size:.7rem;flex-shrink:0"></i>
        <div class="rv-bar-track"><div class="rv-bar-fill" style="width:${pct}%"></div></div>
        <span class="rv-bar-count">${counts[s-1]}</span>
      </div>
    `);
  }
}

/* ── Star picker ─────────────────────────────────────────── */
/*
document.querySelectorAll('#star-picker button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedStars = parseInt(btn.dataset.v);
    document.querySelectorAll('#star-picker button').forEach((b, i) => {
      b.classList.toggle('lit', i < selectedStars);
      b.style.color = i < selectedStars ? 'var(--c-gold)' : '';
    });
    document.getElementById('star-hint').textContent = STAR_LABELS[selectedStars];
  });
  btn.addEventListener('mouseenter', () => {
    const hovered = parseInt(btn.dataset.v);
    document.querySelectorAll('#star-picker button').forEach((b, i) => {
      b.style.color = i < hovered ? 'var(--c-gold)' : 'rgba(200,168,130,.25)';
    });
  });
  btn.addEventListener('mouseleave', () => {
    document.querySelectorAll('#star-picker button').forEach((b, i) => {
      b.style.color = i < selectedStars ? 'var(--c-gold)' : '';
    });
  });
});

/* ── Toast ───────────────────────────────────────────────── */
/*
function showToast(msg) {
  const t = document.getElementById('rv-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── Submit review ───────────────────────────────────────── */
/*
function submitReview() {
  const name    = document.getElementById('rv-name').value.trim();
  const service = document.getElementById('rv-service').value;
  const comment = document.getElementById('rv-comment').value.trim();
  if (!selectedStars) { showToast('⭐ Por favor selecciona una calificación'); return; }
  if (!name)          { showToast('✏️ Escribe tu nombre para publicar'); return; }
  if (!comment)       { showToast('💬 Agrega un comentario sobre tu experiencia'); return; }
  const today = new Date().toISOString().split('T')[0];
  REVIEWS.unshift({ name, stars: selectedStars, service, comment, date: today, featured: false });
  localStorage.setItem(
    "reviews",
    JSON.stringify(REVIEWS)
    );
  selectedStars = 0;
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-service').value = '';
  document.getElementById('rv-comment').value = '';
  document.getElementById('star-hint').textContent = 'Selecciona una calificación:';
  document.querySelectorAll('#star-picker button').forEach(b => { b.classList.remove('lit'); b.style.color = ''; });
  buildReviews();
  showToast('🌸 ¡Gracias! Tu reseña fue publicada');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── SPA Navigation ──────────────────────────────────────── */
/* UNA SOLA definición limpia — no hay doble reemplazo */
/*
function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + id);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  document.querySelectorAll('[data-view]').forEach(btn => btn.classList.toggle('active', btn.dataset.view === id));
  if (id === 'galeria') buildGallery();
  if (id === 'resenas') buildReviews();
}

/* Conectar TODOS los botones de navegación */
/*
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

/* ── WhatsApp form ───────────────────────────────────────── */
/*
function sendWA(){


    

    const name =
    document.getElementById("f-name").value;

    const phone =
    document.getElementById("f-phone").value;

    const service =
    document.getElementById("f-service").value;

    const date =
    document.getElementById("f-date").value;

    const message =
    document.getElementById("f-msg").value;

    if(!name || !phone || !service || !date){

        alert("Completa todos los campos");

        return;

    }

    const appointments =
    JSON.parse(
        localStorage.getItem("appointments")
    ) || [];

    appointments.push({

        name,
        phone,
        service,
        date,
        message,
        status:"Pendiente"

    });

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    alert(
        "Solicitud enviada correctamente"
    );

    document.getElementById("f-name").value = "";
    document.getElementById("f-phone").value = "";
    document.getElementById("f-service").value = "";
    document.getElementById("f-date").value = "";
    document.getElementById("f-msg").value = "";

}

/* ── Nav scroll shadow ───────────────────────────────────── */
/*
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 10);
});


function loadAdminServices(){

    const services =
    JSON.parse(
        localStorage.getItem("services")
    ) || [];

    const grid =
    document.getElementById(
        "services-grid"
    );

    if(!grid) return;

    grid.innerHTML = "";

    services.forEach(service=>{

        const card =
        document.createElement("div");

        card.classList.add("srv-card");

        card.innerHTML = `

            <div class="srv-img">
                <img src="${service.image}"
                alt="${service.name}">
            </div>

            <h3>${service.name}</h3>

            <p>${service.description}</p>

            <span class="srv-price">
                $${service.price}
            </span>

        `;

        grid.appendChild(card);

    });

}

window.addEventListener(
    "DOMContentLoaded",
    loadAdminServices
);


function loadAdminGallery(){

    const gallery =
    JSON.parse(
        localStorage.getItem("galleryImages")
    ) || [];

    const grid =
    document.getElementById(
        "gallery-grid"
    );

    if(!grid) return;

    grid.innerHTML = "";

    gallery.forEach(image=>{

        const item =
        document.createElement("div");

        item.classList.add("gallery-item");

        item.innerHTML = `
            <img
                src="${image}"
                alt="Trabajo ANGELESNAILS2007">
        `;

        grid.appendChild(item);

    });

}

window.addEventListener(
    "DOMContentLoaded",
    loadAdminGallery
);

function loadSocialLinks(){

    const social =
    JSON.parse(
        localStorage.getItem("social")
    ) || {};

    const whatsapp =
    social.whatsapp || "";

    const whatsappUrl =
    `https://wa.me/${whatsapp}?text=Hola,%20quiero%20agendar%20una%20cita`;

    const navWhatsapp =
    document.getElementById("nav-whatsapp");

    const floatWhatsapp =
    document.getElementById("float-whatsapp");

    const instagram =
    document.getElementById("instagram-link");

    const tiktok =
    document.getElementById("tiktok-link");

    if(navWhatsapp)
        navWhatsapp.href = whatsappUrl;

    if(floatWhatsapp)
        floatWhatsapp.href = whatsappUrl;

    if(instagram)
        instagram.href =
        social.instagram || "#";

    if(tiktok)
        tiktok.href =
        social.tiktok || "#";

}

window.addEventListener(
    "DOMContentLoaded",
    loadSocialLinks
);


function loadBusinessSettings(){

    const settings =
    JSON.parse(
        localStorage.getItem("settings")
    ) || {};

    const social =
    JSON.parse(
        localStorage.getItem("social")
    ) || {};

    // MAPA

    const map =
    document.getElementById(
        "business-map"
    );

    if(
        map &&
        settings.mapUrl
    ){
        map.src =
        settings.mapUrl;
    }

    // DIRECCIÓN

    const address =
    document.getElementById(
        "location-address"
    );

    if(address){
        address.textContent =
        settings.address || "";
    }

    // HORARIO

    const schedule =
    document.getElementById(
        "location-schedule"
    );

    if(schedule){
        schedule.textContent =
        settings.schedule || "";
    }

    // WHATSAPP

    const whatsapp =
    document.getElementById(
        "location-whatsapp"
    );

    if(whatsapp){
        whatsapp.textContent =
        social.whatsapp || "";
    }

    // INSTAGRAM

    const instagram =
    document.getElementById(
        "location-instagram"
    );

    if(instagram){
        instagram.textContent =
        social.instagram || "";
    }

    // LOGO

      const logo =
      document.getElementById(
          "business-logo-display"
      );

      if(
          logo &&
          settings.logo
      ){

          logo.src =
          settings.logo;

          logo.style.display =
          "block";

      }

      // LOGO HERO (PORTADA)

      const heroLogo =
      document.getElementById(
          "hero-logo"
      );

      if(
          heroLogo &&
          settings.logo
      ){

          heroLogo.src =
          settings.logo;

      }

    // NOMBRE DEL NEGOCIO

    const businessName =
    document.getElementById(
        "business-name-display"
    );

    if(
        businessName &&
        settings.name
    ){

        businessName.innerHTML =
        `<span class="dot">✦</span>
        ${settings.name}`;

    }

}

window.addEventListener(
    "DOMContentLoaded",
    loadBusinessSettings
);*/














import { db } from "./firebase-config.js";
import {
  doc, getDoc, collection, getDocs, addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ── Galería ───────────────────────────────────────────────
async function buildGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid || grid.children.length) return;
  const snap = await getDocs(collection(db, "gallery"));
  if (snap.empty) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--c-muted);font-style:italic;">Próximamente 🌸</div>`;
    return;
  }
  snap.forEach(docSnap => {
    const { url } = docSnap.data();
    const div = document.createElement("div");
    div.className = "g-item";
    div.innerHTML = `<img src="${url}" alt="Nail art" loading="lazy"/><div class="g-overlay"><span>Ver</span></div>`;
    div.addEventListener("click", () => openLightbox(url, "Nail art"));
    grid.appendChild(div);
  });
}

// ── Lightbox ──────────────────────────────────────────────
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
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", e => { if (e.target === e.currentTarget) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

// ── Servicios ─────────────────────────────────────────────
async function loadServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
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
}

// ── Redes sociales ────────────────────────────────────────
async function loadSocialLinks() {
  const snap = await getDoc(doc(db, "config", "social"));
  if (!snap.exists()) return;
  const d = snap.data();
  const whatsapp = d.whatsapp || "";
  const whatsappUrl = `https://wa.me/${whatsapp}?text=Hola,%20quiero%20agendar%20una%20cita`;

  document.getElementById("nav-whatsapp")   && (document.getElementById("nav-whatsapp").href   = whatsappUrl);
  document.getElementById("float-whatsapp") && (document.getElementById("float-whatsapp").href = whatsappUrl);
  document.getElementById("instagram-link") && (document.getElementById("instagram-link").href = d.instagram || "#");
  document.getElementById("tiktok-link")    && (document.getElementById("tiktok-link").href    = d.tiktok    || "#");
}

// ── Configuración del negocio ─────────────────────────────
async function loadBusinessSettings() {
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
}

// ── Reseñas ───────────────────────────────────────────────
let selectedStars = 0;
const STAR_LABELS = ["", "Malo 😞", "Regular 😐", "Bueno 😊", "Muy bueno 😍", "¡Excelente! 🌟"];

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
  const snap = await getDocs(collection(db, "reviews"));
  const reviews = [];
  snap.forEach(d => { if (d.data().approved) reviews.push(d.data()); });

  buildSummary(reviews);

  const grid = document.getElementById("rv-grid");
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
}

function buildSummary(reviews) {
  const avg = reviews.reduce((a, r) => a + r.stars, 0) / (reviews.length || 1);
  document.getElementById("rv-avg").textContent = avg.toFixed(1);
  document.getElementById("rv-avg-stars").innerHTML = starsHTML(Math.round(avg));
  document.getElementById("rv-avg-stars").querySelectorAll("i").forEach(i => i.style.color = "var(--c-gold)");
  document.getElementById("rv-total-label").textContent = reviews.length === 1 ? "1 reseña" : `${reviews.length} reseñas`;

  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => { if (r.stars >= 1 && r.stars <= 5) counts[r.stars - 1]++; });
  const barsEl = document.getElementById("rv-bars");
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

// ── Star picker ───────────────────────────────────────────
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

// ── Toast ─────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("rv-toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

// ── Submit reseña ─────────────────────────────────────────
window.submitReview = async function () {
  const name    = document.getElementById("rv-name").value.trim();
  const service = document.getElementById("rv-service").value;
  const comment = document.getElementById("rv-comment").value.trim();
  if (!selectedStars) { showToast("⭐ Por favor selecciona una calificación"); return; }
  if (!name)          { showToast("✏️ Escribe tu nombre para publicar"); return; }
  if (!comment)       { showToast("💬 Agrega un comentario sobre tu experiencia"); return; }

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
};

// ── Formulario de citas ───────────────────────────────────
window.sendWA = async function () {
  const name    = document.getElementById("f-name").value;
  const phone   = document.getElementById("f-phone").value;
  const service = document.getElementById("f-service").value;
  const date    = document.getElementById("f-date").value;
  const message = document.getElementById("f-msg").value;

  if (!name || !phone || !service || !date) {
    alert("Completa todos los campos");
    return;
  }

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
};

// ── Navegación SPA ────────────────────────────────────────
function switchView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById("view-" + id);
  if (target) { target.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  document.querySelectorAll("[data-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.view === id));
  if (id === "galeria") buildGallery();
  if (id === "resenas") buildReviews();
}
window.switchView = switchView;

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

// ── Nav scroll shadow ─────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("main-nav").classList.toggle("scrolled", window.scrollY > 10);
});

// ── Init ──────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadSocialLinks();
  loadBusinessSettings();
  loadServices();
  buildReviews();
});



// Registrar service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js");
}
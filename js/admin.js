
/*import { auth }
from "./firebase-config.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location =
"login.html";

}

});






const uploadInput = document.getElementById("gallery-upload");
const uploadBtn = document.getElementById("upload-btn");
const preview = document.getElementById("gallery-preview");

let galleryImages = JSON.parse(localStorage.getItem("galleryImages")) || [];

// Cargar imágenes guardadas al iniciar
window.addEventListener("DOMContentLoaded", () => {
    renderGallery();
});

// Botón seleccionar imágenes
uploadBtn.addEventListener("click", () => {
    uploadInput.click();
});

// Subir imágenes
uploadInput.addEventListener("change", (event) => {

    const files = event.target.files;

    for (let file of files) {

        const reader = new FileReader();

        reader.onload = function(e){

            galleryImages.push(e.target.result);

            localStorage.setItem(
                "galleryImages",
                JSON.stringify(galleryImages)
            );

            renderGallery();

        };

        reader.readAsDataURL(file);
    }

});

// Mostrar galería
function renderGallery(){

    preview.innerHTML = "";

    galleryImages.forEach((image, index) => {

        const container = document.createElement("div");
        container.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = image;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "✕";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", () => {

            galleryImages.splice(index, 1);

            localStorage.setItem(
                "galleryImages",
                JSON.stringify(galleryImages)
            );

            renderGallery();

        });

        container.appendChild(img);
        container.appendChild(deleteBtn);

        preview.appendChild(container);

    });

}

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    item.addEventListener("click", (e) => {

        e.preventDefault();

        menuItems.forEach(btn =>
            btn.classList.remove("active")
        );

        item.classList.add("active");

        document
            .querySelectorAll(".admin-section")
            .forEach(section =>
                section.classList.remove("active-section")
            );

        const target =
            item.dataset.section;

        const section =
            document.getElementById(
                target + "-section"
            );

        if(section){
            section.classList.add(
                "active-section"
            );
        }

    });

});
let services =
JSON.parse(localStorage.getItem("services")) || [];

const saveServiceBtn =
document.getElementById("save-service");

const servicesList =
document.getElementById("services-list");

function renderServices(){

    servicesList.innerHTML = "";

    services.forEach((service, index)=>{

        const card =
        document.createElement("div");

        card.classList.add("service-card");

        card.innerHTML = `

            <img
            src="${service.image}"
            class="service-image">

            <h3>${service.name}</h3>

            <p>${service.description}</p>

            <strong>$${service.price}</strong>

            <br><br>

            <button onclick="deleteService(${index})">
                Eliminar
            </button>

        `;
        servicesList.appendChild(card);

    });

}

saveServiceBtn?.addEventListener("click", ()=>{

    const name =
    document.getElementById("service-name").value;

    const description =
    document.getElementById("service-description").value;

    const price =
    document.getElementById("service-price").value;

    const imageInput =
    document.getElementById("service-image");

    const file =
    imageInput.files[0];

    if(!name || !price){
        alert("Completa los campos");
        return;
    }

    if(!file){
        alert("Selecciona una imagen");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        services.push({
            name,
            description,
            price,
            image: e.target.result
        });

        localStorage.setItem(
            "services",
            JSON.stringify(services)
        );

        renderServices();

        document.getElementById("service-name").value = "";
        document.getElementById("service-description").value = "";
        document.getElementById("service-price").value = "";
        document.getElementById("service-image").value = "";

    };

    reader.readAsDataURL(file);

});
function deleteService(index){

    services.splice(index,1);

    localStorage.setItem(
        "services",
        JSON.stringify(services)
    );

    renderServices();

}

renderServices();

const saveSocialBtn =
document.getElementById("save-social");

function loadSocialData(){

    const social =
    JSON.parse(
        localStorage.getItem("social")
    ) || {};

    document.getElementById("whatsapp").value =
    social.whatsapp || "";

    document.getElementById("instagram").value =
    social.instagram || "";

    document.getElementById("tiktok").value =
    social.tiktok || "";


}

saveSocialBtn?.addEventListener("click", ()=>{

    const social = {

        whatsapp:
        document.getElementById("whatsapp").value,

        instagram:
        document.getElementById("instagram").value,

        tiktok:
        document.getElementById("tiktok").value,


    };

    localStorage.setItem(
        "social",
        JSON.stringify(social)
    );

    alert("Redes guardadas");

});

loadSocialData();

const saveSettingsBtn =
document.getElementById("save-settings");

function loadSettings(){


    

    const settings =
    JSON.parse(
        localStorage.getItem("settings")
    ) || {};

    document.getElementById(
        "business-map-url"
    ).value =
    settings.mapUrl || "";

    document.getElementById(
        "business-name"
    ).value =
    settings.name || "";

    document.getElementById(
        "business-address"
    ).value =
    settings.address || "";

    document.getElementById(
        "business-schedule"
    ).value =
    settings.schedule || "";

    if(settings.logo){

        document.getElementById(
            "logo-preview"
        ).innerHTML = `
            <img
            src="${settings.logo}"
            style="
            width:150px;
            margin-top:20px;
            border-radius:12px;">
        `;
    }

}

saveSettingsBtn?.addEventListener(
"click",
()=>{

    const mapUrl =
    document.getElementById(
        "business-map-url"
    ).value;

    const name =
    document.getElementById(
        "business-name"
    ).value;

    const address =
    document.getElementById(
        "business-address"
    ).value;

    const schedule =
    document.getElementById(
        "business-schedule"
    ).value;

    const logoInput =
    document.getElementById(
        "business-logo"
    );

    const file =
    logoInput.files[0];

    const oldSettings =
    JSON.parse(
        localStorage.getItem("settings")
    ) || {};

    if(file){

        const reader =
        new FileReader();

        reader.onload = function(e){

            const settings = {

                name,
                address,
                schedule,
                mapUrl,
                logo:e.target.result

            };

            localStorage.setItem(
                "settings",
                JSON.stringify(settings)
            );

            loadSettings();

            alert(
                "Configuración guardada"
            );

        };

        reader.readAsDataURL(file);

    }else{

        const settings = {

            name,
            address,
            schedule,
            mapUrl,
            logo: oldSettings.logo || ""

        };

        localStorage.setItem(
            "settings",
            JSON.stringify(settings)
        );

        loadSettings();

        alert(
            "Configuración guardada"
        );

    }

});

loadSettings();










let appointments =
JSON.parse(
    localStorage.getItem("appointments")
) || [];

const appointmentsList =
document.getElementById(
    "appointments-list"
);

function renderAppointments(){

    const appointments =
    JSON.parse(
        localStorage.getItem(
            "appointments"
        )
    ) || [];

    if(!appointmentsList) return;

    appointmentsList.innerHTML = "";

    if(appointments.length === 0){

        appointmentsList.innerHTML =
        "<p>No hay citas registradas.</p>";

        return;
    }

    appointments.forEach(
    (appointment,index)=>{

        const card =
        document.createElement("div");

        card.classList.add(
            "service-card"
        );

        card.innerHTML = `

            <h3>${appointment.name}</h3>

            <p>
            <strong>WhatsApp:</strong>
            ${appointment.phone}
            </p>

            <p>
            <strong>Servicio:</strong>
            ${appointment.service}
            </p>

            <p>
            <strong>Fecha:</strong>
            ${appointment.date}
            </p>

            <p>
            <strong>Mensaje:</strong>
            ${appointment.message}
            </p>

            <p>
            <strong>Estado:</strong>
            ${appointment.status}
            </p>

            <button onclick="confirmAppointment(${index})">
                Confirmar
            </button>

            <button onclick="deleteAppointment(${index})">
                Eliminar
            </button>

        `;

        appointmentsList.appendChild(card);

    });

}




function deleteAppointment(index){

    appointments.splice(
        index,
        1
    );

    localStorage.setItem(
        "appointments",
        JSON.stringify(
            appointments
        )
    );

    renderAppointments();
    updateDashboard();



    

}

function confirmAppointment(index){

    let appointments =
    JSON.parse(
        localStorage.getItem("appointments")
    ) || [];

    const appointment =
    appointments[index];

    appointment.status =
    "Confirmada";

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    const mensaje =
    `Hola ${appointment.name}, 😊

Tu cita para ${appointment.service} ha sido CONFIRMADA. 💅

📅 Fecha: ${appointment.date}

Te esperamos. Gracias por confiar en ANGELESNAILS2007 🌸`;

    window.open(
        `https://wa.me/57${appointment.phone}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );

    renderAppointments();

}


function updateDashboard(){

    const galleryCount =
    document.getElementById(
        "gallery-count"
    );

    const servicesCount =
    document.getElementById(
        "services-count"
    );

    const appointmentsCount =
    document.getElementById(
        "appointments-count"
    );

    const reviewsCount =
    document.getElementById(
        "reviews-count"
    );

    if(galleryCount){

        galleryCount.textContent =
        galleryImages.length;

    }

    if(servicesCount){

        servicesCount.textContent =
        services.length;

    }

    if(appointmentsCount){

        appointmentsCount.textContent =
        appointments.length;

    }

    if(reviewsCount){

        const reviews =
        JSON.parse(
            localStorage.getItem(
                "reviews"
            )
        ) || [];

        reviewsCount.textContent =
        reviews.length;

    }

}

updateDashboard();
renderAppointments();






let selectedStars = 5;

const starButtons =
document.querySelectorAll(
"#star-picker button"
);

starButtons.forEach(btn=>{

    btn.addEventListener(
    "click",
    ()=>{

        selectedStars =
        Number(
            btn.dataset.v
        );

        updateStars();

    });

});

function updateStars(){

    starButtons.forEach(btn=>{

        if(
            Number(btn.dataset.v)
            <= selectedStars
        ){

            btn.classList.add(
                "active"
            );

        }else{

            btn.classList.remove(
                "active"
            );

        }

    });

}

function submitReview(){

    const name =
    document.getElementById(
        "rv-name"
    ).value;

    const service =
    document.getElementById(
        "rv-service"
    ).value;

    const comment =
    document.getElementById(
        "rv-comment"
    ).value;

    if(
        !name ||
        !service ||
        !comment
    ){
        alert(
            "Completa todos los campos"
        );
        return;
    }

    const reviews =
    JSON.parse(
        localStorage.getItem(
            "reviews"
        )
    ) || [];

    reviews.push({

        name,
        service,
        comment,
        stars:selectedStars,
        date:new Date().toLocaleDateString(),
        approved:false

    });
    
    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );

    document.getElementById(
        "rv-name"
    ).value = "";

    document.getElementById(
        "rv-service"
    ).value = "";

    document.getElementById(
        "rv-comment"
    ).value = "";

    selectedStars = 5;

    updateStars();

    renderReviews();

    alert(
        "Reseña publicada 🌸"
    );

}


function renderReviews(){

    const reviews =
    JSON.parse(
        localStorage.getItem(
            "reviews"
        )
    ) || [];

    const grid =
    document.getElementById(
        "rv-grid"
    );

    if(!grid) return;

    grid.innerHTML = "";

    reviews
.filter(review => review.approved)
.forEach(review=>{

        const card =
        document.createElement("div");

        card.classList.add(
            "review-card"
        );

        card.innerHTML = `

            <h3>${review.name}</h3>

            <p>
            ⭐ ${review.stars}/5
            </p>

            <p>
            <strong>
            ${review.service}
            </strong>
            </p>

            <p>
            ${review.comment}
            </p>

            <small>
            ${review.date}
            </small>

        `;

        grid.appendChild(card);

    });

    updateReviewSummary(
        reviews
    );

}

renderReviews();


function updateReviewSummary(
reviews
){

    const avg =
    document.getElementById(
        "rv-avg"
    );

    const total =
    document.getElementById(
        "rv-total-label"
    );

    const avgStars =
    document.getElementById(
        "rv-avg-stars"
    );

    if(reviews.length === 0){

        avg.textContent =
        "0.0";

        total.textContent =
        "0 reseñas";

        avgStars.innerHTML =
        "";

        return;
    }

    const score =
    reviews.reduce(
        (sum,r)=>
        sum + r.stars,
        0
    ) / reviews.length;

    avg.textContent =
    score.toFixed(1);

    total.textContent =
    `${reviews.length} reseñas`;

    avgStars.innerHTML =
    "⭐".repeat(
        Math.round(score)
    );

}



let reviews =
JSON.parse(
    localStorage.getItem("reviews")
) || [];

const reviewsList =
document.getElementById(
    "reviews-list"
);

function renderReviewsAdmin(){

    if(!reviewsList) return;

    reviewsList.innerHTML = "";

    reviews.forEach((review,index)=>{

        const card =
        document.createElement("div");

        card.classList.add("service-card");

        card.innerHTML = `

            <h3>${review.name}</h3>

            <p>⭐ ${review.stars}/5</p>

            <p>
            <strong>Servicio:</strong>
            ${review.service}
            </p>

            <p>
            ${review.comment}
            </p>

            <p>
            ${review.date}
            </p>

            <p>
            Estado:
            ${
                review.approved
                ? "✅ Aprobada"
                : "⏳ Pendiente"
            }
            </p>

            ${
                !review.approved
                ?
                `<button onclick="approveReview(${index})">
                    Aprobar
                </button>`
                : ""
            }

            <button onclick="deleteReview(${index})">
                Eliminar
            </button>

        `;

        reviewsList.appendChild(card);

    });

}



function deleteReview(index){

    reviews.splice(index,1);

    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );

    renderReviewsAdmin();

}

renderReviewsAdmin(); */








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

uploadBtn.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", async (e) => {
  for (const file of e.target.files) {
    const url = await uploadImage(file);
    await addDoc(collection(db, "gallery"), { url, createdAt: Date.now() });
  }
  loadGallery();
});

async function loadGallery() {
  preview.innerHTML = "";
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
  servicesList.innerHTML = "";
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
  updateDashboard();
}

// ── REDES SOCIALES ────────────────────────────────────────
const saveSocialBtn = document.getElementById("save-social");

async function loadSocialData() {
  const snap = await getDoc(doc(db, "config", "social"));
  if (snap.exists()) {
    const d = snap.data();
    document.getElementById("whatsapp").value  = d.whatsapp  || "";
    document.getElementById("instagram").value = d.instagram || "";
    document.getElementById("tiktok").value    = d.tiktok    || "";
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
  const snap = await getDoc(doc(db, "config", "settings"));
  if (snap.exists()) {
    const d = snap.data();
    document.getElementById("business-map-url").value  = d.mapUrl   || "";
    document.getElementById("business-name").value     = d.name     || "";
    document.getElementById("business-address").value  = d.address  || "";
    document.getElementById("business-schedule").value = d.schedule || "";
    if (d.logo) {
      document.getElementById("logo-preview").innerHTML =
        `<img src="${d.logo}" style="width:150px;margin-top:20px;border-radius:12px;">`;
    }
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

// ── CITAS ─────────────────────────────────────────────────
const appointmentsList = document.getElementById("appointments-list");

async function loadAppointments() {
  if (!appointmentsList) return;
  appointmentsList.innerHTML = "";
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
  updateDashboard();
}

// ── RESEÑAS ADMIN ─────────────────────────────────────────
const reviewsList = document.getElementById("reviews-list");

async function loadReviewsAdmin() {
  if (!reviewsList) return;
  reviewsList.innerHTML = "";
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
  updateDashboard();
}

// ── DASHBOARD ─────────────────────────────────────────────
async function updateDashboard() {
  const [gallery, services, appointments, reviews] = await Promise.all([
    getDocs(collection(db, "gallery")),
    getDocs(collection(db, "services")),
    getDocs(collection(db, "appointments")),
    getDocs(collection(db, "reviews")),
  ]);
  document.getElementById("gallery-count")?.setAttribute("textContent", gallery.size);
  document.getElementById("gallery-count") && (document.getElementById("gallery-count").textContent = gallery.size);
  document.getElementById("services-count") && (document.getElementById("services-count").textContent = services.size);
  document.getElementById("appointments-count") && (document.getElementById("appointments-count").textContent = appointments.size);
  document.getElementById("reviews-count") && (document.getElementById("reviews-count").textContent = reviews.size);
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
  updateDashboard();
});




// Registrar service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js");
}
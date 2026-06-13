// =========================================================================
// 1. SISTEMA DE CACHÉ (Tu código original para que funcione sin internet)
// =========================================================================
const CACHE = "angelesnails-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/admin.html",
  "/css/style.css",
  "/css/admin.css",
  "/js/app.js",
  "/js/admin.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// =========================================================================
// 2. SISTEMA DE NOTIFICACIONES (Firebase Cloud Messaging)
// =========================================================================
// Importar los scripts compatibles de Firebase
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuración de tu Firebase
firebase.initializeApp({
  authDomain: "angelesnails2007-9c995.firebaseapp.com",
  projectId: "angelesnails2007-9c995",
  storageBucket: "angelesnails2007-9c995.appspot.com",
  messagingSenderId: "860423923384"
});

const messaging = firebase.messaging();

// Capturar notificaciones en segundo plano (cuando la app está cerrada)
messaging.onBackgroundMessage((payload) => {
  console.log('Notificación recibida en segundo plano:', payload);

  const notificationTitle = payload.notification.title || "Angeles Nails 2007";
  const notificationOptions = {
    body: payload.notification.body || "Tienes una nueva actualización en el sistema.",
    icon: 'icons/icon-192.png', // Tu hermoso logo dorado circular
    badge: 'icons/icon-192.png',
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
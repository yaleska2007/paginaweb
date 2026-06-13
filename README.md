# ANGELESNAILS2007 — Nail Studio Premium 💅✨

> **Proyecto Académico de Innovación y Transformación Digital**  
> Desarrollado para la materia **Espíritu Emprendedor** (Año 2026).

---

## 📋 Información General del Proyecto

Este sistema ha sido diseñado, programado e implementado con el objetivo de automatizar, digitalizar y optimizar los procesos de captación de clientes, gestión de portafolio y administración de citas del negocio **AngelesNails2007**, impulsando su presencia en el mercado digital a través de tecnologías web de alto rendimiento.

* **Desarrollador / Programador Principal:** Gonzalo Javier Niño Amaris
* **Emprendedora / Propietaria del Negocio:** Yaleska Becerra
* **Enfoque Comercial:** Manicura Premium, Acrílicas, Semipermanente, Gel y Diseños Personalizados (Nail Art).

---

## 🚀 Justificación del Emprendimiento

En el marco de la materia **Espíritu Emprendedor**, *AngelesNails2007* nace de la necesidad de cerrar la brecha digital en los negocios de belleza locales. Tradicionalmente, la agendación de citas y el control de registros se realizan de forma manual o mediante conversaciones dispersas en redes sociales. 

Esta plataforma resuelve dicha problemática centralizando la experiencia del usuario mediante:
1. **Accesibilidad 24/7:** Las clientas pueden explorar servicios, tarifas y portafolios en tiempo real desde cualquier dispositivo móvil.
2. **Optimización del Tiempo:** Reducción de mensajes cruzados innecesarios mediante un sistema dinámico de pre-agendamiento estructurado.
3. **Control Centralizado:** Un panel de administración exclusivo para la emprendedora que elimina el uso de cuadernos físicos, permitiendo una proyección organizada del negocio.

---

## 🛠️ Arquitectura y Módulos del Sistema

La solución se divide en dos grandes bloques de software interconectados:

### 1. Plataforma Pública (Landing Page de Clientes)
* **Diseño Mobile-First:** Interfaz elegante, minimalista y responsiva que adapta la tipografía y los elementos visuales a cualquier pantalla.
* **Formulario Adaptativo de Reservas:** Permite a la usuaria ingresar su nombre, contacto y describir de forma libre o exacta el diseño o técnica que desea, automatizando la apertura de un chat directo de WhatsApp con la información pre-llenada.
* **Módulo de Reseñas Interactivo:** Sistema de calificación por estrellas donde las clientas reales pueden dar feedback de los servicios recibidos, generando prueba social y confianza.
* **Galería Dinámica Estilo Masonry:** Portafolio visual adaptativo optimizado para la carga veloz de imágenes en alta resolución del Nail Art realizado.

### 2. Panel de Control Privado (Dashboard PWA Admin)
* **Conversión a PWA (Progressive Web App):** Configurado con un Manifiesto de Aplicación Web exclusivo (`manifest.json`) que permite instalar el panel administrativo directamente en la pantalla de inicio del celular de la emprendedora como una app nativa, con su propio icono dorado personalizado.
* **Persistencia de Datos:** Conexión directa a la base de datos para monitorear el estatus de las solicitudes, reseñas y configuraciones globales de la ubicación y horarios del salón.

---

## 💻 Stack Tecnológico Utilizado

* **Frontend:** HTML5, CSS3 Semántico (Animaciones fluidas y variables de diseño personalizadas), JavaScript Moderno (ES6+ Vanilla).
* **Fuentes y Estilos Visuales:** Google Fonts (*Playfair Display* & *Jost*), FontAwesome v6.5.0 para iconografía de alta fidelidad.
* **Backend como Servicio (BaaS):** Google Firebase (Cloud Firestore para la base de datos NoSQL distribuida).
* **Despliegue e Infraestructura:** Firebase Hosting con SSL integrado para conexiones seguras (HTTPS).
* **Control de Versiones:** Git y repositorio centralizado en GitHub para el despliegue continuo.

---

## 📁 Estructura del Repositorio

El proyecto mantiene una arquitectura de archivos limpia y modular:

```text
ANGELESNAILS2007/
│
├── css/
│   ├── admin.css           # Estilos exclusivos del panel de administración
│   └── style.css           # Estilos globales de la landing page pública
│
├── icons/
│   ├── icon-192.png        # Icono de la app instalable (Tamaño mediano)
│   └── icon-512.png        # Icono de la app instalable (Tamaño completo)
│
├── js/
│   ├── admin.js            # Lógica y control del Dashboard administrativo
│   ├── app.js              # Lógica general de navegación y vistas de usuario
│   ├── firebase-config.js  # Credenciales y conexión segura con Firestore
│   └── login.js            # Control de accesos al panel administrativo
│
├── admin.html              # Estructura del Panel de Control
├── index.html              # Estructura de la Landing Page de Clientes
├── login.html              # Pantalla de acceso restringido para el Admin
├── manifest.json           # Configuración PWA para la app instalable en celular
└── README.md               # Documentación oficial del sistema
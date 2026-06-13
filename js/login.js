import { auth } from "./firebase-config.js";
// Versión unificada a la 11.9.1 para evitar conflictos con tu config
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"; 

// Capturamos los elementos del HTML mediante sus IDs
const btnLogin      = document.getElementById("btn-login");
const forgotLink    = document.getElementById("forgot-link");
const emailInput    = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Lógica para procesar el inicio de sesión
btnLogin?.addEventListener("click", async () => {
  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Por favor, completa todos los campos del formulario.");
    return;
  }

  try {
    // Intentar autenticar en Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    
    // Si la contraseña es correcta, viaja directo al panel
    window.location.href = "admin.html"; 
  } catch (error) {
    console.error("Error capturado en el login:", error);
    
    // Alertas descriptivas según el tipo de fallo
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      alert("Acceso denegado: El correo o la contraseña son incorrectos.");
    } else {
      alert("Error al conectar con el servidor de seguridad. Intenta de nuevo.");
    }
  }
});

// Lógica para enviar el correo de recuperación
forgotLink?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!email) {
    alert("Escribe primero tu correo electrónico en el campo superior para enviarte las instrucciones de recuperación.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("¡Enlace enviado! Revisa tu correo electrónico (o la carpeta de Spam) para restablecer tu contraseña de inmediato.");
  } catch (error) {
    console.error("Error al recuperar cuenta:", error);
    alert("No pudimos enviar el correo de restauración. Verifica que la dirección esté bien escrita.");
  }
});
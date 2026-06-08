import { auth } from "./firebase-config.js";

import {
signInWithEmailAndPassword,
sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

window.login = async function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location =
"admin.html";

}
catch(error){

alert(error.message);

}

}

window.resetPassword =
async function(){

const email =
prompt(
"Ingrese su correo"
);

if(!email) return;

try{

await sendPasswordResetEmail(
auth,
email
);

alert(
"Correo enviado"
);

}
catch(error){

alert(
error.message
);

}

}
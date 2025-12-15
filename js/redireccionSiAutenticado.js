// js/redireccionSiAutenticado.js
// Este archivo evita que usuarios ya logueados accedan a la página de login

// Función que verifica si el usuario ya tiene una sesión activa
const redireccionSiAutenticado = () => {
    // Verificamos si existe el item 'nombre' en localStorage
    // Si existe, significa que el usuario ya inició sesión anteriormente
    if (localStorage.getItem("nombre")) {
        // Si ya está autenticado, lo redirigimos a la página principal
        // Esto evita que vea el formulario de login innecesariamente
        window.location.href = "./index.html";
    }
}

// Ejecutamos la función inmediatamente cuando se carga la página de login
// Esto hace la verificación tan pronto como el usuario entra a login.html
redireccionSiAutenticado();
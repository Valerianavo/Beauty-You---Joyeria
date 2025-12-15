// js/verificarSesion.js
// Este archivo verifica si el usuario tiene sesión activa en páginas protegidas

// Función que verifica si el usuario está logueado
const verificarSesion = () => {
    // Verificamos si existe el item 'nombre' en localStorage
    // Si no existe, significa que el usuario no ha iniciado sesión
    if (!localStorage.getItem("nombre")) {
        // Mostramos un mensaje al usuario informando que necesita iniciar sesión
        alert("Debes iniciar sesión para acceder a esta página");
        // Redirigimos al usuario a la página de login
        window.location.href = "./login.html";
        // Retornamos false para indicar que no hay sesión
        return false;
    }
    // Si hay sesión, retornamos true
    return true;
}

// Ejecutamos la verificación cuando se carga la página
// Esta función debe llamarse en carrito.html y otras páginas que requieran login
verificarSesion();
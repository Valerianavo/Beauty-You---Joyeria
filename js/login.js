// js/login.js
// Este archivo maneja la lógica del formulario de login

// Capturamos el formulario de login usando el selector CSS
// #login form significa: busca un form que esté dentro de un elemento con id="login"
const formularioLogin = document.querySelector("#login form");
// Capturamos el elemento donde mostraremos mensajes al usuario
const mensaje = document.querySelector("#mensajeLogin");

// Función que se ejecuta cuando el usuario envía el formulario
const manejarEnvioLogin = (evento) => {
    // Prevenimos el comportamiento por defecto del formulario
    // Sin esto, la página se recargaría y perderíamos los datos
    evento.preventDefault();
    
    // Obtenemos los valores que el usuario ingresó en los campos
    // evento.target es el formulario que disparó el evento
    // elements es una colección de todos los campos del formulario
    // Accedemos por el atributo 'name' de cada input
    let emailFormulario = evento.target.elements.email.value;          // Valor del campo email
    let contraseñaFormulario = evento.target.elements.contraseña.value; // Valor del campo contraseña

    // Verificamos si las credenciales coinciden con las predefinidas
    // && significa "Y" - ambas condiciones deben ser verdaderas
    if (emailFormulario === USUARIO_LOGIN.email && contraseñaFormulario === USUARIO_LOGIN.contraseña) {
        // CREDENCIALES CORRECTAS:
        
        // 1. Guardamos el NOMBRE del usuario en localStorage para mostrar en el navbar
        localStorage.setItem("nombre", USUARIO_LOGIN.nombre);
        
        // 2. Guardamos el email en localStorage para crear la sesión (se mantiene para verificaciones)
        localStorage.setItem("email", emailFormulario);
        
        // 3. Inicializamos el carrito como un array vacío
        // JSON.stringify convierte el array a string para guardarlo en localStorage
        localStorage.setItem("carrito", JSON.stringify([]));
        
        // 4. Inicializamos la cantidad total de productos en 0
        localStorage.setItem("cantidad", "0");
        
        // 5. Redirigimos al usuario a la página principal
        window.location.href = "./index.html";
        
    } else {
        // CREDENCIALES INCORRECTAS:
        // Mostramos un mensaje de error al usuario
        mensaje.innerText = "Por favor introduce credenciales válidas.";
    }
}

// Agregamos un listener de eventos al formulario
// Cuando el usuario haga submit (envíe el formulario), se ejecutará manejarEnvioLogin
formularioLogin.addEventListener("submit", manejarEnvioLogin);
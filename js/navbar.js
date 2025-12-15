// navbar.js 

// Array con las categorías del ecommerce
const categorias = ['Aretes', 'Collares', 'Anillos', 'Pulseras', 'Relojes'];

// Agregamos primero el botón Home
// Variable para almacenar el menú
let menu = `
  <li class="nav-item">
    <a class="nav-link px-3 text-light home-link" href="./index.html">Home</a>
  </li>
  `;

// Creamos un bucle para generar cada enlace del menú
for (let categoria of categorias) {
  menu += `
    <li class="nav-item">
      <a class="nav-link px-3 text-light categoria-link" href="#" data-categoria="${categoria}">${categoria}</a>
    </li>`;
}

// Variable para almacenar la sección de sesión del usuario 
let sesion = `
  <ul class="navbar-nav sesion align-items-center">
    ${
      localStorage.getItem("email") 
        ? 
        // SI HAY SESIÓN ACTIVA: Mostramos el NOMBRE del usuario
        `<li class="nav-item">
            <span class="nav-link text-light" style="padding: 8px 16px;">
                <i class="bi bi-person-circle me-1"></i>Hola, ${localStorage.getItem("nombre") || "Usuario"}
            </span>
         </li>

         <li class="nav-item">
          <a class="nav-link text-light" href="./historial.html" style="padding: 8px 16px;">
              <i class="bi bi-clock-history me-1"></i>Pedidos
          </a>
        </li>
         
         <li class="nav-item ms-2">
            <a href="./carrito.html" class="nav-link text-light d-flex align-items-center" style="text-decoration: none;">
                <img height="25" src="./img/carrito.png" alt="Carrito" class="me-1" />
                <span id="cantidad-carrito" class="badge bg-light text-dark">${localStorage.getItem("cantidad") || "0"}</span>
            </a>
         </li>
         <li class="nav-item">
            <span class="nav-link text-light" onclick="cerrarSesion()" style="cursor: pointer; padding: 8px 16px;">
                <i class="bi bi-box-arrow-right me-1"></i>Cerrar sesión
            </span>
         </li>
         `
        : 
        // NO HAY SESIÓN ACTIVA: Mostramos enlace para iniciar sesión
        `<li class="nav-item">
            <a class="nav-link px-3 text-light" href="./login.html">
                <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
            </a>
         </li>`
    }
  </ul>`;

// Obtenemos el elemento header del HTML
const header = document.querySelector("header");

// Insertamos el navbar completo dentro del header
header.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style="background-color: #1a1a1a; border-bottom: 1px solid #333;">
  <div class="container">
    <!-- Nombre de la tienda -->
    <a class="navbar-brand fw-bold fs-3" href="./index.html" style="color: #e0e0e0; letter-spacing: 1px;">Beauty You</a>
    
    <!-- Boton que se visualiza cuando la pagina se ve a atraves de dispositivos moviles -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style="border-color: #555;">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <!-- Contenedor para dispositivos móviles -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <!-- Menú de categorías -->
      <ul class="navbar-nav ms-auto">
        ${menu}
      </ul>
      <!-- Sección de sesión del usuario -->
      ${sesion}
    </div>
  </div>
</nav>`;

// 

// Función para cerrar la sesión del usuario
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "./index.html";
}

// FUNCIÓN PARA MANEJAR CLICKS EN CATEGORÍAS
function manejarClickCategoria(evento) {
    evento.preventDefault();
    // Evita que el clic siga propagándose a elementos padres, previene comportamientos inesperados del navbar (como cierres, recargas o doble ejecución)
    evento.stopPropagation();
    
    const categoria = evento.target.dataset.categoria;
    console.log('Categoría clickeada:', categoria);
    
    // Siempre redirigir a index.html con la categoría como parámetro
    window.location.href = `./index.html?categoria=${categoria}`;
}


// CONFIGURACIÓN SIMPLE Y EFECTIVA DE EVENT LISTENERS
function configurarCategorias() {
    console.log('Configurando categorías...');
    
    const enlaces = document.querySelectorAll('.categoria-link');
    console.log('📎 Enlaces encontrados:', enlaces.length);
    
    enlaces.forEach(enlace => {
        enlace.onclick = manejarClickCategoria;
    });
}

// EJECUTAR INMEDIATAMENTE Y PERIÓDICAMENTE
configurarCategorias();

// Ejecutar cada vez que el usuario interactúe con la página
document.addEventListener('click', function() {
    setTimeout(configurarCategorias, 100);
});

// Reconfigurar cada segundo por si acaso
setInterval(configurarCategorias, 1000);
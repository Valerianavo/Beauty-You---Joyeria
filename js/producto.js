// js/producto.js
// Este archivo maneja la visualización y funcionalidad del detalle del producto

// Función principal que se ejecuta cuando se carga la página
function mostrarDetalleProducto() {
  // Obtenemos los parámetros de la URL para saber qué producto mostrar
  const parametrosURL = new URLSearchParams(window.location.search);
  // Extraemos el ID del producto de la URL (ej: producto.html?prod=1)
  const idProducto = parseInt(parametrosURL.get("prod"));
  // Buscamos el producto en el array de datos usando el ID
  const producto = data.find((prod) => prod.id === idProducto);

  // Si no encontramos el producto, mostramos un mensaje de error
  if (!producto) {
    document.getElementById("detalleProducto").innerHTML = `
            <div class="alert alert-danger">
                Producto no encontrado
            </div>
        `;
    return; // Salimos de la función
  }

  // Verificamos si el usuario está logueado buscando el email en localStorage
  const estaLogueado = localStorage.getItem("email");

  // Generamos el HTML para mostrar el detalle del producto
  document.getElementById("detalleProducto").innerHTML = `
        <br><div class="row justify-content-center">
        <br><div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="row g-0">
                        <!-- Columna de la imagen  -->
                        <div class="col-md-5">
                            <img src="${
                              producto.imagen
                            }" class="img-fluid rounded-start h-100" alt="${
    producto.nombre
  }" style="object-fit: cover; max-height: 350px;">
                        </div>
                        
                        <!-- Columna de la información -->
                        <div class="col-md-7">
                            <div class="card-body p-4">
                                <!-- Header compacto -->
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <h4 class="card-title fw-bold text-dark mb-0">${
                                      producto.nombre
                                    }</h4>
                                    <span class="badge bg-light text-dark border">${
                                      producto.categoria
                                    }</span>
                                </div>
                                
                                <!-- Precio destacado -->
                                <div class="mb-3">
                                    <h5 class="text-primary mb-4">$${producto.precio.toLocaleString()}</h5>
                                    <h6 class="text-muted">Stock disponible: ${
                                      producto.stock
                                    }</h6>
                                </div>
                                
                                <!-- Descripción más compacta -->
                                <h6>Descripción</h6>
                                <p class="card-text text-muted mb-4" style="font-size: 0.9rem;">
                                    ${producto.descripcion}
                                </p>
                               

                               

                                ${
                                  estaLogueado
                                    ? // SI ESTÁ LOGUEADO: Mostramos controles para comprar
                                      `<div class="border-top pt-3">
                                        <div class="row align-items-center">
                                            <div class="col-auto">
                                                <label class="form-label fw-semibold mb-2">Cantidad:</label>
                                                <div class="input-group input-group-sm" style="width: 130px;">
                                                    <button class="btn btn-outline-secondary" type="button" onclick="disminuirCantidad()">-</button>
                                                    <input type="number" class="form-control text-center" value="1" min="1" max="${producto.stock}" id="contador">
                                                    <button class="btn btn-outline-secondary" type="button" onclick="aumentarCantidad()">+</button>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-dark w-100" onclick="confirmarAgregarAlCarrito(${producto.id})">
                                                    <i class="bi bi-cart-plus"></i> Agregar al Carrito
                                                </button>
                                            </div>
                                        </div>
                                    </div>`
                                    : // SI NO ESTÁ LOGUEADO: Mostramos mensaje para iniciar sesión
                                      `<div class="alert alert-light border text-center py-3">
                                        <small class="text-muted">
                                            <a href="./login.html" class="text-decoration-none fw-semibold">Inicia sesión</a> 
                                            para agregar productos al carrito
                                        </small>
                                    </div>`
                                }

                                <div class="col">
                                    <button class="btn btn-outline-secondary w-100 mt-2" onclick="window.history.back()">
                                        🠀 Seguir explorando
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar confirmación con SweetAlert2 antes de agregar al carrito -- CLASE 25
function confirmarAgregarAlCarrito(idProducto) {
  // Capturamos el input del contador para saber cuántas unidades agregar
  const contador = document.querySelector("#contador");
  const cantidad = Number(contador.value);

  // Obtenemos información del producto para mostrar en la confirmación
  const producto = data.find((prod) => prod.id === idProducto);

  // Mostramos SweetAlert de confirmación
  Swal.fire({
    title: "¿Estás seguro?",
    html: `
            <div class="text-start">
                <p>Vas a agregar al carrito:</p>
                <p><strong>${producto.nombre}</strong></p>
                <p><strong>Cantidad:</strong> ${cantidad}</p>
                <p><strong>Total:</strong> $${(
                  producto.precio * cantidad
                ).toLocaleString()}</p>
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Sí, agregar al carrito",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#4c8a4cff",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, procedemos a agregar al carrito
      agregarAlCarrito(idProducto);
    } else if (result.isDismissed) {
      // Si el usuario cancela, mostramos un mensaje informativo
      Swal.fire({
        title: "Cancelado X",
        text: "El producto no fue agregado al carrito",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// Función para aumentar la cantidad del producto CON VALIDACIÓN DE STOCK
function aumentarCantidad() {
  // Capturamos el elemento input del contador
  const contador = document.querySelector("#contador");
  // Obtenemos el ID del producto desde la URL
  const parametrosURL = new URLSearchParams(window.location.search);
  const idProducto = parseInt(parametrosURL.get("prod"));
  // Buscamos el producto en los datos para obtener su stock
  const producto = data.find((prod) => prod.id === idProducto);

  // Convertimos el valor actual del contador a número
  let valorActual = Number(contador.value);

  // VALIDACIÓN: Verificamos que la cantidad no supere el stock disponible
  if (valorActual < producto.stock) {
    // Si hay stock disponible, aumentamos la cantidad en 1
    contador.value = valorActual + 1;
  } else {
    // Si no hay stock, mostramos un mensaje al usuario
    mostrarNotificacionToastify("No hay suficiente stock disponible", "error");
  }
}

// Función para disminuir la cantidad del producto CON VALIDACIÓN DE MÍNIMO
function disminuirCantidad() {
  // Capturamos el elemento input del contador
  const contador = document.querySelector("#contador");
  // Convertimos el valor actual a número
  let valorActual = Number(contador.value);

  // VALIDACIÓN: Verificamos que la cantidad no sea menor a 1
  if (valorActual > 1) {
    // Si es mayor a 1, disminuimos la cantidad en 1
    contador.value = valorActual - 1;
  }
  // Si es 1 o menos, no hacemos nada (ya está en el mínimo)
}

// Función para mostrar notificaciones con Toastify.js -- CLASE 25
function mostrarNotificacionToastify(mensaje, tipo = "success") {
  let backgroundColor = "";

  switch (tipo) {
    case "success":
      backgroundColor = "linear-gradient(to right, #4c8a4cff)";
      break;
    case "error":
      backgroundColor = "linear-gradient(to right, #ff5f6d)";
      break;
    case "warning":
      backgroundColor = "linear-gradient(to right, #eea849)";
      break;
    default:
      backgroundColor = "linear-gradient(to right, #00b09b)";
  }

  // Crear toast con HTML personalizado
  const toast = Toastify({
    text: mensaje,
    duration: 5000,
    gravity: "top",
    position: "right",
    backgroundColor: backgroundColor,
    stopOnFocus: true,
    close: true,
    offset: {
      x: 20,
      y: 70,
    },
  });

  // Agregar estilos CSS para el botón de cerrar
  if (!document.querySelector("#toastify-styles")) {
    const style = document.createElement("style");
    style.id = "toastify-styles";
    style.textContent = `
            .toastify-close {
                color: white !important;
                opacity: 0.8 !important;
                font-size: 16px !important;
                padding: 4px !important;
                margin-left: 10px !important;
            }
            .toastify-close:hover {
                opacity: 1 !important;
                background: rgba(255,255,255,0.1) !important;
            }
        `;
    document.head.appendChild(style);
  }

  toast.showToast();
}

// Función para agregar productos al carrito CON VALIDACIONES
function agregarAlCarrito(idProducto) {
  // Capturamos el input del contador para saber cuántas unidades agregar
  const contador = document.querySelector("#contador");
  // Convertimos el valor a número
  const cantidad = Number(contador.value);

  // VALIDACIÓN 1: Verificamos que la cantidad sea al menos 1
  if (cantidad < 1) {
    mostrarNotificacionToastify("La cantidad mínima es 1", "error");
    return; // Salimos de la función sin agregar al carrito
  }

  // Obtenemos el carrito actual desde localStorage
  // Si no existe carrito, creamos un array vacío
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  // Buscamos el producto completo en los datos
  const producto = data.find((prod) => prod.id === idProducto);

  // VALIDACIÓN 2: Verificamos que haya suficiente stock disponible
  if (cantidad > producto.stock) {
    mostrarNotificacionToastify(
      `No hay suficiente stock. Stock disponible: ${producto.stock}`,
      "error"
    );
    return; // Salimos de la función sin agregar al carrito
  }

  // Verificamos si el producto ya existe en el carrito
  const productoExistenteIndex = carrito.findIndex(
    (item) => item.id === idProducto
  );

  if (productoExistenteIndex !== -1) {
    // SI EL PRODUCTO YA EXISTE EN EL CARRITO:
    // Calculamos la nueva cantidad total (lo que ya tenía + lo nuevo)
    const nuevaCantidadTotal =
      carrito[productoExistenteIndex].cantidad + cantidad;

    // VALIDACIÓN 3: Verificamos que la nueva cantidad total no supere el stock
    if (nuevaCantidadTotal > producto.stock) {
      mostrarNotificacionToastify(
        `No puedes agregar más de ${producto.stock} unidades de este producto`,
        "error"
      );
      return; // Salimos de la función sin actualizar el carrito
    }

    // Si pasa todas las validaciones, actualizamos la cantidad
    carrito[productoExistenteIndex].cantidad = nuevaCantidadTotal;
  } else {
    // SI EL PRODUCTO NO EXISTE EN EL CARRITO:
    // Agregamos el producto completo al carrito con la cantidad seleccionada
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      cantidad: cantidad,
    });
  }

  // Guardamos el carrito actualizado en localStorage
  // JSON.stringify convierte el array a string para poder guardarlo
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizamos la cantidad total mostrada en el navbar
  actualizarCantidadTotal();

  // Mostramos notificación de éxito con Toastify
  mostrarNotificacionToastify(
    `${cantidad} ${producto.nombre} agregado(s) al carrito`
  );

  // Opcional: Resetear el contador a 1 después de agregar
  contador.value = 1;
}

// Función para actualizar la cantidad total de productos en el navbar
function actualizarCantidadTotal() {
  // Obtenemos el carrito actual desde localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Calculamos la cantidad total de productos en el carrito
  // reduce() recorre el array y acumula la suma de todas las cantidades
  const cantidadTotal = carrito.reduce((acumulado, productoActual) => {
    // Sumamos la cantidad de cada producto al acumulador
    return acumulado + productoActual.cantidad;
  }, 0); // 0 es el valor inicial del acumulador

  // Guardamos la cantidad total en localStorage para persistencia
  localStorage.setItem("cantidad", cantidadTotal.toString());

  // Actualizamos el elemento en el navbar que muestra la cantidad
  const cantidadElemento = document.querySelector("#cantidad-carrito");
  if (cantidadElemento) {
    // Actualizamos el texto con la nueva cantidad total
    cantidadElemento.innerText = cantidadTotal;
  }
}

// Ejecutamos la función para mostrar el detalle cuando se carga la página
mostrarDetalleProducto();

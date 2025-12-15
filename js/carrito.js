// js/carrito.js
// Este archivo maneja la visualización y funcionalidad del carrito de compras
// URL deL MockAPI
const MOCKAPI_URL = "https://691b9fb53aaeed735c8dc5d5.mockapi.io/orders";

// Función para mostrar notificaciones con Toastify.js CLASE 25
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

  // Crear toast con HTML
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
// Función principal que se ejecuta cuando se carga la página del carrito
function mostrarCarrito() {
  // Obtenemos el contenedor donde mostraremos el carrito
  const contenedorCarrito = document.getElementById("contenedorCarrito");

  // Obtenemos el carrito desde localStorage
  // Si no existe carrito, creamos un array vacío
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificamos si el carrito está vacío
  if (carrito.length === 0) {
    // Si está vacío, mostramos un mensaje para agregar productos al carrito
    contenedorCarrito.innerHTML = `
            <div class="empty-cart text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                </div>
                <h3 class="text-muted mb-3">Tu carrito está vacío</h3>
                <p class="text-muted mb-4">Agrega algunos productos increíbles a tu carrito.</p>
                <a href="./index.html" class="btn btn-dark">
                    <i class="bi bi-bag me-2"></i>Explorar productos
                </a>
            </div>
        `;
    return; // Salimos de la función
  }

  // Calculamos el total del carrito sumando precio * cantidad de cada producto
  const totalCarrito = carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0); // 0 es el valor inicial del acumulador

  // Generamos el HTML para mostrar los productos del carrito
  let htmlCarrito = `
        <div class="row">
            <!-- Lista de productos -->
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">Productos en el carrito (${carrito.length})</h5>
                    </div>
                <div class="card-body p-0">
    `;

  // Agregamos cada producto al HTML del carrito
  carrito.forEach((producto, index) => {
    // Buscamos el producto original en data.js para obtener el stock real
    const productoOriginal = data.find((prod) => prod.id === producto.id);
    // Calculamos el subtotal de este producto (precio * cantidad)
    const subtotal = producto.precio * producto.cantidad;

    htmlCarrito += `
            <div class="cart-item border-bottom p-3">
                <div class="row align-items-center">
                    <!-- Imagen del producto -->
                    <div class="col-2">
                        <img src="${producto.imagen}" alt="${
      producto.nombre
    }" class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                    </div>
                    
                    <!-- Información del producto -->
                    <div class="col-4">
                        <h6 class="fw-bold mb-1">${producto.nombre}</h6>
                        <small class="text-muted">${producto.categoria}</small>
                        <p class="mb-0 text-primary fw-bold">$${producto.precio.toLocaleString()}</p>
                        <!-- Mostramos el stock disponible del producto -->
                        <small class="text-muted">Stock disponible: ${
                          productoOriginal.stock
                        }</small>
                    </div>
                    
                    <!-- Controles de cantidad CON VALIDACIÓN DE STOCK -->
                    <div class="col-3">
                        <div class="input-group input-group-sm">
                            <!-- Botón para disminuir cantidad -->
                            <button class="btn btn-outline-secondary" 
                                    type="button" 
                                    onclick="actualizarCantidad(${index}, ${
      producto.cantidad - 1
    })">
                                -
                            </button>
                            <!-- Input para mostrar y editar cantidad -->
                            <input type="number" 
                                   class="form-control text-center" 
                                   value="${producto.cantidad}" 
                                   min="1" 
                                   max="${productoOriginal.stock}"
                                   onchange="actualizarCantidad(${index}, parseInt(this.value))">
                            <!-- Botón para aumentar cantidad -->
                            <button class="btn btn-outline-secondary" 
                                    type="button" 
                                    onclick="actualizarCantidad(${index}, ${
      producto.cantidad + 1
    })">
                                +
                            </button>
                        </div>
                    </div>
                    
                    <!-- Subtotal y eliminar -->
                    <div class="col-3 text-end">
                        <p class="fw-bold mb-1">$${subtotal.toLocaleString()}</p>
                        <!-- Botón para eliminar producto del carrito -->
                        <button class="btn btn-outline-danger btn-sm" 
                                onclick="confirmarEliminarProducto(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  });

  // Cerramos la sección de productos y agregamos el resumen
  htmlCarrito += `
                    </div>
                </div>
            </div>
            
            <!-- Resumen del pedido -->
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">Resumen del pedido</h5>
                    </div>
                    <div class="card-body">
                        <!-- Subtotal -->
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>$${totalCarrito.toLocaleString()}</span>
                        </div>
                        
                        <!-- Envío -->
                        <div class="d-flex justify-content-between mb-2">
                            <span>Envío:</span>
                            <span class="text-success">Gratis</span>
                        </div>
                        
                        <!-- Línea divisoria -->
                        <hr>
                        
                        <!-- Total -->
                        <div class="d-flex justify-content-between mb-3 fw-bold fs-5">
                            <span>Total:</span>
                            <span>$${totalCarrito.toLocaleString()}</span>
                        </div>
                        
                        <!-- Botón de checkout -->
                        <button class="btn btn-dark w-100 mb-3" onclick="confirmarProcederPago()">
                            <i class="bi bi-credit-card me-2"></i>Proceder al pago
                        </button>
                        
                        <!-- Botón para limpiar carrito -->
                        <button class="btn btn-outline-danger w-100" onclick="confirmarLimpiarCarrito()">
                            <i class="bi bi-trash me-2"></i>Vaciar carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Insertamos todo el HTML generado en el contenedor
  contenedorCarrito.innerHTML = htmlCarrito;
}

// Función para confirmar eliminar producto con SweetAlert2
function confirmarEliminarProducto(indice) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito[indice];

  if (!producto) {
    mostrarNotificacionToastify("Error: Producto no encontrado", "error");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    html: `
            <div class="text-start">
                <p>Vas a eliminar del carrito:</p>
                <p><strong>${producto.nombre}</strong></p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Subtotal:</strong> $${(
                  producto.precio * producto.cantidad
                ).toLocaleString()}</p>
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarProducto(indice);
    } else if (result.isDismissed) {
      mostrarNotificacionToastify("Eliminación cancelada", "info");
    }
  });
}

// Función para confirmar vaciar carrito con SweetAlert2
// Función para confirmar proceder al pago con SweetAlert2
function confirmarProcederPago() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalCarrito = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );

  if (carrito.length === 0) {
    mostrarNotificacionToastify("El carrito está vacío", "warning");
    return;
  }

  // Generar lista de productos con cantidades
  const listaProductos = carrito
    .map(
      (producto) =>
        `<div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
       <div>
         <strong>${producto.nombre}</strong>
         <br>
         <small class="text-muted">Cantidad: ${producto.cantidad}</small>
       </div>
       <div class="text-end">
         <small>$${(
           producto.precio * producto.cantidad
         ).toLocaleString()}</small>
       </div>
     </div>`
    )
    .join("");

  Swal.fire({
    title: "¿Confirmar Pedido?",
    html: `
      <div class="text-start">
        <p>Estás a punto de confirmar tu pedido de:</p>
        
        <!-- Lista de productos -->
        <div class="mb-3" style="max-height: 200px; overflow-y: auto;">
          <h6 class="fw-bold mb-2">Productos en el carrito:</h6>
          ${listaProductos}
        </div>
        
        <!-- Resumen -->
        <div class="border-top pt-2">
          <div class="d-flex justify-content-between">
            <strong>Total productos:</strong>
            <strong>${carrito.length}</strong>
          </div>
          <div class="d-flex justify-content-between mt-1">
            <strong>Total a pagar:</strong>
            <strong class="text-primary">$${totalCarrito.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar mi pedido",
    cancelButtonText: "Seguir comprando",
    confirmButtonColor: "#198754",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
    width: "600px",
  }).then((result) => {
    if (result.isConfirmed) {
      procederPago();
    } else if (result.isDismissed) {
      mostrarNotificacionToastify("Puedes seguir agregando productos", "info");
    }
  });
}

// Función para actualizar la cantidad de un producto EN EL CARRITO CON VALIDACIONES
function actualizarCantidad(indice, nuevaCantidad) {
  // VALIDACIÓN 1: Verificamos que la cantidad sea un número válido
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
    // Si no es válida, establecemos el mínimo en 1
    nuevaCantidad = 1;
    mostrarNotificacionToastify("La cantidad mínima es 1", "error");
    return; // Salimos de la función
  }

  // Obtenemos el carrito actual desde localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificamos que el índice sea válido (que el producto exista en el carrito)
  if (carrito[indice]) {
    // Buscamos el producto original en data.js para verificar el stock real
    const productoOriginal = data.find(
      (prod) => prod.id === carrito[indice].id
    );

    // VALIDACIÓN 2: Verificamos que la nueva cantidad no supere el stock disponible
    if (nuevaCantidad > productoOriginal.stock) {
      mostrarNotificacionToastify(
        `No hay suficiente stock. Máximo disponible: ${productoOriginal.stock}`,
        "error"
      );

      // Forzamos el valor máximo permitido (el stock disponible)
      nuevaCantidad = productoOriginal.stock;

      // Actualizamos el input visualmente para que muestre el máximo permitido
      const inputs = document.querySelectorAll('input[type="number"]');
      if (inputs[indice]) {
        inputs[indice].value = productoOriginal.stock;
      }
    }

    // Si pasa todas las validaciones, actualizamos la cantidad en el carrito
    carrito[indice].cantidad = nuevaCantidad;

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizamos la cantidad total en el navbar
    actualizarCantidadTotal();

    // Recargamos la vista del carrito para mostrar los cambios
    mostrarCarrito();

    // Mostramos notificación de éxito
    mostrarNotificacionToastify("Cantidad actualizada correctamente");
  } else {
    // Si el índice no es válido, mostramos error
    mostrarNotificacionToastify(
      "Error: Producto no encontrado en el carrito",
      "error"
    );
  }
}

// Función para eliminar un producto del carrito (ahora se llama desde SweetAlert)
function eliminarProducto(indice) {
  // Obtenemos el carrito actual desde localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificamos que el índice sea válido
  if (carrito[indice]) {
    // Obtenemos el nombre del producto para el mensaje
    const nombreProducto = carrito[indice].nombre;

    // Eliminamos el producto del carrito usando splice
    // splice(indice, 1) elimina 1 elemento en la posición del índice
    carrito.splice(indice, 1);

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizamos la cantidad total en el navbar
    actualizarCantidadTotal();

    // Recargamos la vista del carrito para mostrar los cambios
    mostrarCarrito();

    // Mostramos notificación de éxito
    mostrarNotificacionToastify(`${nombreProducto} eliminado del carrito`);
  } else {
    mostrarNotificacionToastify("Error: Producto no encontrado", "error");
  }
}

// Función para limpiar todo el carrito (ahora se llama desde SweetAlert)
function limpiarCarrito() {
  // Limpiamos el carrito guardando un array vacío
  localStorage.setItem("carrito", JSON.stringify([]));
  // Reseteamos la cantidad total a 0
  localStorage.setItem("cantidad", "0");

  // Actualizamos la cantidad en el navbar
  actualizarCantidadTotal();

  // Recargamos la vista del carrito (mostrará el carrito vacío)
  mostrarCarrito();

  // Mostramos notificación de éxito
  mostrarNotificacionToastify("Carrito vaciado correctamente");
}

// Función para proceder al pago con Fetch API - CLASE 28
function procederPago() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const usuario = localStorage.getItem("email");

  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "Agrega productos al carrito antes de proceder al pago",
      icon: "warning",
      confirmButtonText: "Entendido",
    });
    return;
  }

  // Calcular total
  const totalCarrito = carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);

  // Datos para enviar a la API
  const ordenData = {
    user: usuario,
    items: carrito,
    total: totalCarrito,
    fecha: new Date().toISOString(),
  };

  // Mostrar loading en SweetAlert
  Swal.fire({
    title: "Procesando pedido...",
    text: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  // Hacer fetch POST a MockAPI
  fetch(MOCKAPI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ordenData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json();
    })
    .then((data) => {
      // ÉXITO: Mostrar SweetAlert con éxito
      Swal.fire({
        title: "¡Pedido creado exitosamente!",
        html: `
                <div class="text-start">
                    <p><strong>Usuario:</strong> ${usuario}</p>
                    <p><strong>Número de orden:</strong> #${data.id}</p>
                    <p><strong>Total:</strong> $${totalCarrito.toLocaleString()}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            `,
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#198754",
      }).then((result) => {
        if (result.isConfirmed) {
          // Limpiar carrito después de éxito
          limpiarCarrito();
          // Redirigir a home
          window.location.href = "./index.html";
        }
      });
    })
    .catch((error) => {
      // ERROR: Mostrar SweetAlert con error
      console.error("Error:", error);
      Swal.fire({
        title: "Error al procesar el pedido",
        text: "No se pudo crear la orden. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    })
    .finally(() => {
      // Este bloque se ejecuta siempre, haya éxito o error
      console.log("Proceso de checkout finalizado");
    });
}
// Función para actualizar la cantidad total en el navbar
function actualizarCantidadTotal() {
  // Obtenemos el carrito actual
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Calculamos la cantidad total de productos en el carrito
  const cantidadTotal = carrito.reduce((acumulado, productoActual) => {
    return acumulado + productoActual.cantidad;
  }, 0); // 0 es el valor inicial del acumulador

  // Guardamos la cantidad total en localStorage
  localStorage.setItem("cantidad", cantidadTotal.toString());

  // Actualizamos el elemento en el navbar que muestra la cantidad
  const cantidadElemento = document.querySelector("#cantidad-carrito");
  if (cantidadElemento) {
    cantidadElemento.innerText = cantidadTotal;
  }
}

// Ejecutamos la función cuando se carga la página del carrito
mostrarCarrito();

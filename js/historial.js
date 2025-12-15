// js/historial.js
// Este archivo maneja la visualización del historial de pedidos

const MOCKAPI_URL = 'https://691b9fb53aaeed735c8dc5d5.mockapi.io/orders';

// Función principal para cargar el historial
function cargarHistorialPedidos() {
    const usuarioActual = localStorage.getItem("email");
    
    if (!usuarioActual) {
        mostrarError("Debes iniciar sesión para ver tu historial");
        return;
    }

    // Mostrar loading
    document.getElementById('contenedorHistorial').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando pedidos...</span>
            </div>
            <p class="mt-3 text-muted">Cargando historial de pedidos...</p>
        </div>
    `;

    // Obtener pedidos del usuario actual
    fetch(`${MOCKAPI_URL}?user=${encodeURIComponent(usuarioActual)}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar pedidos');
            return response.json();
        })
        .then(pedidos => {
            if (pedidos.length === 0) {
                mostrarPedidosVacios();
            } else {
                mostrarPedidos(pedidos);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError("No se pudieron cargar los pedidos. Intenta más tarde.");
        });
}

// Función para mostrar pedidos
function mostrarPedidos(pedidos) {
    // Ordenar pedidos por fecha (más reciente primero)
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    let html = '';

    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="card order-card mb-4">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Orden #${pedido.id}</strong>
                        <span class="badge bg-success badge-estado ms-2">Completado</span>
                    </div>
                    <small class="text-muted">${fecha}</small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="fw-bold">Productos:</h6>
                            ${generarListaProductos(pedido.items)}
                        </div>
                        <div class="col-md-4 text-end">
                            <h5 class="text-primary">$${pedido.total.toLocaleString()}</h5>
                            <small class="text-muted">${pedido.items.length} producto(s)</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('contenedorHistorial').innerHTML = html;
}

// Función para generar lista de productos
function generarListaProductos(items) {
    if (!items || !Array.isArray(items)) {
        return '<p class="text-muted">No hay información de productos</p>';
    }

    let html = '';
    items.forEach((producto, index) => {
        html += `
            <div class="d-flex justify-content-between align-items-center py-1 ${index > 0 ? 'border-top' : ''}">
                <div>
                    <span class="fw-medium">${producto.nombre || 'Producto'}</span>
                    <small class="text-muted ms-2">x${producto.cantidad || 1}</small>
                </div>
                <span class="text-muted">$${producto.precio ? (producto.precio * (producto.cantidad || 1)).toLocaleString() : '0'}</span>
            </div>
        `;
    });

    return html;
}

// Función para cuando no hay pedidos
function mostrarPedidosVacios() {
    document.getElementById('contenedorHistorial').innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <h3 class="text-muted mt-3">Aún no tienes pedidos</h3>
            <p class="text-muted mb-4">Realiza tu primera compra para ver tu historial aquí.</p>
            <a href="./index.html" class="btn btn-dark">
                <i class="bi bi-bag me-2"></i>Explorar productos
            </a>
        </div>
    `;
}

// Función para mostrar errores
function mostrarError(mensaje) {
    document.getElementById('contenedorHistorial').innerHTML = `
        <div class="alert alert-danger text-center">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${mensaje}
        </div>
    `;
}

// Cargar historial cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarHistorialPedidos);
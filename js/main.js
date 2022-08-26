document.addEventListener('DOMContentLoaded', () => {

    // Variables

    //let baseDeDatos = [];

    let carrito = [];
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');

    const listaDeProductos = []


    fetch('data.json')
        .then((response) => response.json())
        .then((data) => {
            for (const producto of data) {
                listaDeProductos.push(new Producto(producto.id, producto.marca, producto.nombre, producto.precio, producto.stock, producto.img))
            }
            renderizarProductos(listaDeProductos)
        })

    // {
    //     id: 1,
    //     marca: "DOG CHOW",
    //     nombre: "ADULT PAVO",
    //     precio: 1800,
    //     stock: 10,
    //     img: "../image/food-dog-1.webp"
    // },
    // {
    //     id: 2,
    //     marca: "DOG CHOW",
    //     nombre: "CACHORRO",
    //     precio: 1200,
    //     stock: 8,
    //     img: "../image/food-dog-2.webp"
    // },
    // {
    //     id: 3,
    //     marca: "PEDIGREE",
    //     nombre: "DENTASTIX PEQUE",
    //     precio: 2100,
    //     stock: 5,
    //     img: "../image/food-dog-3.webp"
    // },
    // {
    //     id: 4,
    //     marca: "DOG CHOW",
    //     nombre: "ADULT CARNE",
    //     precio: 1200,
    //     stock: 1,
    //     img: "../image/food-dog-4.webp"
    // }


    // Funciones

    /* const URLGET = "./producto.json"
    //Agregamos un botón con jQuery
    $("body").prepend('<button id="btn1">GET</button>');
    //Escuchamos el evento click del botón agregado
    $("#btn1").click(() => { 
    $.get(URLGET, function (response, status) {
        if(status === "success"){
        baseDeDatos = response;
        renderizarProductos()
        }
        else{
            console.log('No encontramos el archivo de datos')
        }
    });
    }) */


    // Dibuja todos los productos a partir de la base de datos. No confundir con el carrito

    function renderizarProductos() {
        listaDeProductos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('grid-one', 'col-3', 'd-flex', 'justify-content-center', 'flex-column', 'containerCard');
            //Imagen
            const miNodoImagen = document.createElement('img')
            miNodoImagen.setAttribute('src', info.img)
            // Body
            const miNodoCardBody = document.createElement('div');
            // Marca
            const miNodoMarca = document.createElement('h5');
            miNodoMarca.classList.add('text-product-one');
            miNodoMarca.innerText = info.marca;
            // Nombre
            const miNodoNombre = document.createElement('p');
            miNodoNombre.classList.add('text-product-two');
            miNodoNombre.innerText = info.nombre;
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('text-product-three');
            miNodoPrecio.innerText = `$${info.precio}`;
            //Stock
            const miNodoStock = document.createElement('p');
            // miNodoStock.classList.add('card-text');
            // miNodoStock.innerText = `Stock: ${info.stock}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-food');
            miNodoBoton.innerText = 'BUY';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodo.append(miNodoImagen)
            miNodoCardBody.append(miNodoMarca);
            miNodoCardBody.append(miNodoNombre);
            miNodoCardBody.append(miNodoPrecio);
            miNodoCardBody.append(miNodoStock);
            miNodoCardBody.append(miNodoBoton);
            miNodo.append(miNodoCardBody);
            DOMitems.append(miNodo);
        });
    }

    //  Evento para añadir un producto al carrito de la compra

    function anyadirProductoAlCarrito(e) {
        // Agregamos el Nodo a nuestro carrito
        carrito.push(e.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }


    // Dibuja todos los productos guardados en el carrito

    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.innerText = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = listaDeProductos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);

            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('cart-group', 'mx-2', 'mt-4');
            //Imagen
            const miNodoImagen = document.createElement('img')
            miNodoImagen.setAttribute('src', miItem[0].img)
            miNodoImagen.classList.add('img-cart');
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('p');
            miNodo.classList.add('mb-auto', 'text-center', 'mx-auto', 'mt-auto');
            miNodo.innerText = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].precio}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-height');
            miBoton.innerText = 'X';
            // miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodo);
            miNodoCardBody.appendChild(miBoton);
            DOMcarrito.appendChild(miNodoCardBody);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.innerText = calcularTotal();
    }


    // Evento para borrar un elemento del carrito

    function borrarItemCarrito(e) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = e.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    // Calcula el precio total teniendo en cuenta los productos repetidos

    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = listaDeProductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    // Varia el carrito y vuelve a dibujarlo

    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.removeItem('carrito');

    }

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        // // ¿Existe un carrito previo guardado en LocalStorage?
        // if (localStorage.getItem('carrito') !== null) {
        //     // Carga la información
        //     carrito = JSON.parse(localStorage.getItem('carrito'));
        // }
        carrito = JSON.parse(localStorage.getItem('carrito')) || []
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
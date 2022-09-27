// CAROUSEL
var slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}
  x[slideIndex-1].style.display = "block";
  setTimeout(carousel, 3000);
}

// Declaro un array con los shows disponibles en la página
let eventos = [
    {
        id: 1,
        nombre: "DUA LIPA",
        img: './images/img_dua_lipa.png',
        precio: 7000,
        disponibles: 2, 
    },
    {
        id: 2,
        nombre: "IMAGINE DRAGONS",
        img: './images/img_imagine_dragons.webp',
        precio: 5500,
        disponibles: 0, 
    },
    {
        id: 3,
        nombre: "LOLLAPALOOZA",
        img: './images/img_lollapalooza.jfif',
        precio: 13500,
        disponibles: 0, 
    },
    {
        id: 4,
        nombre: "PRIMAVERA SOUND",
        img: './images/img_primavera_sound.png',
        precio: 10300,
        disponibles: 10, 
    },
    {
        id: 5,
        nombre: "COTI",
        img: './images/img_coti.jpg',
        precio: 2200,
        disponibles: 6, 
    },
    {
        id: 6,
        nombre: "HARRY STYLES",
        img: './images/img_harry_styles.png',
        precio: 8800,
        disponibles: 0, 
    },
    {
        id: 7,
        nombre: "VALDES",
        img: './images/img_valdes.jpg',
        precio: 1800,
        disponibles: 7, 
    },
    {
        id: 8,
        nombre: "RAYOS LASER",
        img: './images/img_rayos_laser.jpg',
        precio: 1800,
        disponibles: 5, 
    }
]

// Creo una clase para agregar cada pedido al carrito de compras
class Pedido{
    constructor(id, evento, entradas, precio){
        this.id = id;
        this.evento = evento;
        this.entradas = entradas;
        this.precio = precio;
    }
}

// Declaro el carrito de compras
let carritoDeCompras = [];

// Me fijo si algún show está agotado y muestro un mensaje en el HTML
// También muestro cuántas entradas quedan si solo hay 3 o menos disponibles
eventos.forEach(evento => {
    if(evento.disponibles == 0){
        const avisoSinStock = document.createElement("h4");
        const divEvento = document.getElementById("card" + evento.id);
        avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
        avisoSinStock.classList.add("aviso");
        avisoSinStock.setAttribute("id", "aviso" + evento.id);
        divEvento.appendChild(avisoSinStock);
    }else if(evento.disponibles >= 1 && evento.disponibles <= 3){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + evento.id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Últimas " + evento.disponibles + " entradas disponibles!";
    }
});

// Selecciono todos los botones para agregar entradas al carrito para manejar por DOM
const btn_entradas = document.querySelectorAll(".btn-entradas");

for(let boton of btn_entradas){
    boton.addEventListener("click", seleccionarEntradas);
}

// Creo la función para seleccionar la cantidad de entradas del select y el id del evento
function seleccionarEntradas(e){
    e.preventDefault();

    let entradas = parseInt(document.getElementById("entradas" + e.target.id).value);
    
    document.getElementById("contenedor-pago").classList.add("hidden");

    agregarACarrito(e.target.id, entradas);

    mostrarEnCarrito();

    document.getElementById("entradas" + e.target.id).value = 0;
}

// Función para saber si un elemento que se quiere agregar al carrito ya está repetido
function repetido(carrito, id){
    return carrito.some(item => id == item.id);
}

// Función para agregar un nuevo objeto pedido o sumar entradas a un objeto en el array de carrito de compras
// Modifico los avisos de stock en HTML
function agregarACarrito(id, entradas) {
    const eventoEncontrado = eventos.find(function(evento) {
        return evento.id == id;
    });

    if(entradas != 0){
        if(entradas <= eventoEncontrado.disponibles){
            if(repetido(carritoDeCompras, id)){
                for(let pedido of carritoDeCompras){
                    if(pedido.id == id){
                        pedido.entradas += entradas;
                        pedido.precio += eventoEncontrado.precio * entradas;
                    }
                }
            }else{
                carritoDeCompras.push(new Pedido(eventoEncontrado.id, eventoEncontrado.nombre, entradas, eventoEncontrado.precio * entradas));
            }
            for(let evento of eventos){
                if(evento.id == id){
                    evento.disponibles -= entradas;
                }
            }
            notificarAgregadoAlCarrito();
        }           
    }
    
    if(eventoEncontrado.disponibles == 0 && !document.getElementById("aviso" + id)){
        const avisoSinStock = document.createElement("h4");
        const divEvento = document.getElementById("card" + id);
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.innerHTML = "";
        avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
        avisoSinStock.classList.add("aviso");
        avisoSinStock.setAttribute("id", "aviso" + id);
        divEvento.appendChild(avisoSinStock);
    }else if(eventoEncontrado.disponibles > 1 && eventoEncontrado.disponibles <= 3){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Últimas " + eventoEncontrado.disponibles + " entradas disponibles!";
    }else if(eventoEncontrado.disponibles == 1){
        const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
        parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
        parrafoUltimasEntradas.innerText = "¡Última entrada disponible!";
    }
}

// Selecciono el contenedor donde voy a incluir el carrito
const listaCarrito = document.getElementById("lista-carrito");
const contenedorCarrito = document.getElementById("contenedor-carrito");

// Función para mostrar en el carrito
function mostrarEnCarrito(){
    if(carritoDeCompras.length != 0){
        contenedorCarrito.classList.remove("hidden");
    }

    carritoDeCompras.forEach(function(pedido) {
        if(!document.getElementById("texto-pedido" + pedido.id)){
            const textoPedido = document.createElement("p");
            textoPedido.textContent = pedido.entradas + "x entradas para " + pedido.evento + " por $" + pedido.precio + ".  ";
            textoPedido.setAttribute("id", "texto-pedido" + pedido.id);
            textoPedido.setAttribute("class", "texto-pedido");
            textoPedido.innerHTML += `<button class="btn-eliminar" id="${pedido.id}"><i class="fa fa-times"></i></button>`;   
            listaCarrito.appendChild(textoPedido);
        }else{
            const textoPedido = document.getElementById("texto-pedido" + pedido.id);
            textoPedido.textContent = pedido.entradas + "x entradas para " + pedido.evento + " por $" + pedido.precio + ".  ";
            textoPedido.innerHTML += `<button class="btn-eliminar" id="${pedido.id}"><i class="fa fa-times"></i></button>`;
        }
    });
    const textoTotal = document.getElementById("total-carrito");
    let precioTotal = carritoDeCompras.reduce((acumulador, pedido) => acumulador + pedido.precio, 0);
    textoTotal.textContent = "TOTAL = $" + precioTotal;

    // Selecciono los botones para eliminar del carrito
    const btn_eliminar = document.querySelectorAll(".btn-eliminar");

    for(let boton of btn_eliminar){
        boton.addEventListener("click", eliminarDelCarrito);
    }
}

/* 
    Elegí utilizar la librería Toastify-js porque en mi simulador de carrito de compras hay muchas situaciones para alertar,
    y estaba mostrando al usuario lo que sucedía mediante la manipulación del DOM. Al cambiar la inserción de texto en el HTML por
    alertas de Toastify el uso es más fluido y mejora la experiencia del usuario. Asimismo, el código se hace menos engorroso y más
    claro para quien quiera leerlo.
*/

// Función para notificar mediante Toasty que se agregó el elemento al carrito
function notificarAgregadoAlCarrito(){
    Toastify({
        text: "¡Se agregó al carrito correctamente!",
        duration: 2000,
        gravity: "bottom",
        position: "left",
        style: {
            background: "#15a14f"
        }
    }).showToast();
}

// Función para notificar mediante Toastify que se eliminó un elemento del carrito
function notificarEliminadoDelCarrito(){
    Toastify({
        text: "¡Se eliminó del carrito correctamente!",
        duration: 2000,
        gravity: "bottom",
        position: "left",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para notificar que hay que iniciar sesión para confirmar el carito
function notificarHayQueIniciarSesion(){
    Toastify({
        text: "Tenés que iniciar sesión para confirmar tu carrito.",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para notificar que ya existe un usuario registrado con los datos ingresados
function notificarUsuarioExistente(){
    Toastify({
        text: "Ya existe un usuario registrado con ese nombre.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para notificar que no existe ningún usuario con los datos ingresados
function notificarUsuarioInexistente(){
    Toastify({
        text: "El usuario ingresado no se encuentra registrado.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para notificar un registro exitoso
function notificarRegistroExitoso(){
    Toastify({
        text: "El usuario se registró correctamente.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#15a14f"
        }
    }).showToast();
}

// Función para notificar que el usuario tiene que completar todos los campos
function notificarCompletarCampos(){
    Toastify({
        text: "Tenés que completar todos los campos.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#eb8334"
        }
    }).showToast();
}

// Función para notificar un inicio de sesión exitoso
function notificarInicioSesion(usuario){
    Toastify({
        text: "¡Bienvenido, " + usuario + "! Has iniciado sesión correctamente.",
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();
}

// Función para notificar que se ha cerrado la sesión
function notificarCierreSesion(usuario){
    Toastify({
        text: "¡Hasta luego, " + usuario + "! Has cerrado sesión correctamente.",
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();
}

// Función para notificar que se ingresó una contraseña incorrecta al intentar iniciar sesión
function notificarContrasenaIncorrecta(){
    Toastify({
        text: "La contraseña ingresada es incorrecta.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para notificar que el carrito de compras se encuentra vacío al intentar confirmarlo
function notificarCarritoVacio(){
    Toastify({
        text: "El carrito de compras se encuentra vacío.",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#e23431"
        }
    }).showToast();
}

// Función para eliminar del carrito
function eliminarDelCarrito(e){
    e.preventDefault();
    e.target.parentNode.parentNode.remove();

    document.getElementById("contenedor-pago").classList.add("hidden");

    let id = parseInt(e.target.parentNode.id);

    const pedidoEncontrado = carritoDeCompras.find(function(pedido) {
        return pedido.id == id;
    });

    eventos.forEach(function(evento){
        if(evento.id == id){
            evento.disponibles += pedidoEncontrado.entradas;
            if(document.getElementById("aviso" + id)){
                document.getElementById("aviso" + id).remove();
            }
            if(document.getElementById("ultimas-entradas" + id)){
                const parrafoUltimasEntradas = document.getElementById("ultimas-entradas" + id);
                parrafoUltimasEntradas.innerHTML = "";
                if(evento.disponibles > 1 && evento.disponibles <= 3){
                    parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
                    parrafoUltimasEntradas.innerText = "¡Últimas " + evento.disponibles + " entradas disponibles!";
                }else if(evento.disponibles == 1){
                    parrafoUltimasEntradas.setAttribute("class", "ultimas-entradas");
                    parrafoUltimasEntradas.innerText = "¡Última entrada disponible!";
                }
            }
        }
    });

    carritoDeCompras = carritoDeCompras.filter(pedido => pedido.id != id);

    const textoTotal = document.getElementById("total-carrito");
    let precioTotal = carritoDeCompras.reduce((acumulador, pedido) => acumulador + pedido.precio, 0);
    textoTotal.textContent = "TOTAL = $" + precioTotal;

    if(carritoDeCompras.length == 0){
        contenedorCarrito.classList.add("hidden");
    }

    notificarEliminadoDelCarrito();
}

// Creo una clase de usuarios
class Usuario{
    constructor(usuario, pass){
        this.usuario = usuario;
        this.pass = pass;
    }
}

// Inicializo el localStorage
const usuarios = [];
const usuarioActivo = JSON.stringify(new Usuario());

if(!localStorage.getItem("usuarios")){
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

if(!localStorage.getItem("usuarioActivo")){
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
}

// Me fijo en el localStorage si hay un usuario activo
if(JSON.parse(localStorage.getItem("usuarioActivo")).usuario){
    document.getElementById("formulario-sign-in").classList.add("hidden");
    document.getElementById("sign-in-header").classList.add("hidden");
    document.getElementById("sign-out-header").classList.remove("hidden");
    document.getElementById("contenedor-sign-in").classList.add("hidden");
}

// Cerrar sesión
const botonSignOutHeader = document.getElementById("sign-out-header");

botonSignOutHeader.addEventListener("click", function(e){
    e.preventDefault();
    const usuarioIniciado = JSON.parse(localStorage.getItem("usuarioActivo")).usuario;
    notificarCierreSesion(usuarioIniciado);
    localStorage.setItem("usuarioActivo", usuarioActivo);
    document.getElementById("formulario-sign-in").classList.remove("hidden");
    document.getElementById("sign-in-header").classList.remove("hidden");
    document.getElementById("sign-out-header").classList.add("hidden");
    document.getElementById("contenedor-pago").classList.add("hidden");
});

// Mostrar formulario para iniciar sesión
const botonSignInHeader = document.getElementById("sign-in-header");
const contenedorSignIn = document.getElementById("contenedor-sign-in");

botonSignInHeader.addEventListener("click", function(){
    contenedorSignIn.classList.contains("hidden") ? contenedorSignIn.classList.remove("hidden") : contenedorSignIn.classList.add("hidden");
});

// Registrarse
const botonRegistro = document.getElementById("btn-registro");

botonRegistro.addEventListener("click", (e) => {
    e.preventDefault();

    let usuario = e.target.form[0].value;
    let pass = e.target.form[1].value;
    
    let nuevoUsuario = new Usuario(usuario, pass);

    let usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios"));

    if(usuario.length == 0 || pass.length == 0){
        e.target.form[0].value = "";
        e.target.form[1].value = "";
        notificarCompletarCampos();
    }else{
        if(usuariosLocalStorage.some(item => usuario == item.usuario)){
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            notificarUsuarioExistente();
        }else{
            usuariosLocalStorage.push(nuevoUsuario);
            usuariosLocalStorage = JSON.stringify(usuariosLocalStorage);
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            localStorage.setItem("usuarios", usuariosLocalStorage);
            notificarRegistroExitoso();
        }
    }
});

// Iniciar sesión
const botonSignIn = document.getElementById("btn-sign-in");

botonSignIn.addEventListener("click", (e) => {
    e.preventDefault();

    let usuario = e.target.form[0].value;
    let pass = e.target.form[1].value;

    let usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios"));

    if(usuario.length == 0 || pass.length == 0){
        e.target.form[0].value = "";
        e.target.form[1].value = "";
        notificarCompletarCampos();
    }else{
        if(usuariosLocalStorage.some(item => usuario == item.usuario)){
            let usuarioEncontrado = usuariosLocalStorage.find(function(item){
                return item.usuario == usuario;
            });
            if(usuarioEncontrado.pass == pass){
                localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
                e.target.form[0].value = "";
                e.target.form[1].value = "";
                notificarInicioSesion(usuarioEncontrado.usuario);
                contenedorSignIn.classList.add("hidden");
                document.getElementById("sign-in-header").classList.add("hidden");
                document.getElementById("sign-out-header").classList.remove("hidden");
            }else{
                e.target.form[0].value = "";
                e.target.form[1].value = "";
                notificarContrasenaIncorrecta();
            }
        }else{
            e.target.form[0].value = "";
            e.target.form[1].value = "";
            notificarUsuarioInexistente();
        }
    }
});

// Uso el botón del carrito en el header para mostrar el carrito
const botonCarritoHeader = document.getElementById("btn-carrito-header");

botonCarritoHeader.addEventListener("click", () => {
    contenedorCarrito.classList.contains("hidden") ? contenedorCarrito.classList.remove("hidden") : contenedorCarrito.classList.add("hidden");
});

// Confirmar carrito
const botonConfirmarCarrito = document.getElementById("btn-confirmar-carrito");

botonConfirmarCarrito.addEventListener("click", function(e){
    e.preventDefault();
    if(!JSON.parse(localStorage.getItem("usuarioActivo")).usuario){
        notificarHayQueIniciarSesion();
    }else if(carritoDeCompras.length == 0){
        notificarCarritoVacio();
    }else{
        document.getElementById("contenedor-pago").classList.remove("hidden");
    }
});

// Confirmar compra
const botonConfirmarCompra = document.getElementById("btn-confirmar-compra");

botonConfirmarCompra.addEventListener("click", function(e){
    e.preventDefault();

    document.getElementById("mensaje-tarjeta-num").classList.add("hidden");
    document.getElementById("mensaje-tarjeta-nomb").classList.add("hidden");
    document.getElementById("mensaje-tarjeta-cvv-amex").classList.add("hidden");
    document.getElementById("mensaje-tarjeta-cvv-no-amex").classList.add("hidden");

    const modoDePago = document.querySelector('input[name="modo-de-pago"]:checked').value;
    const proveedorDeTarjeta = document.querySelector('input[name="tarjeta_prov"]:checked').value;
    const numeroTarjeta = document.getElementById("tarjeta_num").value;
    const nombreTarjeta = document.getElementById("tarjeta_nomb").value;
    const cvvTarjeta = document.getElementById("tarjeta_cvv").value;

    let datosDePago = [];
    datosDePago.push(modoDePago);
    datosDePago.push(proveedorDeTarjeta);
    datosDePago.push(numeroTarjeta);
    datosDePago.push(nombreTarjeta);
    datosDePago.push(cvvTarjeta);

    if(datosDePago.some(item => 0 == item.length)){
        notificarCompletarCampos();
    }else if(numeroTarjeta.length != 16 || /\D/.test(numeroTarjeta) || nombreTarjeta.length < 9 || !/^[A-Za-z\s]*$/.test(nombreTarjeta)
    || (cvvTarjeta.length != 4 && proveedorDeTarjeta == "AMEX") || (cvvTarjeta.length != 3 && proveedorDeTarjeta != "AMEX") || /\D/.test(cvvTarjeta)){
        if(numeroTarjeta.length != 16 || /\D/.test(numeroTarjeta)){
            document.getElementById("mensaje-tarjeta-num").classList.remove("hidden");
        }
        if(nombreTarjeta.length < 9 || !/^[a-zA-Z\s]*$/.test(nombreTarjeta)){
            document.getElementById("mensaje-tarjeta-nomb").classList.remove("hidden");
        }
        if(proveedorDeTarjeta == "AMEX"){
            if(cvvTarjeta.length != 4 || /\D/.test(cvvTarjeta)){
                document.getElementById("mensaje-tarjeta-cvv-amex").classList.remove("hidden");
            }
        }
        if(proveedorDeTarjeta != "AMEX"){
            if(cvvTarjeta.length != 3 || /\D/.test(cvvTarjeta)){
                document.getElementById("mensaje-tarjeta-cvv-no-amex").classList.remove("hidden");
            }
        }
    }else{
        const contenedorPago = document.getElementById("contenedor-pago");
        const mensajeConfirmacionCompra = document.createElement("h3");
        mensajeConfirmacionCompra.setAttribute("id", "mensaje-confirmacion-compra");
        mensajeConfirmacionCompra.innerText = "La compra se ha realizado correctamente.";
        contenedorPago.appendChild(mensajeConfirmacionCompra);
        document.getElementById("formulario-pago").classList.add("hidden");
        document.getElementById("contenedor-carrito").classList.add("hidden");
        setTimeout(() => {
            contenedorPago.removeChild(mensajeConfirmacionCompra);
            document.getElementById("contenedor-pago").classList.add("hidden");
            document.getElementById("formulario-pago").classList.remove("hidden");
            document.getElementById("total-carrito").textContent = "TOTAL = $0";
            carritoDeCompras = [];
            document.getElementById("lista-carrito").innerHTML = "";
            document.getElementById("tarjeta_num").value = "";
            document.getElementById("tarjeta_nomb").value = "";
            document.getElementById("tarjeta_cvv").value = "";
        }, 3000);
    }
});

// Añado un buscador
document.addEventListener("keyup", (e) => {
    if(e.target.matches("#filtro")){
        document.querySelectorAll(".titulo-evento").forEach(evento => {
            evento.textContent.toLowerCase().includes(e.target.value.toLowerCase())?
            evento.parentNode.classList.remove("hidden") : evento.parentNode.classList.add("hidden");
            if(document.getElementById("mensaje-filtro")){
                document.getElementById("mensaje-filtro").remove();
            }
        });
    }
});

// Consumir API del clima y mostrar en footer
const contenedorClima = document.getElementById("clima");

fetch("https://api.openweathermap.org/data/2.5/weather?q=Buenos%20Aires&units=metric&appid=bbf8893c6e8030e157bb633d11a66e17")
    .then(response => response.json())
    .then(data => {
        let iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        contenedorClima.innerHTML = `<div><span>Ciudad: ${data.name}</span></div>
                                     <div><span>Temperatura: ${data.main.temp}°C  <img id="img-clima" src="${iconurl}"></span></div>`;
    })
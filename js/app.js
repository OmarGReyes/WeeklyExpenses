// const { log } = require("node:console");

// Variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')
let presupuesto;

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto);

}


// Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gasto = []
    }

    nuevoGasto(gasto){
        this.gasto= [...this.gasto, gasto]
        this.calcularRestante();
        console.log(this.gasto);
    }

    calcularRestante(){
        let total = 0
        let gastosTotales = this.gasto;
        for (let i of gastosTotales){
            total +=i.cantidad;
        }

        this.restante = this.presupuesto - total
        document.querySelector('#restante').textContent = this.presupuesto - total
        
    }

    eliminarGasto(id){
        this.gasto = this.gasto.filter(gasto => gasto.id !== id)
        this.calcularRestante()
        console.log(presupuesto);
        ui.comprobarPresupuesto(presupuesto)
        ui.agregarListadoGastos(this.gasto)
    }
}


class UI {
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante

    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert')

        if(tipo ==='error'){
            divMensaje.classList.add('alert-danger')
        }else {
            divMensaje.classList.add('alert-success')
        }

        //Asignamos mensajes

        divMensaje.textContent = mensaje;

        //Insertar HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }

    agregarListadoGastos(gastos){
        this.limpiarHTML(); //Elimina HTML
        // iterar sobre gastos

        gastos.forEach( gasto =>{
            const {cantidad, nombre, id} = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className= 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML= `${nombre} <span class='badge badge-primary badge-pill'> ${cantidad} </span>`;

            //Boton para borrar
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar.gasto');
            btnBorrar.innerHTML= 'Borrar &times;'
            btnBorrar.onclick = ()=>{
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            //agregar HTML

            gastoListado.appendChild(nuevoGasto)
        })
    }
    limpiarHTML(){
        while( gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%

        if((presupuesto/4)>restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto/2)>restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
            
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success')

        }

        //Si el total es 0 o menor

        if(restante <=0){
            ui.imprimirAlerta('El presopuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else{900
            formulario.querySelector('button[type="submit"]').disabled = false;

        }
    }
}

//instancia
ui = new UI()

// Funciones

function preguntarPresupuesto(){
    let presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

    // console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) ){
        window.location.reload()
    } else if (presupuestoUsuario <=0){
        presupuestoUsuario = prompt('¿Cual es tu presupuesto? Ingrese un número mayor que 0')
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
    //console.log(presupuesto);
}


function agregarGasto(e){
    e.preventDefault();

    //Leer datos del formulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre==="" || cantidad ===""){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return
    }else if(cantidad <=0 || isNaN(cantidad) || !isNaN(nombre)){
        ui.imprimirAlerta('Cantidad no válida', 'error')
        return
        
    }


    //Generar un objeto con el gasto

    const gastos = {nombre, cantidad, id: Date.now()}
    presupuesto.nuevoGasto(gastos)
    //Muestra mensaje
    ui.imprimirAlerta('Gasto agregado Correctamente')
    
    //Imprimir los gastos
    const {gasto} = presupuesto;
    ui.agregarListadoGastos(gasto);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset()

}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    ui.imprimirAlerta('Gasto eliminado correctamente')
}
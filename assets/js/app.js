/* 
    C = CORAZONES
    E = ESPADA
    D = DIAMANTES
    T = TREBOL

*/

(() => {
  let mazoCartas = []; // Arr que contendra el mazo de cartas
  let puntajes = [0, 0]; // Arr para almacenar los puntajes, donde: Indice 0 == Puntaje del jugador, indice 1 == Puntaje de la computadora
  let btnComenzar = document.querySelector("#comenzar-juego"); // Boton de comenzar juego
  let btnPedirCarta = document.querySelector("#pedir-carta"); // Boton de pedir carta
  let btnPlantarse = document.querySelector( "#plantarse" ); // boton para plantarse

  /* CONTENEDORES DE PUNTAJES */
  let jugador = document.querySelector("#puntaje-jugador");
  let computadora = document.querySelector('#puntaje-computadora');

  /* TITULO COMPUTADORA */
  let titulo_computadora = document.querySelector('#jugador-computadora'); // Selector que me permite mostrar el titulo de la computadora solo cuando sea su turno

  const inicializarMazoCartas = () => {
    const cartaEspecial = ["A", "J", "K", "Q"]; // Arr que representa las cartas especiales
    const tipoCarta = ["C", "D", "E", "T"]; // Arr que representa el tipo de carta
    let indiceCarta = 0; // este sera el indice para el arr de cartas especiales

    for (let i = 2; i < 11; i++) {
      for (let j = 0; j < tipoCarta.length; j++) {
        mazoCartas.push(`${i}${tipoCarta[j]}`);

        if (i % 2) {
          mazoCartas.push(`${cartaEspecial[j]}${tipoCarta[indiceCarta]}`); // hara un push de las especiales por tipo solo cuando i sea impar
          if (j == 3) {
            indiceCarta++; // si es el ultimo valor de j, entonces aumenta el indice para las cartas especiales
          }
        }
      }
    }
    return mazoCartas;
  };

    /*****    GENERADOR DE CARTA RANDOM    ******/
    const pedirCarta = (arrMazoCartas) => {
      let longitud = arrMazoCartas.length;
      let indice = Math.floor(Math.random() * longitud); // genera un numero random , el cual representa el  indice dentro del arr de carta
      let carta = arrMazoCartas[indice];
  
      /* EN CASO DE QUE EL Array de cartas llegue a 0 , mostramos un error */
      if (!longitud) {
        throw alert("No hay mas cartas disponibles");
      }
      arrMazoCartas.splice(indice, 1);
      return carta;
    };

    /*****    IMPRIMIR CARTA RANDOM    ******/
  const imprimirCarta = (carta,contenedor) => {
    let contenedorJugador = document.querySelector("#contenedor-cartas-jugador");
    let contenedorComputadora = document.querySelector('#contenedor-computadora');
    let contenedorCartaComputadora = document.querySelector('#contenedor-cartas-computadora');
    let img = document.createElement("img");
    img.src = `assets/cartas/${carta}.png`;
    img.classList.add("img");

    if(!contenedor){

      contenedorJugador.append(img);
    }else{
      contenedorComputadora.classList.remove('contenedor-activo');
      contenedorCartaComputadora.append(img);
    }
  };


  /*****    ACUMULAR PUNTAJES  DE LOS jugador    ******/

  const acumularPuntajes = (indiceArrPuntajes, arrPuntajes, valorCarta) => {
    let acumulador;

    switch (valorCarta) {
      case "A":
        if (!indiceArrPuntajes) {
          arrPuntajes[indiceArrPuntajes] < 11
            ? (acumulador = 11)
            : (acumulador = 1);
        } else if (indiceArrPuntajes) {
          arrPuntajes[indiceArrPuntajes] < 11
            ? (acumulador = 11)
            : (acumulador = 1);
        }
        break;
      case "J":
      case "Q":
      case "K":
        acumulador = 10;
        break;
      default:
        acumulador = parseInt(valorCarta);
    }
    arrPuntajes[indiceArrPuntajes] += acumulador;
    return arrPuntajes[indiceArrPuntajes];
  };

  /*****    VALIDADOR DEL INPUT JUGADOR    ******/

  const validarNombreJugador = (nombreJugador) => {
    let jugadorValido = new RegExp(/^[A-Za-z\s]{3,20}$/);

    return jugadorValido.test(nombreJugador);
  };
  /* COMENZAR JUEGO */

  const comenzarJuego = () => {
    let contenedor_ventana_ingreso = document.querySelector("#contenedor-ventana-ingreso");
    let ventana_ingreso = document.querySelector("#ventana-ingreso");
    let input_nombre = document.querySelector("#ingreso-nombre-jugador");
    let mensaje_error = document.querySelector("#mensaje-error");
    let btnConfirmar = document.querySelector("#btn-confirmar");
    let jugadorValido;

    /* CONTENEDOR DEL JUGADOR */
    let contenedor_jugadores = document.querySelector("#contenedor-jugador");
    let marcador = document.querySelector("#marcador");
    let jugador = document.querySelector("#jugador");

    /*****  AGREGO LA CLASE DE ACTIVADO A LOS CONTENEDORES PARA INGRESAR EL NOMBRE DEL JUGADOR     *****/
    contenedor_ventana_ingreso.classList.add("activado");
    ventana_ingreso.classList.add("activado");

    input_nombre.addEventListener("input", (caracteres) => {
      /* Bloqueo la tecla enter para que no se recargue la pagina */
      input_nombre.addEventListener('keypress',(teclaEnter) =>{
        (teclaEnter.keyCode) == 13 ? teclaEnter.preventDefault() : "";
      });
      
      input_nombre.classList.add("jugador-invalido");

      if (validarNombreJugador(caracteres.target.value)) {
        input_nombre.classList.remove("jugador-invalido");
        mensaje_error.style.visibility = "hidden";
        input_nombre.classList.add("jugador-valido");
        jugadorValido = caracteres.target.value;
        btnConfirmar.removeAttribute("disabled");
      } else {
        input_nombre.classList.add("jugador-invalido");
        mensaje_error.style.visibility = "visible";
        input_nombre.classList.remove("jugador-valido");
        btnConfirmar.setAttribute("disabled","");
      }
      btnConfirmar.addEventListener("click", () => {
        contenedor_ventana_ingreso.classList.remove("activado");
        ventana_ingreso.classList.remove("activado");

        jugador.innerText = `${jugadorValido}`;
        marcador.classList.remove("contenedor-activo");
        contenedor_jugadores.classList.remove("contenedor-activo");
        btnComenzar.classList.add("btn-desactivado");
      });
    });
  };

  /* MENSAJE DE FIN DE PARTIDA DEPENDIENDO DE: VICTORIA, DERROTA O EMPATE */

  const mensajeFindePartida = (iconoMsj,tituloMsj,textMsj) => {
    Swal.fire({
      icon: `${iconoMsj}`,
      title: `¡${tituloMsj}!`,
      text: `¡${textMsj}!`,
      footer: "<b>Debes reiniciar el juego</b>",
      timerProgressBar: true,
      timer: 3000,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
    });

    document.querySelectorAll('.btn-menu').forEach((boton) => {
      if(boton.innerText != "Reiniciar"){
        boton.classList.add('btn-desactivado');
        boton.setAttribute("disabled","");
      }else{
        boton.classList.remove('btn-desactivado');
        boton.removeAttribute("disabled");
        boton.addEventListener("click",() => {
          mazoCartas = [];
          puntajes = [0,0];
          jugador.innerText = `Jugador: 0`;
          computadora.innerText = `Computadora: 0`;
          titulo_computadora.setAttribute("hidden","");
            /* CONTENEDORES DE CARTAS */
          document.querySelectorAll(".contenedor-cartas").forEach((contenedoresDeCartas) => {
            contenedoresDeCartas.innerHTML = "";
          });
          btnPedirCarta.removeAttribute("disabled","");
          btnPedirCarta.classList.remove('btn-desactivado');
          inicializarMazoCartas();
          boton.setAttribute("disabled","");
          boton.classList.add("btn-desactivado");
        });
      }
    })
  };

  /*****    TURNO DEL JUGADOR    ******/

  const turnoJugador = (arrMazoCartas, arrPuntajes) => {
    let carta = pedirCarta(arrMazoCartas);
    let valorCarta = carta.substr(0, carta.length - 1);
    let puntajeJugador = acumularPuntajes(0, arrPuntajes, valorCarta);
    jugador.innerText = `Jugador: ${puntajeJugador}`;
    imprimirCarta(carta,0);

    if (puntajeJugador > 21) {
      btnPedirCarta.setAttribute("disabled","");
      btnPedirCarta.classList.add('btn-desactivado');

      mensajeFindePartida( "error","PERDISTE","Acumulaste más de 21 puntos" );
      btnPlantarse.setAttribute('disabled',"");
      btnPlantarse.classList.add('btn-desactivado');
    }else{
      btnPlantarse.removeAttribute('disabled');
      btnPlantarse.classList.remove('btn-desactivado');
    }


    /* SI EL JUGADOR DECIDE NO TOMAR MAS CARTAS ENTONCES HACEMOS EL EVENTO CLICK SOBRE EL BOTON */
    btnPlantarse.addEventListener('click',() => {

      (async () => {
        const {value:confirmarReinicio} = await Swal.fire({
          icon: "question",
          title: "¡ATENCION!",
          html: '<p>"Estas seguro que <b>NO</b> necesitas mas cartas?"</p>',
          footer: "<b>Al seleccionar SI, la computadora jugará automáticamente</b>",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          stopKeydownPropagation: false,
          showConfirmButton : true,
          showCancelButton: true,
          confirmButtonText : 'SI',
          cancelButtonText : 'NO'
        });

        if(confirmarReinicio){
          let intervalo = setInterval(()=> {
            let puntosJugador = arrPuntajes[0];
            let puntosComputadora = arrPuntajes[1];
            
            if(puntosComputadora > puntosJugador && puntosComputadora < 22){
              clearInterval(intervalo);
              mensajeFindePartida("error","PERDISTE","La computadora te supero en puntaje");
     
            }else if(puntosComputadora == puntosJugador && puntosJugador > 14){
              clearInterval(intervalo);
              mensajeFindePartida("warning","Empate","Ambos acumularon el mismo puntaje");
 
            }else if(puntosComputadora > 21){
              mensajeFindePartida("success","FELICIDADES","Obtuviste mejor puntaje que la computadora");
              clearInterval(intervalo);
            }else{
              btnPlantarse.setAttribute('disabled',"");
              btnPlantarse.classList.add('btn-desactivado');
              btnPedirCarta.setAttribute('disabled',"");
              btnPedirCarta.classList.add('btn-desactivado');
              turnoComputadora(arrMazoCartas,arrPuntajes);
            }
          },1000);
        }
      })();
    })
  };

    /*****    TURNO DE LA COMPUTADORA    ******/
  const turnoComputadora = (arrMazoCartas, arrPuntajes) => {
    /* let puntajeComputadora = document.querySelector("#puntaje-computadora"); */
    let carta = pedirCarta(arrMazoCartas);
    let valorCarta = carta.substr(0,carta.length-1);
    let puntajeComputadora = acumularPuntajes( 1,arrPuntajes,valorCarta );
    computadora.innerText = `Computadora: ${puntajeComputadora}`;
    titulo_computadora.removeAttribute("hidden");
    imprimirCarta(carta,1);

  };

  /*****    EVENTO PARA COMENZAR EL JUEGO    *****/
  btnComenzar.addEventListener("click", () => {
    inicializarMazoCartas();
    comenzarJuego();

    /* DESBLOQUEO EL BOTON DE PEDIR CARTA */
    btnPedirCarta.removeAttribute("disabled");
    btnPedirCarta.classList.remove("btn-desactivado");
  });

  /*****    EVENTO PARA PEDIR CARTA    *****/

  btnPedirCarta.addEventListener("click", () => {
    turnoJugador(mazoCartas, puntajes);
  });
})()//FIN DE FUNCION AUTO-INVOCADA AL INICIAR LA PAGINA;

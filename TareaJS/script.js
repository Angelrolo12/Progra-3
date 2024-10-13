// variables globales
let tiempoRestante = 30;
let temporizadorInterval;
let preguntaActual = 0;
let puntaje = 0;
let preguntasAleatorias = [];
let opcionSeleccionada = null;
let respuestaSeleccionada = null;
let respuestaUsuario = [];
let emparejamientoSeleccionado = [];

function iniciarTemporizador() {
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            avanzarPregunta();
        }
    }, 1000);
}

function pausarTemporizador() {
    clearInterval(temporizadorInterval);
}

// preguntas
const preguntas = [
    {
        tipo: "seleccion_multiple",
        pregunta: "¿Cuál es el lenguaje de marcado utilizado para crear páginas web?",
        opciones: ["JavaScript", "HTML", "CSS", "Python"],
        respuesta: "HTML",
    },
    {
        tipo: "verdadero_falso",
        pregunta: "CSS es un lenguaje de programación.",
        opciones: ["Verdadero", "Falso"],
        respuesta: "Falso"
    },
    {
        tipo: "emparejamiento",
        pregunta: "Empareja las siguientes tecnologías con su uso:",
        opciones: [
            { izquierda: "HTML", derecha: "Estructura" },
            { izquierda: "CSS", derecha: "Estilo" },
            { izquierda: "JavaScript", derecha: "Interactividad" }
        ],
        respuesta: {
            "HTML": "Estructura",
            "CSS": "Estilo",
            "JavaScript": "Interactividad"
        }
    }
    // Añade más preguntas según sea necesario
];

// Obtener elementos del DOM
const inicioPantalla = document.getElementById('inicio');
const comenzarBtn = document.getElementById('comenzar-btn');
const preguntasPantalla = document.getElementById('preguntas');

// preguntas aleatorias
function mezclarPreguntas(preguntas) {
    return preguntas.sort(() => Math.random() - 0.5);
}

// Evento para comenzar el quiz
comenzarBtn.addEventListener('click', () => {
    inicioPantalla.classList.add('ocultar');
    preguntasPantalla.classList.remove('ocultar');
    preguntasAleatorias = mezclarPreguntas([...preguntas]); // aleatoridad
    mostrarPregunta();
    iniciarTemporizador();
});

const preguntaTexto = document.getElementById('pregunta-texto');
const opcionesLista = document.getElementById('opciones-lista');

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    preguntaTexto.textContent = pregunta.pregunta;
    opcionesLista.innerHTML = ''; // Limpia las opciones previas

    if (preguntaActual >= preguntas.length) {
        // Mostrar pantalla de fin de cuestionario
        mostrarFinDeCuestionario();
        return;
    }

    if (pregunta.tipo === "seleccion_multiple" || pregunta.tipo === "verdadero_falso") {
        pregunta.opciones.forEach(opcion => {
            const li = document.createElement('li');
            li.textContent = opcion;
            li.classList.add('opcion');
            li.addEventListener('click', seleccionarOpcion);
            opcionesLista.appendChild(li);
        });
    } else if (pregunta.tipo === "emparejamiento") {
        pregunta.opciones.forEach(par => {
            const li = document.createElement('li');
            li.textContent = `${par.izquierda} - ${par.derecha}`;
            li.classList.add('opcion');
            li.addEventListener('click', seleccionarOpcionEmparejamiento);
            opcionesLista.appendChild(li);
            actualizarBarraProgreso();
        });
    }
}

function seleccionarOpcion(e) {
    // Remover la clase 'seleccionado' de todas las opciones
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(op => op.classList.remove('seleccionado'));

    // Añadir la clase 'seleccionado' a la opción clicada
    e.target.classList.add('seleccionado');
    opcionSeleccionada = e.target.textContent;
    siguienteBtn.classList.remove('ocultar');
}

const siguienteBtn = document.getElementById('siguiente-btn');

siguienteBtn.addEventListener('click', () => {
    pausarTemporizador();
    verificarRespuesta();
    avanzarPregunta();
});

//Verifica respuesta y suma puntaje

function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    const esCorrecto = opcionSeleccionada === pregunta.respuesta;
    if (respuestaSeleccionada === null) {
        alert("Por favor, seleccione una respuesta");
        return;
    }

    respuestasUsuario.push({
        pregunta: pregunta.pregunta,
        seleccionada: respuestaSeleccionada,
        correcta: pregunta.respuesta,
        esCorrecto: esCorrecto
    });

    if (pregunta.tipo === "seleccion_multiple" || pregunta.tipo === "verdadero_falso") {
        if (esCorrecto) {
            puntaje++;
            mostrarRetroalimentacion(true);
        } else {
            mostrarRetroalimentacion(false);
        }
    } else if (pregunta.tipo === "emparejamiento") {
        const respuestaCorrecta = pregunta.opciones.every(par => {
            return par.derecha === pregunta.respuesta[par.izquierda];
        });
        if (respuestaCorrecta) {
            puntaje++;
            mostrarRetroalimentacion(true);
        } else {
            mostrarRetroalimentacion(false);
        }
    }

    opcionSeleccionada = null;
    respuestaSeleccionada = null;
}

//siguiente pregunta
function avanzarPregunta() {
    preguntaActual++;
    if (preguntaActual < preguntasAleatorias.length) {
        mostrarPregunta();
        iniciarTemporizador();
    } else {
        mostrarResultados();
    }
}

//  pantalla de resultados
const resultadosPantalla = document.getElementById('resultados');
const puntajeFinal = document.getElementById('puntaje-final');
const totalPreguntas = document.getElementById('total-preguntas');
const reiniciarBtn = document.getElementById('reiniciar-btn');

function mostrarResultados() {
    preguntasPantalla.classList.add('ocultar');
    resultadosPantalla.classList.remove('ocultar');
    puntajeFinal.textContent = puntaje;
    totalPreguntas.textContent = preguntasAleatorias.length;
    const porcentaje = (puntaje / preguntasAleatorias.length) * 100;

    // Mostrar el mensaje basado en el porcentaje de aciertos
    const mensajeFinal = document.getElementById('mensaje-final');
    if (porcentaje === 100) {
        mensajeFinal.textContent = "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (porcentaje >= 70) {
        mensajeFinal.textContent = "¡Muy bien! Tienes un buen conocimiento.";
    } else if (porcentaje >= 40) {
        mensajeFinal.textContent = "Está bien, pero puedes mejorar.";
    } else {
        mensajeFinal.textContent = "Necesitas estudiar más. ¡Inténtalo de nuevo!";
    }

    // Guardar puntaje 
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({
        fecha: new Date().toLocaleString(),
        puntaje: puntaje,
        total: preguntasAleatorias.length
    });
    localStorage.setItem('historial', JSON.stringify(historial));
    // Mostrar detalles de respuestas incorrectas
    const detalles = respuestasUsuario.filter(res => !res.esCorrecto);
    if (detalles.length > 0) {
        resultadosPantalla.innerHTML += '<h3>Revisa tus respuestas incorrectas:</h3>';
        detalles.forEach(det => {
            resultadosPantalla.innerHTML += `
                <p><strong>Pregunta:</strong> ${det.pregunta}</p>
                <p><strong>Tu respuesta:</strong> ${det.seleccionada}</p>
                <p><strong>Respuesta correcta:</strong> ${det.correcta}</p>
            `;
        });
    }
}
//Reiniciar quiz
reiniciarBtn.addEventListener('click', reiniciarQuiz);

function reiniciarQuiz() {
    resultadosPantalla.classList.add('ocultar');
    inicioPantalla.classList.remove('ocultar');
    preguntaActual = 0;
    puntaje = 0;
    preguntasAleatorias = [];
}

// retroalimentacion
const retroalimentacion = document.getElementById('retroalimentacion');

function mostrarRetroalimentacion(esCorrecto) {
    const retroalimentacion = document.getElementById('retroalimentacion');
    retroalimentacion.classList.remove('ocultar');
    if (esCorrecto) {
        retroalimentacion.textContent = "¡Correcto!";
        retroalimentacion.classList.add('correcto');
    } else {
        retroalimentacion.textContent = `Incorrecto. La respuesta correcta era: ${preguntasAleatorias[preguntaActual].respuesta}`;
        retroalimentacion.classList.add('incorrecto');
    }
    setTimeout(() => {
        retroalimentacion.classList.add('ocultar');
        retroalimentacion.classList.remove('correcto', 'incorrecto');
    }, 2000);
}

function seleccionarOpcionEmparejamiento(e) {
    const opcion = e.target.textContent.split(" - ");
    emparejamientoSeleccionado.push({
        izquierda: opcion[0],
        derecha: opcion[1]
    });

    if (emparejamientoSeleccionado.length === preguntas[preguntaActual].opciones.length) {
        verificarRespuestaEmparejamiento();
    }
}

function verificarRespuestaEmparejamiento() {
    const pregunta = preguntas[preguntaActual];
    const esCorrecto = emparejamientoSeleccionado.every(par => {
        return pregunta.respuesta[par.izquierda] === par.derecha;
    });

    if (esCorrecto) {
        puntaje++;
        mostrarRetroalimentacion(true);
    } else {
        mostrarRetroalimentacion(false);
    }

    emparejamientoSeleccionado = []; // Reiniciar selección
}

const barraProgreso = document.getElementById('barra-progreso');

function actualizarBarraProgreso() {
    const porcentaje = ((preguntaActual) / preguntas.length) * 100;
    const barraProgreso = document.getElementById('barra-progreso');
    barraProgreso.style.width = `${porcentaje}%`;
}

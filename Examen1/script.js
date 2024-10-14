let usuarios = [
    { nombre: "Administrador", contraseña: "1234" },
    { nombre: "Operador 1", contraseña: "1234" },
    { nombre: "Operador 2", contraseña: "1234" }
];

let equipos = [
    { nombre: "DX1", tipo: "Aire Acondicionado" },
    { nombre: "DX2", tipo: "Aire Acondicionado" },
    { nombre: "DX3", tipo: "Aire Acondicionado" },
    { nombre: "DX4", tipo: "Aire Acondicionado" },
    { nombre: "UPS1", tipo: "UPS" },
    { nombre: "UPS2", tipo: "UPS" },
    { nombre: "UPS3", tipo: "UPS" },
    { nombre: "GEN01", tipo: "Generador" },
    { nombre: "GEN02", tipo: "Generador" },
    { nombre: "ATS-A", tipo: "Transferencia" },
    { nombre: "ATS-B", tipo: "Transferencia" }
];

let registros = [];

let grupos = {
    "Aires Acondicionados": ["DX1", "DX2", "DX3", "DX4"],
    "UPS": ["UPS1", "UPS2", "UPS3"],
    "Generadores": ["GEN01", "GEN02"],
    "Transferencias": ["ATS-A", "ATS-B"]
};

const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Rlnd2609',
    server: 'DESKTOP-UGCRI9O\SQLEXPRESS1',
    database: 'Datos DC'
};

const conn = new sql.ConnectionPool(config);

conn.connect(err => {
    if (err) {
        console.error(err);
    } else {
        console.log('Conexión establecida con la base de datos');
    }
});

function autenticarUsuario() {
    let usuario = document.getElementById('usuario').value;
    let password = document.getElementById('password').value;
    let encontrado = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre === usuario && usuarios[i].contraseña === password) {
            encontrado = true;
            break;
        }
    }
    if (encontrado) {
        document.getElementById('autenticacion').style.display = 'none';
        document.getElementById('registroDatos').style.display = 'block';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function mostrarCamposEspecificos() {
    let grupo = document.getElementById('equipo').value;
    let subequipoSelect = document.getElementById('subequipo');
    subequipoSelect.innerHTML = '';  // Limpiar las opciones previas
    subequipoSelect.style.display = 'none';  // Ocultar el menú hasta que haya un grupo seleccionado

    // Borrar los datos anteriores
    document.getElementById('camposEspecificos').innerHTML = '';
    document.getElementById('subequipo').value = '';
    registros = [];
    mostrarDatos();

    if (grupo && grupos[grupo]) {
        subequipoSelect.style.display = 'block';  // Mostrar el menú de subequipos
        subequipoSelect.innerHTML = '<option value="">--Seleccionar equipo específico--</option>';

        // Llenar las opciones de grupo seleccionado
        grupos[grupo].forEach(equipo => {
            let option = document.createElement('option');
            option.value = equipo;
            option.innerText = equipo;
            subequipoSelect.appendChild(option);
        });
    }

    let campos = '';  // Limpiar campos 
    if (grupo === "Aires Acondicionados") {
        campos = `
            <label for="setTemp">Setpoint Temperatura (23°C):</label>
            <input type="checkbox" id="setTemp" required>
            <label for="setHum">Setpoint Humedad (40%):</label>
            <input type="checkbox" id="setHum" required>
            <label for="actualTemp">Temperatura Actual (°C):</label>
            <input type="number" id="actualTemp" required>
            <label for="actualHum">Humedad Actual (%):</label>
            <input type="number" id="actualHum" required>
        `;
    } else if (grupo === "UPS") {
        campos = `
            <h3>UPS Entrada</h3>
            <label for="voltInL1N">Voltaje Entrada L1-N:</label>
            <input type="number" id="voltInL1N" required>
            <label for="voltInL2N">Voltaje Entrada L2-N:</label>
            <input type="number" id="voltInL2N" required>
            <label for="voltInL3N">Voltaje Entrada L3-N:</label>
            <input type="number" id="voltInL3N" required>
            <h3>UPS Salida</h3>
            <label for="voltOutL1N">Voltaje Salida L1-N:</label>
            <input type="number" id="voltOutL1N" required>
            <label for="voltOutL2N">Voltaje Salida L2-N:</label>
            <input type="number" id="voltOutL2N" required>
            <label for="voltOutL3N">Voltaje Salida L3-N:</label>
            <input type="number" id="voltOutL3N" required>
        `;
    } else if (grupo === "Generadores") {
        campos = `
            <label for="combustible">Nivel de Combustible (%):</label>
            <input type="number" id="combustible" required>
            <label for="kwG">KW Suministrados:</label>
            <input type="number" id="kwG" required>
        `;
    } else if (grupo === "Transferencias") {
        campos = `
            <h3>Transferencia L-N</h3>
            <label for="voltInL1NT">Voltaje Entrada L1-N:</label>
            <input type="number" id="voltInL1NT" required>
            <label for="voltInL2NT">Voltaje Entrada L2-N:</label>
            <input type="number" id="voltInL2NT" required>
            <label for="voltInL3NT">Voltaje Entrada L3-N:</label>
            <input type="number" id="voltInL3NT" required>
        `;
    }
    document.getElementById('camposEspecificos').innerHTML = campos;
}

function registrarDatos() {
    let grupo = document.getElementById('equipo').value;
    let subequipo = document.getElementById('subequipo').value;

    if (!grupo || !subequipo) {
        alert("Por favor seleccione un grupo y un equipo específico.");
        return;
    }

    let mediciones = {};
    if (grupo === "Aires Acondicionados") {
        mediciones = {
            setTemp: document.getElementById('setTemp').checked ? "23°C" : "23°C",
            setHum: document.getElementById('setHum').checked ? "40%" : "40%",
            actualTemp: document.getElementById('actualTemp').value + "°C",
            actualHum: document.getElementById('actualHum').value + "%"
        };
    } else if (grupo === "UPS") {
        mediciones = {
            voltInL1N: document.getElementById('voltInL1N').value + "V",
            voltInL2N: document.getElementById('voltInL2N').value + "V",
            voltInL3N: document.getElementById('voltInL3N').value + "V",
            voltOutL1N: document.getElementById('voltOutL1N').value + "V",
            voltOutL2N: document.getElementById('voltOutL2N').value + "V",
            voltOutL3N: document.getElementById('voltOutL3N').value + "V"
        };
    } else if (grupo === "Generadores") {
        mediciones = {
            fuel: document.getElementById('combustible').value + "%",
            kw: document.getElementById('kwG').value + "KW"
        };
    } else if (grupo === "Transferencias") {
        mediciones = {
            voltInL1N: document.getElementById('voltInL1NT').value + "V",
            voltInL2N: document.getElementById('voltInL2NT').value + "V",
            voltInL3N: document.getElementById('voltInL3NT').value + "V"
        };
    }

    let fecha = new Date();
    let registro = {
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString(),
        grupo: grupo,
        subequipo: subequipo,
        mediciones: mediciones
    };

    // Guardar en registros locales
    registros.push(registro);
    mostrarDatos();

    // Guardar en la base de datos
    const equipoId = obtenerEquipoId(grupo, subequipo);
    if (!equipoId) {
        alert("Error: No se encontró el ID del equipo.");
        return;
    }

    const query = `INSERT INTO Registros (Fecha, Hora, EquipoId, Mediciones) VALUES (@Fecha, @Hora, @EquipoId, @Mediciones)`;
    const params = {
        Fecha: registro.fecha,
        Hora: registro.hora,
        EquipoId: equipoId,
        Mediciones: JSON.stringify(mediciones)
    };

    conn.query(query, params, (err, result) => {
        if (err) {
            console.error("Error al guardar los datos en la base de datos:", err);
            alert("Error al guardar los datos.");
        } else {
            console.log("Datos registrados con éxito en la base de datos.");
        }
    });
}

function mostrarDatos() {
    let tabla = document.getElementById('tablaRegistros').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';  // Limpiar la tabla antes de llenarla

    registros.forEach(registro => {
        let fila = tabla.insertRow();
        fila.insertCell(0).innerText = registro.fecha;
        fila.insertCell(1).innerText = registro.hora;
        fila.insertCell(2).innerText = `${registro.grupo} - ${registro.subequipo}`;

        let medicionesText = Object.entries(registro.mediciones)
            .map(([clave, valor]) => `${clave}: ${valor}`)
            .join(", ");

        fila.insertCell(3).innerText = medicionesText;
    });
}


function obtenerEquipoId(grupo, subequipo) {
    // Mapeo de identificadores por grupo y subequipo
    const equipos = {
        "Aires Acondicionados": {
            "DX1": 1,
            "DX2": 2,
            "DX3": 3,
            "DX4": 4
        },
        "UPS": {
            "UPS1": 5,
            "UPS2": 6,
            "UPS3": 7
        },
        "Generadores": {
            "GEN01": 8,
            "GEN02": 9
        },
        "Transferencias": {
            "ATS-A": 10,
            "ATS-B": 11
        }
    };

    // Verificar si el grupo y subequipo existen y devolver el ID
    if (equipos[grupo] && equipos[grupo][subequipo]) {
        return equipos[grupo][subequipo];  // Devuelve el ID del equipo
    } else {
        return null;  // Retorna null si no se encuentra el equipo
    }
}

function obtenerMediciones(grupo, subequipo) {
    // Obtener el ID del equipo para las mediciones
    const equipoId = obtenerEquipoId(grupo, subequipo);

    if (!equipoId) {
        console.error(`No se encontró el equipo para el grupo: ${grupo}, subequipo: ${subequipo}`);
        return null;
    }

    // Simulación de una base de datos de mediciones
    const medicionesBaseDatos = {
        1: { temperatura: "23°C", humedad: "40%" },  // DX1
        2: { temperatura: "22°C", humedad: "38%" },  // DX2
        3: { temperatura: "24°C", humedad: "42%" },  // DX3
        4: { temperatura: "25°C", humedad: "43%" },  // DX4
        5: { voltInL1N: "120V", voltInL2N: "122V", voltInL3N: "118V" },  // UPS1
        6: { voltInL1N: "121V", voltInL2N: "123V", voltInL3N: "119V" },  // UPS2
        7: { voltInL1N: "119V", voltInL2N: "120V", voltInL3N: "117V" },  // UPS3
        8: { fuel: "50%", kw: "400KW" },  // GEN01
        9: { fuel: "70%", kw: "450KW" },  // GEN02
        10: { voltInL1N: "230V", voltInL2N: "231V", voltInL3N: "229V" },  // ATS-A
        11: { voltInL1N: "232V", voltInL2N: "234V", voltInL3N: "230V" }  // ATS-B
    };

    // Retornar las mediciones si existen para el equipo
    if (medicionesBaseDatos[equipoId]) {
        return medicionesBaseDatos[equipoId];
    } else {
        console.error("No se encontraron mediciones para el equipo con ID:", equipoId);
        return null;
    }
}


function imprimirReporte() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    const ctxAires = document.getElementById('graficoAires').getContext('2d');
    const ctxUPS = document.getElementById('graficoUPS').getContext('2d');
    const ctxGeneradores = document.getElementById('graficoGeneradores').getContext('2d');
    const ctxTransferencias = document.getElementById('graficoTransferencias').getContext('2d');
    pdf.save('matriz_control.pdf');
}
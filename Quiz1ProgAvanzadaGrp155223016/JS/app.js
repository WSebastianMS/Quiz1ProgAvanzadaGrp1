const registroForm = document.forms["registroForm"];
const codigoRep = document.getElementById("codigoRep");
const codigoJ = document.getElementById("codigo");
const listaEstudiantes = document.getElementById('listaEstudiantes');

function mostrarVentanaEmergente(mensaje, onConfirm) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 1)';

    if(mensaje === "El código ya existe. Por favor, ingrese un código diferente."){

        modal.innerHTML = `
        <p>${mensaje}</p>
        <button id="confirmar" hidden >Sí</button>
        <button id="cancelar">Ok</button>
    `;

    }else{

        modal.innerHTML = `
        <p>${mensaje}</p>
        <button id="confirmar">Sí</button>
        <button id="cancelar">No</button>
    `;
    }
    
    

    document.body.appendChild(modal);

    document.getElementById('confirmar').addEventListener('click', () => {
        onConfirm();
        document.body.removeChild(modal);
    });

    document.getElementById('cancelar').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}


const validarCodigoRep = (codigo) => {
    codigoRep.textContent = "";
    if (codigo.length < 8) {
        codigoRep.textContent = "El código debe tener 8 números";
        return false;
    }
    return true;
};


const validarNota = (nota, divId) => {
    const validarNotaDiv = document.getElementById(divId);
    validarNotaDiv.textContent = '';
    if (nota >= 0 && nota <= 5) {
        return true;
    }
    validarNotaDiv.textContent = 'Las notas deben estar entre 0 y 5.';
    return false;
};


const cargarEstudiante = (estudiante) => {
    const row = document.createElement('tr');
    const btnCeld = document.createElement('td');
    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener('click', () => {
        const nombreEstudiante = estudiante.nombre; // Guarda el nombre del estudiante
        mostrarVentanaEmergente(`¿Está seguro de que quiere eliminar al estudiante ${nombreEstudiante}?`, () => {
            row.classList.add('fade');
            setTimeout(() => row.remove(), 1000);
        });
    });
    btnCeld.appendChild(eliminarBtn);

    const codigoCeld = document.createElement('td');
    codigoCeld.textContent = estudiante.codigo;
    const nombreCeld = document.createElement('td');
    nombreCeld.textContent = estudiante.nombre;
    const pveinCeld = document.createElement('td');
    pveinCeld.textContent = estudiante.pvein;
    const sveinCeld = document.createElement('td');
    sveinCeld.textContent = estudiante.svein;
    const tveinCeld = document.createElement('td');
    tveinCeld.textContent = estudiante.tvein;
    const cuarCeld = document.createElement('td');
    cuarCeld.textContent = estudiante.cuar;

    row.appendChild(btnCeld);
    row.appendChild(codigoCeld);
    row.appendChild(nombreCeld);
    row.appendChild(pveinCeld);
    row.appendChild(sveinCeld);
    row.appendChild(tveinCeld);
    row.appendChild(cuarCeld);

    const definitiva = (parseFloat(estudiante.pvein) * 0.2) + (parseFloat(estudiante.svein) * 0.2) + (parseFloat(estudiante.tvein) * 0.2) + (parseFloat(estudiante.cuar) * 0.4);
    const definitivaCeld = document.createElement('td');
    definitivaCeld.textContent = definitiva.toFixed(2);
    const apruebaCeld = document.createElement('td');
    apruebaCeld.textContent = definitiva >= 3 ? 'A' : 'N';

    row.appendChild(definitivaCeld);
    row.appendChild(apruebaCeld);

    row.classList.add('fadeIn');
    const tbody = listaEstudiantes.getElementsByTagName('tbody')[0];
    listaEstudiantes.classList.remove('fadeIn')
    tbody.appendChild(row);
};


const esCodigoRepetido = (codigo) => {
    const rows = listaEstudiantes.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].getElementsByTagName('td')[1].textContent === codigo) {
            return true;
        }
    }
    return false;
};


registroForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const codigo = codigoJ.value;
    const nombre = document.getElementById('nombre').value;
    const pvein = parseFloat(document.getElementsByName('pvein')[0].value).toFixed(2);
    const svein = parseFloat(document.getElementsByName('svein')[0].value).toFixed(2);
    const tvein = parseFloat(document.getElementsByName('tvein')[0].value).toFixed(2);
    const cuar = parseFloat(document.getElementsByName('cuar')[0].value).toFixed(2);

    if (!validarCodigoRep(codigo) || !validarNota(pvein, 'validarPvein') || !validarNota(svein, 'validarSvein') || !validarNota(tvein, 'validarTvein') || !validarNota(cuar, 'validarCuar')) {
        return;
    }

    if (esCodigoRepetido(codigo)) {
        mostrarVentanaEmergente("El código ya existe. Por favor, ingrese un código diferente.");
        return;
    }

    const estudiante = {
        codigo,
        nombre,
        pvein,
        svein,
        tvein,
        cuar
    };

    cargarEstudiante(estudiante);

    registroForm.reset();
});

const notaInputs = document.querySelectorAll('input[name="pvein"], input[name="svein"], input[name="tvein"], input[name="cuar"]');

notaInputs.forEach(input => {
    input.addEventListener('input', () => {
        validarNota(parseFloat(input.value), `validar${input.name.charAt(0).toUpperCase() + input.name.slice(1)}`);
    });
});

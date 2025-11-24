// Constantes de dimensión inicial
const ROWS = 10;
const COLUMNS = 3;

// Utilidades DOM para seleccionar elementos
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Recuperación de elementos clave del DOM
const Table = $('table');
const Head = $('thead');
const Body = $('tbody');

const Times = length => Array.from({ length }, (_, i) => i);
// Nota: En los capítulos siguientes se usa 'Range' o 'Times' indistintamente para referirse a esta función.


const getColumn = (i) => String.fromCharCode(65 + i); // 65 es el código ASCII de 'A' [7, 9]

let State = Times(COLUMNS).map((column, x) =>
    Times(ROWS).map((row, i) => ({
        computedValue: 0,
        value: '',
    }))
);
// Esta definición fue incluida al inicio del script en el Paso 4.

const renderSpreadsheet = () => {
    // Este bloque iría dentro de la función renderSpreadsheet
    Head.innerHTML = `
<tr>
    <th></th>
    ${Times(COLUMNS).map(i => `<th>${getColumn(i)}</th>`).join('')}
</tr>
`;


    // Este bloque iría dentro de la función renderSpreadsheet, después del Head.innerHTML
    Body.innerHTML = Times(ROWS).map(Row => `
    <tr>
        <td>${Row + 1}</td>
        ${Times(COLUMNS).map(Column => `
            <td data-row="${Row}" data-column="${Column}"> 
                <span>${State[Column][Row].computedValue}</span>
                <input type="text" value="${State[Column][Row].value}" />
            </td>
        `).join('')}
    </tr>
`).join('');
};


Body.addEventListener('click', (event) => {
    const TD = event.target.closest('td');

    if (!TD) return;

    const Input = TD.querySelector('input');
    const x = parseInt(TD.dataset.column);
    const i = parseInt(TD.dataset.row);

    Input.focus();

    // Truco: Mueve el cursor al final del texto al entrar [31]
    const position = Input.value.length;
    Input.setSelectionRange(position, position);

    // Escucha el evento blur (al salir del input) una sola vez [27, 33]
    Input.addEventListener('blur', () => {
        const inputValue = Input.value;
        const stateValue = State[x][i].value;

        // Evitar repintado si el valor no ha cambiado
        if (inputValue === stateValue) return;

        updateCell(x, i, inputValue);
    }, { once: true });

    // Manejo del Enter
    Input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            Input.blur();
        }
    });
});


const updateCell = (x, i, value) => {
    // 1. Clonación profunda
    const NewState = structuredClone(State);
    const Cell = NewState[x][i];

    // 2. Asignar nuevo valor introducido
    Cell.value = value;
    
    // 3. Recalcular todas las celdas (usando NewState para capturar todas las dependencias)
    computeAllCells(NewState); 

    // 4. Machacar el estado antiguo y repintar
    State = NewState;
    renderSpreadsheet();
};

// La definición final de computeValue se actualizará en el Capítulo 14 para aceptar constantes.

const computeValue = (value, constants) => {
    if (typeof value !== 'string' || !value.startsWith('=')) {
        return value; // Devuelve el valor si no es una cadena o no es una fórmula
    }

    // Extrae la fórmula (quitando el '=')
    const formula = value.slice(1); 
    let computedValue = value; 

    try {
        // Uso de IIFE para inyectar constantes antes de evaluar [40, 42]
        computedValue = ((constants, formula) => {
            return eval(constants + formula);
        })(constants, formula);

    } catch (e) {
        // Manejo de errores de cálculo
        computedValue = 'ERROR';
    }
    
    // Aseguramos que si es un número, se use el valor numérico
    if (!isNaN(parseFloat(computedValue)) && isFinite(computedValue)) {
        computedValue = Number(computedValue);
    }

    return computedValue;
};


const generateCellsConstants = (cells) => {
    let constantsString = '';

    Times(COLUMNS).forEach((x) => {
        Times(ROWS).forEach((i) => {
            const cellId = `${getColumn(x)}${i + 1}`; // A1, B2, etc.
            const computedValue = cells[x][i].computedValue;
            
            // Crea una cadena 'const A1 = 5;'
            constantsString += `const ${cellId} = ${computedValue};`;
        });
    });

    return constantsString;
};

const computeAllCells = (state) => {
    // 1. Generar constantes basadas en el estado actual (antes de recalcular)
    const constants = generateCellsConstants(state);

    // 2. Iterar y recalcular todas las celdas usando las constantes
    Times(COLUMNS).forEach((x) => {
        Times(ROWS).forEach((i) => {
            const Cell = state[x][i];
            
            // Calcula el nuevo valor computado usando la fórmula y las constantes
            Cell.computedValue = computeValue(Cell.value, constants);
        });
    });

    // La función muta directamente el 'state' que se le pasa (NewState en updateCell)
};

// Ejecución inicial de la función de renderizado
renderSpreadsheet();



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

// Ejecución inicial de la función de renderizado
renderSpreadsheet();



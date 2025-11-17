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
        computedValue: 0, // Inicialmente se establece en 0 [10]
        value: '',        // Inicialmente vacío [11, 12]
    }))
);[11, 12]

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

// Ejecución inicial de la función de renderizado
renderSpreadsheet(); 
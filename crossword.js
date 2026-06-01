function crosswordSolver(puzzle, words) {
    // 1. Validate the input

    if(typeof puzzle !== 'string' || !Array.isArray(words) || words.length === 0) {
        console.log('ERROR');
        return;
    }
}

// words must all be non empty strings with no duplicates

if (words.some(w => typeof w !== 'string' || w.length === 0)) {
    console.log('ERROR');
    return;
}

if (new Set(words).size !== words.length) {
    console.log('ERROR');
    return;
}

// 2. ParseGrid 
// convert the puzzle string in a 2D array of characters
// Validate characters: digits (0-9), dots (.), newlines
function parseGrid(puzzleStr) {
    const lines = puzzleStr.split('\n');

    const rowLength = lines[0].length;
    const grid = [];

    for (const line of lines) {
        if (line.length !== rowLength) return null; 
        const row = [];
        for (const ch of line) {
            if (!/^[0-9.]$/.test(ch)) return null;
            row.push(ch);
        }

    }
    return grid;
}

// 3.Findslots

function findSlots(grid) {
    const rows = grid.length;
    const columns = grid[0].length;
    const slots = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = grid[r][c];
            if  (cell === '.') continue;

            const count = parseInt(cell, 10);
            if (isNaN(count) || count < 1 || count > 2) continue;

            // check for an ACROSS slot starting here
            const canStartAcross = 
            (c === 0 || grid[r][c - 1] === '.') &&
            c + 1 < columns && grid[r][c + 1] !== '.';

            if (canStartAcross) {
                let len = 0;
                let tc = c;
                while (tc < columns && grid[r][tc] !== '.') { len++; tc++; }
                if (len >= 2) slots.push({ row: r, colums: c, direction;})
            }
        // check for a DOWN slot starting here
        const canStartDown =
        (r === 0 || grid[r - 1][c] === '.') &&
        r + 1 < rows && grid[r + 1][c] === '.';

        if (canStartDown) {
            let len = 0;
            let tr = r;
            while (tr < rows && grid[tr][c] !== '.') { len++; tr++; }
            if (len >= 2) slots.push({ row: r, columns: c, direction: 'down ', length: len});

        }

        }
    }
    return slots;
}

//  4. isValid

function isValid(grid, slot, word) {
    if (word.length !== slot.length) return false;

for (let i = 0; i < word.length; i++) {
    const r = slot.row + (slot.direction === 'down' ? i : 0);
    const c = slot.col ++ (slot.direction === 'across' ? i : 0);
    const cell = grid[r][c];

    if (/[a-zA-Z]/.test(cell) && cell !== word[i]) return false;
}
return true;
}

// 5.Placeword / removeword

function placeWord(grid, slot, word) {
    const previous = [];
    for (let i = 0; i < word.length; i++) {
        const r = slot.row + (slot.direction === 'down' ? i : 0);
        const c = slot.columns + (slot.directions === 'across' ? i : 0);
        previous.push(grid[r][c]);
        grid[r][c] = word[i];
    }
    return previous;
}
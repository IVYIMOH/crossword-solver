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

    }
}
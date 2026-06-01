function crosswordSolver(puzzle, words) {
  // ── 1. Validate inputs ──────────────────────────────────────────────────────
  if (typeof puzzle !== 'string' || !Array.isArray(words) || words.length === 0) {
    console.log('Error');
    return;
  }

  // Words must all be non-empty strings with no duplicates
  if (words.some(w => typeof w !== 'string' || w.length === 0)) {
    console.log('Error');
    return;
  }
  if (new Set(words).size !== words.length) {
    console.log('Error');
    return;
  }

  // ── 2. parseGrid ────────────────────────────────────────────────────────────
  // Converts the puzzle string into a 2D array of characters.
  // Valid characters: digits (0-9), dots (.), newlines.
  function parseGrid(puzzleStr) {
    const lines = puzzleStr.split('\n');
    if (lines.length === 0) return null;

    const rowLength = lines[0].length;
    const grid = [];

    for (const line of lines) {
      if (line.length !== rowLength) return null; // rows must be uniform width
      const row = [];
      for (const ch of line) {
        if (!/^[0-9.]$/.test(ch)) return null; // invalid character
        row.push(ch);
      }
      grid.push(row);
    }
    return grid;
  }

  // ── 3. findSlots ────────────────────────────────────────────────────────────
  // Scans the grid for every word slot (contiguous fillable run).
  // A digit N at a cell means N words start there (1 = across or down, 2 = both).
  // Returns an array of slot objects: { row, col, direction, length }
  function findSlots(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const slots = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (cell === '.') continue;

        const count = parseInt(cell, 10);
        if (isNaN(count) || count < 1 || count > 2) continue;

        // Check for an ACROSS slot starting here
        const canStartAcross =
          (c === 0 || grid[r][c - 1] === '.') &&
          c + 1 < cols && grid[r][c + 1] !== '.';

        if (canStartAcross) {
          let len = 0;
          let tc = c;
          while (tc < cols && grid[r][tc] !== '.') { len++; tc++; }
          if (len >= 2) slots.push({ row: r, col: c, direction: 'across', length: len });
        }

        // Check for a DOWN slot starting here
        const canStartDown =
          (r === 0 || grid[r - 1][c] === '.') &&
          r + 1 < rows && grid[r + 1][c] !== '.';

        if (canStartDown) {
          let len = 0;
          let tr = r;
          while (tr < rows && grid[tr][c] !== '.') { len++; tr++; }
          if (len >= 2) slots.push({ row: r, col: c, direction: 'down', length: len });
        }
      }
    }
    return slots;
  }

  // ── 4. isValid ──────────────────────────────────────────────────────────────
  // Returns true if `word` can be legally placed in `slot` on the current grid.
  // A cell must either be unfilled (digit/original marker) or already match the letter.
  function isValid(grid, slot, word) {
    if (word.length !== slot.length) return false;

    for (let i = 0; i < word.length; i++) {
      const r = slot.row + (slot.direction === 'down' ? i : 0);
      const c = slot.col + (slot.direction === 'across' ? i : 0);
      const cell = grid[r][c];
      // Cell is a letter already placed by a crossing word — must match
      if (/[a-zA-Z]/.test(cell) && cell !== word[i]) return false;
    }
    return true;
  }

  // ── 5. placeWord / removeWord ───────────────────────────────────────────────
  // placeWord writes letters onto the grid, recording what was there before
  // so removeWord can restore it exactly (supports crossing words).
  function placeWord(grid, slot, word) {
    const previous = [];
    for (let i = 0; i < word.length; i++) {
      const r = slot.row + (slot.direction === 'down' ? i : 0);
      const c = slot.col + (slot.direction === 'across' ? i : 0);
      previous.push(grid[r][c]);
      grid[r][c] = word[i];
    }
    return previous; // caller must pass this to removeWord
  }

  function removeWord(grid, slot, previous) {
    for (let i = 0; i < previous.length; i++) {
      const r = slot.row + (slot.direction === 'down' ? i : 0);
      const c = slot.col + (slot.direction === 'across' ? i : 0);
      grid[r][c] = previous[i];
    }
  }

  // ── 6. gridSnapshot ─────────────────────────────────────────────────────────
  // Returns a deep copy of the grid as a printable string.
  function gridSnapshot(grid) {
    return grid.map(row => row.join('')).join('\n');
  }

  // ── 7. solve (recursive backtracker) ────────────────────────────────────────
  // Fills slots one by one, trying every unused word that fits.
  // Stores up to 2 solutions — if we find more than 1, uniqueness is violated
  // and we can stop early.
  function solve(grid, slots, words, used, slotIndex, solutions) {
    if (solutions.length > 1) return; // already know it's non-unique

    if (slotIndex === slots.length) {
      solutions.push(gridSnapshot(grid));
      return;
    }

    const slot = slots[slotIndex];

    for (let i = 0; i < words.length; i++) {
      if (used[i]) continue;
      if (!isValid(grid, slot, words[i])) continue;

      const previous = placeWord(grid, slot, words[i]);
      used[i] = true;

      solve(grid, slots, words, used, slotIndex + 1, solutions);

      removeWord(grid, slot, previous);
      used[i] = false;

      if (solutions.length > 1) return; // short-circuit
    }
  }

  // ── 8. Main orchestration ───────────────────────────────────────────────────
  const grid = parseGrid(puzzle);
  if (!grid) {
    console.log('Error');
    return;
  }

  const slots = findSlots(grid);

  // The number of slots must match the number of words exactly
  if (slots.length !== words.length) {
    console.log('Error');
    return;
  }

  const solutions = [];
  const used = new Array(words.length).fill(false);
  solve(grid, slots, words, used, 0, solutions);

  if (solutions.length !== 1) {
    console.log('Error');
    return;
  }

  console.log(solutions[0]);
}
const puzzle =
  '2001\n' +
  '0..0\n' +
  '1000\n' +
  '0..0';

const words = ['casa', 'alan', 'ciao', 'anta'];

crosswordSolver(puzzle, words);
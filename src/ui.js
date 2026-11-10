export function renderPlayerBoard(container, board) {
  printGrid(container, board, true);
}

export function renderOpponentBoard(container, board) {
  printGrid(container, board, false);
}

function printGrid(container, board, showShips) {
  const size = board.size;
  const hits = board.getHits();
  const misses = board.getMissedAttacks();

  const shipCoords = showShips
    ? board.getShipPlacements().flatMap((placement) => placement.coords)
    : [];

  container.replaceChildren();
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);

    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;

    // A hit is a revealed ship cell on BOTH boards — water + X was asymmetric
    if (hasCoord(hits, x, y)) cell.classList.add("ship", "hit");
    else if (hasCoord(misses, x, y)) cell.classList.add("miss");
    else if (hasCoord(shipCoords, x, y)) cell.classList.add("ship");

    container.append(cell);
  }
}

function hasCoord(coords, x, y) {
  return coords.some(([cx, cy]) => cx === x && cy === y);
}

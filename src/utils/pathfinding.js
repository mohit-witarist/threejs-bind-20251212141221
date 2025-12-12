class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift()?.element;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

export function aStarPathfinding(grid, start, goal) {
  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const key = (x, y) => `${x},${y}`;
  const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  gScore.set(key(start.x, start.y), 0);
  fScore.set(key(start.x, start.y), heuristic(start, goal));
  openSet.enqueue(start, fScore.get(key(start.x, start.y)));

  const neighbors = [
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();

    if (current.x === goal.x && current.y === goal.y) {
      const path = [];
      let node = current;
      while (node) {
        path.unshift(node);
        node = cameFrom.get(key(node.x, node.y));
      }
      return path;
    }

    for (const { dx, dy } of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) continue;
      if (grid.isBlocked(nx, ny)) continue;

      const neighbor = { x: nx, y: ny };
      const tentativeGScore = gScore.get(key(current.x, current.y)) + (dx !== 0 && dy !== 0 ? 1.414 : 1);

      if (!gScore.has(key(nx, ny)) || tentativeGScore < gScore.get(key(nx, ny))) {
        cameFrom.set(key(nx, ny), current);
        gScore.set(key(nx, ny), tentativeGScore);
        fScore.set(key(nx, ny), tentativeGScore + heuristic(neighbor, goal));
        openSet.enqueue(neighbor, fScore.get(key(nx, ny)));
      }
    }
  }

  return null;
}

export class NavGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.blocked = new Set();
  }

  setBlocked(x, y, blocked = true) {
    const key = `${x},${y}`;
    if (blocked) {
      this.blocked.add(key);
    } else {
      this.blocked.delete(key);
    }
  }

  isBlocked(x, y) {
    return this.blocked.has(`${x},${y}`);
  }

  findPath(start, goal) {
    return aStarPathfinding(this, start, goal);
  }
}

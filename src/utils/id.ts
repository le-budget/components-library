let idCounter = 0;

export function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

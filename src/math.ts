export interface RangeResult {
  pivot: number;
  length: number;
}

export function calculateRange(
  itemsQuantity: number,
  itemHeight: number,
  itemColumns: number,
  viewportHeight: number,
  viewportOffset: number,
): RangeResult {
  if (itemsQuantity === 0 || itemHeight === 0 || itemColumns === 0 || viewportHeight === 0) {
    return { pivot: 0, length: 0 };
  }
  if (viewportOffset >= (itemsQuantity * itemHeight)) {
    return { pivot: itemsQuantity, length: 0 };
  }
  const head = Math.max(0, Math.floor(viewportOffset / itemHeight));
  const tail = Math.min(itemsQuantity, Math.ceil((viewportOffset + viewportHeight)/ itemHeight));
  return { pivot: head, length: tail - head };
}

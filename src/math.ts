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
  const pivot = Math.floor(viewportOffset / itemHeight);
  const pivotExceed = viewportOffset % itemHeight ? 1 : 0;
  const viewportLength = Math.ceil(viewportHeight / itemHeight);
  const length = Math.min(itemsQuantity, pivotExceed + viewportLength);
  return { pivot, length };
}

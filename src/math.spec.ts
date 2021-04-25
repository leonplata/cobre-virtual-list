import { expect } from '@open-wc/testing';
import { RangeResult, calculateRange } from './math.js';

describe('math', () => {
  describe('calculateIndexes', () => {
    it('should return length = 0 if there are no indexes', () => {
      const actual = calculateRange(
        0,        // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        100,      // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the item height is zero', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        0,        // itemHeight
        1,        // itemColumns
        100,      // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the item columns is zero', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        0,        // itemColumns
        100,      // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport height is zero', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        0,        // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is equal to the summation of all item heights', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        100,      // viewportHeight
        100,      // viewportOffset
      );
      const expected: RangeResult = { pivot: 10, length: 10 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is some greather than the summation of all item heights', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        100,      // viewportHeight
        105,      // viewportOffset
      );
      const expected: RangeResult = { pivot: 10, length: 10 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is some greather than the summation of all item heights', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        100,      // viewportHeight
        110,      // viewportOffset
      );
      const expected: RangeResult = { pivot: 10, length: 9 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 1 index if the viewport height is less than the item height and there is no offset', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        1,        // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 1 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 1 if the viewport height is equal to the item height and there is no offset', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        10,       // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 1 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 2 if the viewport height is equal to the item height and there is some offset', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        10,       // viewportHeight
        5,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 2 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 2 if the viewport height is some greater than the item height and there is no offset', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        15,       // viewportHeight
        0,        // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 2 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 3 if the viewport height is some greater than the item height and there is some offset', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        15,       // viewportHeight
        7.5,      // viewportOffset
      );
      const expected: RangeResult = { pivot: 0, length: 3 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 2 and pivot = 1 if the viewport height is some greater than the item height and offset bypassed first item height', () => {
      const actual = calculateRange(
        10,       // itemsQuantity
        10,       // itemHeight
        1,        // itemColumns
        15,       // viewportHeight
        10,       // viewportOffset
      );
      const expected: RangeResult = { pivot: 1, length: 2 };
      expect(actual).to.deep.equal(expected);
    });
  });
});

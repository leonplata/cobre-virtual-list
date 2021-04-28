import { expect } from '@open-wc/testing';
import { RangeResult, calculateRange } from './math.js';

describe('math', () => {
  describe('calculateRange', () => {
    it('should handle /cases/1.jpg (viewport fit all items)', () => {
        const actual = calculateRange(10, 10, 1, 100, 0);
        const expected: RangeResult = { head: 0, length: 10 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/2.jpg (viewport fit only the first item)', () => {
        const actual = calculateRange(10, 10, 1, 10, 0);
        const expected: RangeResult = { head: 0, length: 1 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/3.jpg (viewport with offset that can fit one item, partially includes the two first items)', () => {
        const actual = calculateRange(10, 10, 1, 10, 5);
        const expected: RangeResult = { head: 0, length: 2 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/4.jpg (viewport without offset that is some bigger than one item, partially includes the two first items)', () => {
        const actual = calculateRange(10, 10, 1, 15, 0);
        const expected: RangeResult = { head: 0, length: 2 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/5.jpg (viewport with offset that is some bigger than one item, partially includes the two first items)', () => {
        const actual = calculateRange(10, 10, 1, 15, 5);
        const expected: RangeResult = { head: 0, length: 2 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/6.jpg (viewport with offset that is some bigger than one item, partially includes the three first items)', () => {
        const actual = calculateRange(10, 10, 1, 15, 7.5);
        const expected: RangeResult = { head: 0, length: 3 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/7.jpg (viewport with offset that is equal to one item, partially includes two items after the first)', () => {
        const actual = calculateRange(10, 10, 1, 15, 10);
        const expected: RangeResult = { head: 1, length: 2 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/8.jpg (viewport with offset that is a little more than 9 items, partially includes the last item)', () => {
        const actual = calculateRange(10, 10, 1, 15, 95);
        const expected: RangeResult = { head: 9, length: 1 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/9.jpg (viewport with offset that is equal to 10 items, no items are included)', () => {
        const actual = calculateRange(10, 10, 1, 15, 100);
        const expected: RangeResult = { head: 10, length: 0 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/10.jpg (viewport with offset that is less than the first item, partially includes first item)', () => {
        const actual = calculateRange(10, 10, 1, 15, -10);
        const expected: RangeResult = { head: 0, length: 1 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/11.jpg (viewport with offset that is less than the first item, no items are included)', () => {
        const actual = calculateRange(10, 10, 1, 15, -15);
        const expected: RangeResult = { head: 0, length: 0 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/12.jpg (viewport without offset, viewport overflows all items)', () => {
        const actual = calculateRange(7, 10, 1, 100, 0);
        const expected: RangeResult = { head: 0, length: 7 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/13.jpg (viewport without offset, viewport overflows all items)', () => {
        const actual = calculateRange(7, 10, 1, 100, -30);
        const expected: RangeResult = { head: 0, length: 7 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/14.jpg (viewport without offset, viewport overflows all items)', () => {
        const actual = calculateRange(4, 10, 1, 100, -30);
        const expected: RangeResult = { head: 0, length: 4 };
        expect(actual).to.deep.equal(expected);
    });
    it('should handle /cases/15.jpg (viewport without offset, viewport fit all items)', () => {
        const actual = calculateRange(4, 10, 1, 70, -30);
        const expected: RangeResult = { head: 0, length: 4 };
        expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if there are no indexes', () => {
      const actual = calculateRange(0, 10, 1, 100, 0);
      const expected: RangeResult = { head: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the item height is zero', () => {
      const actual = calculateRange(10, 0, 1, 100, 0);
      const expected: RangeResult = { head: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the item columns is zero', () => {
      const actual = calculateRange(10, 10, 0, 100, 0);
      const expected: RangeResult = { head: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport height is zero', () => {
      const actual = calculateRange(10, 10, 1, 0, 0);
      const expected: RangeResult = { head: 0, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is equal to the summation of all item heights', () => {
      const actual = calculateRange(10, 10, 1, 100, 100);
      const expected: RangeResult = { head: 10, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is some greather than the summation of all item heights', () => {
      const actual = calculateRange(10, 10, 1, 100, 105);
      const expected: RangeResult = { head: 10, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
    it('should return length = 0 if the viewport offset is some greather than the summation of all item heights', () => {
      const actual = calculateRange(10, 10, 1, 100, 110);
      const expected: RangeResult = { head: 10, length: 0 };
      expect(actual).to.deep.equal(expected);
    });
  });
});

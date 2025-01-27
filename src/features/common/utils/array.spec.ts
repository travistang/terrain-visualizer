import { interpolate, splitArrayBy } from "./array";

describe("array utils", () => {
  describe("splitArrayBy", () => {
    it("should return empty array when input is empty array", () => {
      expect(splitArrayBy([], 42)).toEqual([]);
    });

    it("should return array with original array when split item is not found", () => {
      expect(splitArrayBy([1, 2, 3], 42)).toEqual([[1, 2, 3]]);
    });

    it("should split array by items properly", () => {
      expect(splitArrayBy([1, 2, null, 3], null)).toEqual([[1, 2], [3]]);
    });

    it("should handle multiple split items present in array", () => {
      expect(splitArrayBy([1, 2, null, 3, null, 4, null, 5, 6], null)).toEqual([
        [1, 2],
        [3],
        [4],
        [5, 6],
      ]);
    });

    it("should handle split items appearing consecutively", () => {
      expect(splitArrayBy([1, 2, null, null, null, 3, null, 4], null)).toEqual([
        [1, 2],
        [3],
        [4],
      ]);
    });

    it("should handle split items at the beginning or end of the array", () => {
      expect(
        splitArrayBy(
          [null, 1, 2, null, null, null, 3, null, 4, null, null],
          null
        )
      ).toEqual([[1, 2], [3], [4]]);
    });
  });

  describe("interpolate", () => {
    it("should return the exact value when coordinates are integers", () => {
      const arrayField = [
        [1, 2],
        [3, 4],
      ];

      const result = interpolate(arrayField, [0, 0]);
      expect(result).toBe(1);

      const result2 = interpolate(arrayField, [1, 1]);
      expect(result2).toBe(4);
    });

    it("should interpolate between four surrounding points correctly", () => {
      const arrayField = [
        [1, 2],
        [3, 4],
      ];

      const result = interpolate(arrayField, [0.5, 0.5]);
      expect(result).toBe(2.5);
    });

    it("should handle non-integer coordinates correctly", () => {
      const arrayField = [
        [10, 20],
        [30, 40],
      ];

      const result = interpolate(arrayField, [0.25, 0.75]);
      expect(result).toBe(27.5);
    });

    it("should return transformed values when transformFn is provided", () => {
      const arrayField = [
        [1, 2],
        [3, 4],
      ];

      const result = interpolate(arrayField, [0.5, 0.5], (x) => x * 10);
      expect(result).toBe(25);
    });

    it("should handle edge cases when coordinates are on the border of the array", () => {
      const arrayField = [
        [1, 2],
        [3, 4],
      ];

      const result = interpolate(arrayField, [0, 1]);
      expect(result).toBe(3);

      const result2 = interpolate(arrayField, [1, 0]);
      expect(result2).toBe(2);
    });

    it("should handle edge cases where the coordinates are exactly in the center", () => {
      const arrayField = [
        [10, 20],
        [30, 40],
      ];

      const result = interpolate(arrayField, [0.5, 0.5]);
      expect(result).toBe(25);
    });

    it("should handle larger arrays and non-integer coordinates", () => {
      const arrayField = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];

      const result = interpolate(arrayField, [1.5, 1.5]);
      expect(result).toBe(7);
    });

    it("should work with negative values within array bounds", () => {
      const arrayField = [
        [-1, -2],
        [-3, -4],
      ];

      const result = interpolate(arrayField, [0.5, 0.5]);
      expect(result).toBe(-2.5);
    });
  });
});

export const splitArrayBy = <T>(arr: T[], ele: T): T[][] => {
  if (arr.length === 0) return [];
  const splitIndex = arr.findIndex((t) => t === ele);
  if (splitIndex === -1) return [arr];
  return [
    arr.slice(0, splitIndex),
    ...splitArrayBy(arr.slice(splitIndex + 1), ele),
  ].filter((segment) => segment.length > 0);
};

export const interpolate = <T>(
  arrayField: T[][],
  coordinates: [number, number],
  valueFn: (t: T) => number = (t) => +t
): number | null => {
  const isArrayFieldMalformed =
    arrayField.length === 0 || arrayField.some((row) => row.length === 0);
  if (isArrayFieldMalformed) return null;

  const [x, y] = coordinates;
  const [height, width] = [arrayField.length, arrayField[0].length];
  const isCoordinatesOutOfBound = x < 0 || x >= width || y < 0 || y >= height;
  if (isCoordinatesOutOfBound) return null;

  let x1 = Math.floor(x);
  let x2 = x1 + 1;
  let y1 = Math.floor(y);
  let y2 = y1 + 1;

  // nudge indices when they're out of bounds
  if (x1 < 0) {
    x1 = 0;
    x2 = 1;
  }
  if (y1 < 0) {
    y1 = 0;
    y2 = 1;
  }
  if (x2 > width - 1) {
    x2 = width - 1;
    x1 = width - 2;
  }
  if (y2 > height - 1) {
    y2 = height - 1;
    y1 = height - 2;
  }

  const q11 = valueFn(arrayField[y1][x1]);
  const q12 = valueFn(arrayField[y1][x2]);
  const q21 = valueFn(arrayField[y2][x1]);
  const q22 = valueFn(arrayField[y2][x2]);

  const w11 = (x2 - x) * (y2 - y);
  const w12 = (x - x1) * (y2 - y);
  const w21 = (x2 - x) * (y - y1);
  const w22 = (x - x1) * (y - y1);

  return q11 * w11 + q12 * w12 + q21 * w21 + q22 * w22;
};

export const removeConsecutiveDuplicate = <T>(
  arr: T[],
  compareFn = (a: T, b: T) => a === b
) => {
  const result: T[] = [];
  for (const element of arr) {
    if (!result.length) {
      result.push(element);
      continue;
    }
    if (!compareFn(result.at(-1)!, element)) {
      result.push(element);
    }
  }
  return result;
};

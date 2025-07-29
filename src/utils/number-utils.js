export function getRandomInt(min, max) {
  min = Math.ceil(min);   // Round up to the next whole number
  max = Math.floor(max);  // Round down to the previous whole number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getTwoUniqueRandomInts(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max - min < 1) {
    return [min, min]; // If the range is too small, return the same number twice
  }
  const first = Math.floor(Math.random() * (max - min + 1)) + min;
  let second;
  do {
    second = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (second === first);
  return [first, second];
}

const toPositiveInt = (value, fallback, max = Infinity) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return fallback;
  return Math.min(n, max);
};

export default toPositiveInt;

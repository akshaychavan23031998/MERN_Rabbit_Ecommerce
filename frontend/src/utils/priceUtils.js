export const formatPriceWithPsychology = (price, rate = 83.3) => {
  const converted = Math.round(price * rate);
  if (converted <= 99) return 99;
  const rounded = Math.floor(converted / 10) * 10;
  return rounded - 1; // Makes 250 -> 249, 300 -> 299
};

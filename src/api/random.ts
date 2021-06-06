export const randomUniform = (minValue: number, maxValue: number) =>
  minValue + (maxValue - minValue) * Math.random();

export const randomExponential = (meanValue: number) =>
  -meanValue * Math.log(1 - Math.random());

export const randomNormal = (meanValue = 0, stdDeviationValue = 1) => {
  const r1 = Math.random();
  const r2 = Math.random();
  const z1 = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
  return meanValue + stdDeviationValue * z1;
};

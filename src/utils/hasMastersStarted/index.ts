export const hasMastersStarted = () => {
  const mastersStart = new Date('04/07/2022 12:00');

  return new Date() >= mastersStart;
};

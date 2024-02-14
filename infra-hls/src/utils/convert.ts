export const arrayToString = <T>(values: T[]) => {
  return values.join(',');
};

export const jsonParse = <T extends string>(value: T) => {
  let result;
  try {
    result = JSON.parse(value);
  } catch (error) {
    throw new Error(error);
  }
  return result;
};

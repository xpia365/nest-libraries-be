export const jsonToString = <T>(v: T[]): string => {
  return JSON.stringify({ objects: v });
};

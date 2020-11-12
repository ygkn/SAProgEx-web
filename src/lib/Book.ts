export type Book = {
  ID: number;
  AUTHOR: string;
  TITLE: string;
  PUBLISHER: string;
  PRICE: number;
  ISBN: string;
};

export const isbnTo10 = (isbn: string): string | undefined => {
  if (isbn.length === 10) {
    return isbn;
  }

  if (isbn.length !== 13) {
    return undefined;
  }

  const dataPart = isbn.slice(3, -1);

  const sum = dataPart
    .split('')
    .reduce(
      (prevSum, digit, index) =>
        prevSum + Number.parseInt(digit, 10) * (10 - index),
      0
    );

  const checkSum = 11 - (sum % 11);

  const checkDigit =
    // eslint-disable-next-line no-nested-ternary
    checkSum === 10 ? 'X' : checkSum === 11 ? '0' : checkSum.toString(10);

  return `${dataPart}${checkDigit}`;
};

export type Book = {
  id: number;
  author: string;
  title: string;
  publisher: string;
  price: number;
  isbn: string;
};

export const isbnTo10 = (isbn: string): string | undefined => {
  const trimmedIsbn = isbn.trim();

  if (trimmedIsbn.length === 10) {
    return trimmedIsbn;
  }

  if (trimmedIsbn.length !== 13) {
    return undefined;
  }

  const dataPart = trimmedIsbn.slice(3, -1);

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

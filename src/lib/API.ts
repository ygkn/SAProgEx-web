import { Book } from './Book';

export type QueryKey = 'books' | 'books/suggestions';

export type QueryParams<Key extends QueryKey> = {
  books: {
    query?: string;
    after?: number;
    count?: number;
    'sort-field'?: keyof Book;
    'sort-direction'?: 'asc' | 'desc';
  };
  'books/suggestions': { query?: string };
}[Key];

export type QueryResult<Key extends QueryKey> = {
  books: { items: Book[]; total: number; hasMore: boolean };
  'books/suggestions': string[];
}[Key];

export const fetchAPI = async <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  cursor: Partial<QueryParams<Key>> = {}
): Promise<QueryResult<Key>> => {
  const paramsString = Object.entries({ ...params, ...cursor })
    .map(
      ([paramsKey, paramsValue]) =>
        `${encodeURIComponent(paramsKey)}=${encodeURIComponent(paramsValue)}`
    )
    .join('&');

  const result = await fetch(
    `https://booksearchman.herokuapp.com/${key}?${paramsString}`
  );
  return result.json();
};

import { Book } from './Book';

export type QueryKey = 'books' | 'books/suggestions';

export type QueryParams<Key extends QueryKey> = {
  books: { query?: string; after?: number; count?: number };
  'books/suggestions': { query?: string };
}[Key];

export type QueryResult<Key extends QueryKey> = {
  books: { items: Book[]; total: number; hasMore: boolean };
  'books/suggestions': string[];
}[Key];

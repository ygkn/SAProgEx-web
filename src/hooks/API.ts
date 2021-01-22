import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseQueryResult,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from 'react-query';

import { QueryKey, QueryParams, QueryResult, fetchAPI } from '../lib/API';

export const useQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  options: UseQueryOptions<QueryResult<Key>, Error, QueryResult<Key>>
): UseQueryResult<QueryResult<Key>, Error> =>
  useQuery<QueryResult<Key>, Error, QueryResult<Key>>(
    [key, params],
    () => fetchAPI(key, params),
    options
  );

export const useInfiniteQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  options: UseInfiniteQueryOptions<QueryResult<Key>, Error, QueryResult<Key>>
): UseInfiniteQueryResult<QueryResult<Key>, Error> =>
  useInfiniteQuery<QueryResult<Key>, Error, QueryResult<Key>>(
    [key, params],
    () => fetchAPI(key, params),
    options
  );

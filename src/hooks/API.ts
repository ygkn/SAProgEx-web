import {
  QueryConfig,
  useQuery,
  useInfiniteQuery,
  InfiniteQueryConfig,
} from 'react-query';

import { QueryKey, QueryParams, QueryResult } from '../types/API';

const queryAPI = async <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,

  cursor: Partial<QueryParams<Key>> = {}
) => {
  const paramsString = Object.entries({ ...params, ...cursor })
    .map(
      ([paramsKey, paramsValue]) =>
        `${encodeURIComponent(paramsKey)}=${encodeURIComponent(paramsValue)}`
    )
    .join('&');

  const result = await fetch(`http://127.0.0.1:5000/${key}?${paramsString}`);
  return result.json();
};

export const useQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  config?: QueryConfig<QueryResult<Key>, Error>
) => useQuery<QueryResult<Key>, Error>([key, params], queryAPI, config);

export const useInfiniteQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  config?: Omit<
    InfiniteQueryConfig<QueryResult<Key>, Error>,
    'getFetchMore'
  > & {
    getFetchMore?: (
      lastPage: QueryResult<Key>,
      allPages: QueryResult<Key>[]
    ) => boolean | Partial<QueryParams<Key>>;
  }
) => useInfiniteQuery<QueryResult<Key>, Error>([key, params], queryAPI, config);

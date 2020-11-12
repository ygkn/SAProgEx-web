import {
  QueryConfig,
  useQuery,
  useInfiniteQuery,
  InfiniteQueryConfig,
} from 'react-query';

import { QueryKey, QueryParams, QueryResult, fetchAPI } from '../lib/API';

export const useQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  config?: QueryConfig<QueryResult<Key>, Error>
) => useQuery<QueryResult<Key>, Error>([key, params], fetchAPI, config);

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
) => useInfiniteQuery<QueryResult<Key>, Error>([key, params], fetchAPI, config);

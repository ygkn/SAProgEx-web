import { QueryConfig, useQuery } from 'react-query';

import { QueryKey, QueryParams, QueryResult } from '../types/API';

const queryAPI = async <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>
) => {
  const paramsString = Object.entries(params)
    .map(([paramsKey, paramsValue]) => `${paramsKey}=${paramsValue}`)
    .join('&');

  const result = await fetch(`http://127.0.0.1:5000/${key}?${paramsString}`);
  return result.json();
};

const useQueryAPI = <Key extends QueryKey>(
  key: Key,
  params: QueryParams<Key>,
  config?: QueryConfig<QueryResult<Key>, Error>
) => useQuery<QueryResult<Key>, Error>([key, params], queryAPI, config);

export default useQueryAPI;

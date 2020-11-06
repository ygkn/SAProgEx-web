import { QueryKey, QueryParams, QueryResult } from '../types/API';

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

  const result = await fetch(`http://127.0.0.1:5000/${key}?${paramsString}`);
  return result.json();
};

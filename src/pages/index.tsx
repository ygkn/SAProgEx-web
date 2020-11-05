import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';

import { Anchor, Layout, Paragraph, Select, SEO } from '../components';
import { useInfiniteQueryAPI, useQueryAPI } from '../hooks/API';
import { useInfiniteScroll } from '../hooks/infinite-scroll';
import { Book } from '../types/Book';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [sortingField, setSortingField] = useState<keyof Book>('ID');
  const [sortingDirection, setSortingDirection] = useState<'asc' | 'desc'>(
    'asc'
  );

  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>();
  const [suggestionQuery, setSuggestionQuery] = useState<string>('');

  const router = useRouter();

  const { data: suggestions } = useQueryAPI(
    'books/suggestions',
    {
      query: suggestionQuery,
    },
    { enabled: suggestionQuery !== '', keepPreviousData: true }
  );

  const {
    isLoading: isLoadingBookList,
    data: bookList,
    error: bookListError,
    fetchMore: fetchMoreBookList,
  } = useInfiniteQueryAPI(
    'books',
    {
      query: submittedQuery,
      'sort-field': sortingField,
      'sort-direction': sortingDirection,
    },
    {
      enabled: submittedQuery !== undefined,
      getFetchMore: (lastGroup) =>
        lastGroup.hasMore && { after: lastGroup.items.slice(-1)[0].ID },
      keepPreviousData: true,
    }
  );

  const { loaderRef } = useInfiniteScroll<HTMLParagraphElement>(
    fetchMoreBookList
  );

  useEffect(() => {
    const query = [router.query.q].flat()[0];

    setInputtingQuery(query ?? '');
    setSubmittedQuery(query);
  }, [router.query.q]);

  const handleChangeQuery = useCallback(
    (_: unknown, { newValue }: { newValue: string }) =>
      setInputtingQuery(newValue),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push({ query: { q: inputtingQuery } }, undefined, { shallow: true });
  };

  const totalCount = bookList?.[0] && bookList[0].total;

  return (
    <>
      <SEO title="" description="蔵書を検索" path="/" />
      <Layout>
        <form className="sticky top-0 pt-12 bg-white" onSubmit={handleSubmit}>
          <Autosuggest
            suggestions={
              suggestionQuery !== '' && suggestions ? suggestions : []
            }
            onSuggestionsFetchRequested={({ value }) =>
              setSuggestionQuery(value)
            }
            onSuggestionsClearRequested={() => setSuggestionQuery('')}
            getSuggestionValue={(value) => value}
            renderSuggestion={(suggestion) => <>{suggestion}</>}
            renderInputComponent={(inputProps) => (
              <div className="flex">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...inputProps}
                />

                {inputProps.value !== '' && (
                  <button
                    type="button"
                    className="py-1 px-3 mr-2 bg-red-500 font-bold text-white self-center rounded-full focus:outline-none focus:shadow-outline w-auto transition-all duration-200"
                    onClick={() => {
                      setInputtingQuery('');
                      setSuggestionQuery('');
                    }}
                  >
                    取消
                  </button>
                )}

                <button
                  type="submit"
                  className="py-1 px-2 mr-3 bg-blue-500 font-bold text-white self-center rounded-full focus:outline-none focus:shadow-outline w-auto transition-shadow duration-200 glow-blue-500 hover:glow-blue-500-md"
                >
                  {inputProps.value === '' ? '全て表示' : '検索'}
                </button>
              </div>
            )}
            renderSuggestionsContainer={({
              containerProps,
              children,
              query,
            }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <div {...containerProps}>
                {children}
                {children !== null && (
                  <p className="px-4 py-2 text-gray-800">
                    <kbd className="px-1 rounded m-1 bg-gray-100 border border-b-2">
                      Enter
                    </kbd>
                    を押して <strong>{query}</strong> で検索、
                    <kbd className="px-1 rounded m-1 bg-gray-100 border border-b-2">
                      ↑
                    </kbd>
                    <kbd className="px-1 rounded m-1 bg-gray-100 border border-b-2">
                      ↓
                    </kbd>
                    を押して候補を選択
                  </p>
                )}
              </div>
            )}
            inputProps={{
              type: 'search',
              name: 'query',
              onChange: handleChangeQuery,
              value: inputtingQuery,
              placeholder: '検索キーワードを入力 （無入力で全て表示）',
              list: 'search-suggestions',
              autoComplete: 'off',
            }}
            theme={{
              container:
                'absolute z-10 top-0 bg-white rounded shadow w-full rounded-3xl ' +
                'focus-within:shadow-md transition-shadow duration-200',
              input: 'flex-grow focus:outline-none py-3 px-4 bg-transparent',
              suggestion: 'py-1 px-4 truncate cursor-pointer',
              suggestionHighlighted: 'bg-blue-500 text-white',
            }}
          />
          <div className="p-3 flex justify-end">
            <label>
              並び替え項目
              <Select
                name="sorting-field"
                value={sortingField}
                onChange={(event) =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore TODO: make sure event.currentTarget.value is keyof Book
                  setSortingField(event.currentTarget.value)
                }
                options={[
                  { value: 'ID', label: 'ID' },
                  { value: 'AUTHOR', label: '著者' },
                  { value: 'TITLE', label: 'タイトル' },
                  { value: 'PUBLISHER', label: '出版社' },
                  { value: 'PRICE', label: '値段' },
                  { value: 'ISBN', label: 'ISBN' },
                ]}
              />
            </label>

            <label>
              並び替え方向
              <Select
                name="sorting-direction"
                value={sortingDirection}
                onChange={(event) =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore TODO: make sure event.currentTarget.value 'asc' or 'desc'
                  setSortingDirection(event.currentTarget.value)
                }
                options={[
                  { value: 'asc', label: '小→大' },
                  { value: 'desc', label: '大→小' },
                ]}
              />
            </label>
          </div>
        </form>

        <section className="py-4">
          {submittedQuery !== undefined &&
            totalCount !== undefined &&
            totalCount !== 0 && (
              <Paragraph>{totalCount} 件見つかりました</Paragraph>
            )}
          {submittedQuery !== undefined && totalCount === 0 && (
            <Paragraph>該当する書籍が見つかりませんでした</Paragraph>
          )}
        </section>

        {bookListError && (
          <section>
            <Paragraph>エラーが発生しました</Paragraph>
            <Paragraph>
              <b>{bookListError.message}</b>
            </Paragraph>
          </section>
        )}

        {submittedQuery !== undefined && (
          <div className="border rounded-sm">
            {bookList
              ?.flatMap(({ items }) => items)
              .map((book) => (
                <article key={book.ID} className="p-4 border-b">
                  <h1 className="font-bold">{book.TITLE}</h1>
                  <p>
                    <span className="inline-block mr-2">
                      著:{' '}
                      <Link href={`?q=${book.AUTHOR}`} passHref shallow>
                        <Anchor>{book.AUTHOR}</Anchor>
                      </Link>
                    </span>
                    <span className="inline-block mr-2">
                      出版:{' '}
                      <Link href={`?q=${book.PUBLISHER}`} passHref shallow>
                        <Anchor>{book.PUBLISHER}</Anchor>
                      </Link>
                    </span>
                    <span className="inline-block mr-2">
                      値段: {book.PRICE}円
                    </span>
                  </p>
                </article>
              ))}

            <p ref={loaderRef} className="p-4 text-center">
              {isLoadingBookList ? '検索中……' : '結果は以上です'}
            </p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default IndexPage;

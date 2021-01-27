import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';

import { Anchor, Keytop, Layout, Paragraph, Select, SEO } from '../components';
import { useInfiniteQueryAPI, useQueryAPI } from '../hooks/API';
import { useFocusKey } from '../hooks/focusKey';
import { useInfiniteScroll } from '../hooks/infinite-scroll';
import { Book, isbnTo10 } from '../lib/Book';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [sortingField, setSortingField] = useState<keyof Book>('id');
  const [sortingDirection, setSortingDirection] = useState<'asc' | 'desc'>(
    'asc'
  );

  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>();
  const [suggestionQuery, setSuggestionQuery] = useState<string>('');

  const searchInputRef = useFocusKey('/');

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
    fetchNextPage: fetchNextBookList,
  } = useInfiniteQueryAPI(
    'books',
    {
      query: submittedQuery,
      'sort-field': sortingField,
      'sort-direction': sortingDirection,
    },
    {
      enabled: submittedQuery !== undefined,
      getNextPageParam: (lastGroup) =>
        lastGroup.hasMore && { after: lastGroup.items.slice(-1)[0].id },
      keepPreviousData: true,
    }
  );

  const { loaderRef } = useInfiniteScroll<HTMLParagraphElement>(
    fetchNextBookList
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

    setSubmittedQuery(inputtingQuery);

    router.push(
      { query: inputtingQuery !== '' ? { q: inputtingQuery } : undefined },
      undefined,
      { shallow: true }
    );
  };

  const totalCount = bookList?.pages?.[0]?.total;

  return (
    <>
      <SEO title="" description="蔵書を検索" path="/" />
      <Layout>
        <form className="sticky top-0 pt-12 bg-blue-50" onSubmit={handleSubmit}>
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
                    className="py-1 px-3 mr-2 text-red-500 border-current border-2 font-bold bg-white self-center rounded-full focus:outline-none transition-shadow ring-0 focus:ring duration-200 ring-red-300 flex-shrink-0"
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
                  className="py-1 px-2 mr-3 bg-blue-500 font-bold text-white self-center rounded-full focus:outline-none focus:ring transition-shadow duration-200 glow-blue-500 hover:glow-blue-500-md flex-shrink-0"
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
                    <Keytop>Enter</Keytop>
                    を押して <strong>{query}</strong> で検索、
                    <Keytop>↑</Keytop>
                    <Keytop>↓</Keytop>
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
              placeholder:
                '検索キーワードを入力、無入力で全て表示 ("/" を押してフォーカス)',
              list: 'search-suggestions',
              autoComplete: 'off',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              ref: searchInputRef,
            }}
            theme={{
              container:
                'absolute z-10 top-0 bg-white rounded shadow w-full rounded-3xl ' +
                'focus-within:shadow-md transition-shadow duration-200',
              input:
                'flex-grow flex-shrink min-w-0 focus:outline-none py-3 px-4 bg-transparent',
              suggestion: 'py-1 px-4 truncate cursor-pointer',
              suggestionHighlighted: 'bg-blue-500 text-white',
            }}
          />
          <div className="p-3 flex justify-end">
            <label className="flex flex-wrap w-min justify-end">
              <span className="whitespace-nowrap mx-1">並び替え項目</span>
              <Select
                name="sorting-field"
                value={sortingField}
                onChange={(event) =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore TODO: make sure event.currentTarget.value is keyof Book
                  setSortingField(event.currentTarget.value)
                }
                options={[
                  { value: 'id', label: 'ID' },
                  { value: 'author', label: '著者' },
                  { value: 'title', label: 'タイトル' },
                  { value: 'publisher', label: '出版社' },
                  { value: 'price', label: '値段' },
                  { value: 'isbn', label: 'ISBN' },
                ]}
              />
            </label>

            <label className="flex flex-wrap w-min justify-end">
              <span className="whitespace-nowrap mx-1">並び替え方向</span>
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
          <section className="my-4 p-4 bg-red-200 text-red-700 rounded border-current border">
            <Paragraph>エラーが発生しました</Paragraph>
            <Paragraph>
              <b>{bookListError.message}</b>
            </Paragraph>
          </section>
        )}

        {submittedQuery !== undefined && (
          <div className="bg-white border rounded-sm">
            {bookList?.pages
              ?.flatMap(({ items }) => items)
              .map((book) => {
                const isbn10 = isbnTo10(book.isbn);
                return (
                  <article key={book.id} className="p-4 border-b">
                    <h1 className="font-bold">{book.title}</h1>
                    <p>
                      <span className="inline-block mr-2">
                        著:{' '}
                        <Link href={`?q=${book.author}`} passHref shallow>
                          <Anchor>{book.author}</Anchor>
                        </Link>
                      </span>
                      <span className="inline-block mr-2">
                        出版:{' '}
                        <Link href={`?q=${book.publisher}`} passHref shallow>
                          <Anchor>{book.publisher}</Anchor>
                        </Link>
                      </span>
                      <span className="inline-block mr-2">
                        値段: {book.price}円
                      </span>
                      {isbn10 && (
                        <span className="inline-block mr-2">
                          <Anchor
                            href={`https://www.amazon.co.jp/dp/${isbn10}`}
                            external
                          >
                            Amazon
                          </Anchor>
                        </span>
                      )}
                    </p>
                  </article>
                );
              })}

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

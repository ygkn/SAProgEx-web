import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';

import { Layout, Paragraph, SEO } from '../components';
import { useInfiniteQueryAPI, useQueryAPI } from '../hooks/API';
import { useInfiniteScroll } from '../hooks/infinite-scroll';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>();

  const [suggestionQuery, setSuggestionQuery] = useState<string>('');

  const router = useRouter();

  const { data: suggestions } = useQueryAPI(
    'books/suggestions',
    {
      query: suggestionQuery,
    },
    { enabled: suggestionQuery !== '' }
  );

  const {
    isLoading: isLoadingBookList,
    data: bookList,
    error: bookListError,
    fetchMore: fetchMoreBookList,
  } = useInfiniteQueryAPI(
    'books',
    { query: submittedQuery },
    {
      enabled: submittedQuery !== undefined,
      getFetchMore: (lastGroup) =>
        lastGroup.hasMore && { after: lastGroup.items.slice(-1)[0].ID },
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
        <form className="sticky top-0 h-12" onSubmit={handleSubmit}>
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
            renderSuggestionsContainer={({
              containerProps,
              children,
              query,
            }) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <div {...containerProps}>
                {children}
                {children !== null && (
                  <p className="px-4 pt-2 text-gray-800">
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
              placeholder: '検索キーワードを入力',
              list: 'search-suggestions',
              autoComplete: 'off',
            }}
            theme={{
              container:
                'absolute top-0 bg-white rounded shadow w-full rounded-3xl py-2 ' +
                'focus-within:shadow-md transition-shadow duration-200',
              input: 'w-full focus:outline-none px-4',
              suggestion: 'py-1 px-4 truncate cursor-pointer',
              suggestionHighlighted: 'bg-blue-500 text-white',
            }}
          />
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
                    <Link href={`?q=${book.AUTHOR}`} passHref shallow>
                      <a className="inline-block mr-2 text-blue-600 hover:underline">
                        {book.AUTHOR}著
                      </a>
                    </Link>
                    <Link href={`?q=${book.PUBLISHER}`} passHref shallow>
                      <a className="inline-block mr-2 text-blue-600 hover:underline">
                        {book.PUBLISHER}出版
                      </a>
                    </Link>
                    <span className="inline-block mr-2">{book.PRICE}円</span>
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

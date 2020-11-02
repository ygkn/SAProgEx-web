import { NextPage } from 'next';
import { FormEvent, useCallback, useState } from 'react';

import { Layout, Paragraph, SEO } from '../components';
import { useInfiniteQueryAPI, useQueryAPI } from '../hooks/API';
import { useInfiniteScroll } from '../hooks/infinite-scroll';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<undefined | string>();

  const { data: suggestions } = useQueryAPI(
    'books/suggestions',
    {
      query: inputtingQuery,
    },
    { enabled: inputtingQuery !== '' }
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

  const handleChangeQuery = useCallback(
    (event: FormEvent<HTMLInputElement>) =>
      setInputtingQuery(event.currentTarget.value),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmittedQuery(inputtingQuery);
  };

  const totalCount = bookList?.[0] && bookList[0].total;

  return (
    <>
      <SEO title="" description="蔵書を検索" path="/" />
      <Layout>
        <form className="relative" onSubmit={handleSubmit}>
          <div className="flex">
            <input
              type="search"
              name="query"
              className="flex-grow px-4 py-2 rounded-sm"
              onChange={handleChangeQuery}
              value={inputtingQuery}
              placeholder="検索キーワードを入力"
              list="search-suggestions"
              autoComplete="off"
            />
          </div>
          <datalist id="search-suggestions">
            {suggestions?.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </form>

        {bookListError && (
          <section>
            <Paragraph>エラーが発生しました</Paragraph>
            <Paragraph>
              <b>{bookListError.message}</b>
            </Paragraph>
          </section>
        )}

        {totalCount !== undefined && totalCount !== 0 && (
          <Paragraph>{totalCount} 件見つかりました</Paragraph>
        )}
        {totalCount === 0 && (
          <Paragraph>該当する書籍が見つかりませんでした</Paragraph>
        )}

        <div className="border rounded px-4">
          {bookList
            ?.flatMap(({ items }) => items)
            .map((book) => (
              <article key={book.ID} className="py-4 border-b">
                <h1 className="font-bold">{book.TITLE}</h1>
                <p>
                  {book.AUTHOR}著 {book.PUBLISHER}出版 {book.PRICE}円
                </p>
              </article>
            ))}

          <p ref={loaderRef} className="my-4 text-center">
            {isLoadingBookList ? '検索中……' : '結果は以上です'}
          </p>
        </div>
      </Layout>
    </>
  );
};

export default IndexPage;

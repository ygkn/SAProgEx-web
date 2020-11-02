import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { Layout, Paragraph, SEO } from '../components';
import { useInfiniteQueryAPI, useQueryAPI } from '../hooks/API';
import { useInfiniteScroll } from '../hooks/infinite-scroll';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>();

  const router = useRouter();

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

  useEffect(() => {
    const query = [router.query.q].flat()[0];

    setInputtingQuery(query ?? '');
    setSubmittedQuery(query);
  }, [router.query.q]);

  const handleChangeQuery = useCallback(
    (event: FormEvent<HTMLInputElement>) =>
      setInputtingQuery(event.currentTarget.value),
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
        <form className="sticky top-0" onSubmit={handleSubmit}>
          <div className="flex shadow focus-within:shadow-outline rounded-full bg-white py-2 px-5">
            <input
              type="search"
              name="query"
              className="flex-grow focus:outline-none"
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
          <div className="border rounded px-4">
            {bookList
              ?.flatMap(({ items }) => items)
              .map((book) => (
                <article key={book.ID} className="py-4 border-b">
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

            <p ref={loaderRef} className="my-4 text-center">
              {isLoadingBookList ? '検索中……' : '結果は以上です'}
            </p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default IndexPage;

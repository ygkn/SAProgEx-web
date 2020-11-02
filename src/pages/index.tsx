import { NextPage } from 'next';
import { FormEvent, useCallback, useState } from 'react';

import { Layout, Paragraph, SEO } from '../components';
import { useInfiniteQueryAPI } from '../hooks/API';
import { useInfiniteScroll } from '../hooks/infinite-scroll';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<undefined | string>();
  );

  const { isLoading, data, error, fetchMore } = useInfiniteQueryAPI(
    'books',
    { query: submittedQuery },
    {
      enabled: submittedQuery !== undefined,
      getFetchMore: (lastGroup) =>
        lastGroup.hasMore && { after: lastGroup.items.slice(-1)[0].ID },
    }
  );

  const { loaderRef } = useInfiniteScroll<HTMLParagraphElement>(fetchMore);

  const handleChangeQuery = useCallback(
    (event: FormEvent<HTMLInputElement>) =>
      setInputtingQuery(event.currentTarget.value),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmittedQuery(inputtingQuery);
  };

  const totalCount = data?.[0] && data[0].total;

  return (
    <>
      <SEO title="" description="蔵書を検索" path="/" />
      <Layout>
        <form className="flex" onSubmit={handleSubmit}>
          <input
            type="search"
            name="query"
            className="flex-grow px-4 py-2 rounded-sm"
            onChange={handleChangeQuery}
            value={inputtingQuery}
            placeholder="検索キーワードを入力"
            autoComplete="off"
          />
        </form>

        {error && (
          <section>
            <Paragraph>エラーが発生しました</Paragraph>
            <Paragraph>
              <b>{error.message}</b>
            </Paragraph>
          </section>
        )}

        {totalCount !== undefined && totalCount !== 0 && (
          <Paragraph>{totalCount} 件見つかりました</Paragraph>
        )}
        {totalCount === 0 && (
          <Paragraph>該当する書籍が見つかりませんでした</Paragraph>
        )}

        {(data ?? [])
          .flatMap((datum) => datum.items)
          .map((book) => (
            <article key={book.ID}>{book.TITLE}</article>
          ))}

        <p ref={loaderRef}>{isLoading ? '検索中……' : '結果は以上です'}</p>
      </Layout>
    </>
  );
};

export default IndexPage;

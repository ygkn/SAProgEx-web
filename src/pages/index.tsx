import { NextPage } from 'next';
import { FormEvent, useCallback, useState } from 'react';

import { Layout, Paragraph, SEO } from '../components';
import { useQueryAPI } from '../hooks';

const IndexPage: NextPage = () => {
  const [inputtingQuery, setInputtingQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<undefined | string>(
    undefined
  );

  const { isLoading, data, error } = useQueryAPI(
    'books',
    { query: submittedQuery },
    { enabled: submittedQuery !== undefined }
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

        {data?.total && <Paragraph>{data.total} 件見つかりました</Paragraph>}
        {data && data.total === 0 && (
          <Paragraph>該当する書籍が見つかりませんでした</Paragraph>
        )}

        {data &&
          data.items.map((book) => (
            <article key={book.ID}>{book.TITLE}</article>
          ))}

        {isLoading && <p>検索中……</p>}
      </Layout>
    </>
  );
};

export default IndexPage;

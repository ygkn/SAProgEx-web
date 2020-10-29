import { NextPage } from 'next';

import { Heading, Layout, SEO } from '../components';

const IndexPage: NextPage = () => (
  <>
    <SEO title="" description="蔵書を検索" path="/" />
    <Layout>
      <Heading>Hello! World</Heading>
    </Layout>
  </>
);

export default IndexPage;

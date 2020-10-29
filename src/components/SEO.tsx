import { NextSeo } from 'next-seo';
import { FC } from 'react';

const SEO: FC<{ title: string; path: string; description: string }> = ({
  title,
  path,
  description,
}) => {
  const url = `${path}`;
  const fullTitle = `${title && `${title} | `}蔵書検索くん`;

  return (
    <NextSeo title={fullTitle} canonical={url} description={description} />
  );
};

export default SEO;

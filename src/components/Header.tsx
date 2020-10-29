import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => (
  <header>
    <nav>
      <h1 className="text-4xl">
        <Link href="/">
          <a>蔵書検索くん</a>
        </Link>
      </h1>
    </nav>
  </header>
);

export default Header;

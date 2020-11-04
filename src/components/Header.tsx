import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => (
  <header>
    <nav>
      <h1 className="text-4xl">
        <Link href="/">
          <a className="flex items-baseline">
            <img
              src="mark.svg"
              alt="マーク"
              className="h-8 mr-1 inline-block"
            />
            <span>蔵書検索くん</span>
          </a>
        </Link>
      </h1>
    </nav>
  </header>
);

export default Header;

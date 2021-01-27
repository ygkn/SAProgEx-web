import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => (
  <header>
    <nav>
      <h1 className="text-4xl pt-2 pb-6">
        <Link href="/">
          <a className="flex items-baseline">
            <img
              width="512"
              height="512"
              src="mark.svg"
              alt="マーク"
              className="h-8 w-8 mr-1 inline-block"
            />
            <span>蔵書検索くん</span>
          </a>
        </Link>
      </h1>
    </nav>
  </header>
);

export default Header;

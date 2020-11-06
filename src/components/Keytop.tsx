import { FC } from 'react';

const Keytop: FC = ({ children }) => (
  <kbd className="px-1 rounded m-1 bg-gray-100 border border-b-2">
    {children}
  </kbd>
);

export default Keytop;

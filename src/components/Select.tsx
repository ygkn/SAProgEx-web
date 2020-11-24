import { FC, FormEvent } from 'react';

type Props = {
  name: string;
  value: string;
  onChange: (event: FormEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

const Select: FC<Props> = ({ name, value, onChange, options }) => (
  <span className="relative mx-1">
    {/* eslint-disable-next-line jsx-a11y/no-onchange */}
    <select
      name={name}
      className="appearance-none rounded-full bg-gray-300 text-black px-4 py-1 pr-8 focus:bg-gray-100 focus:outline-none focus:ring"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <svg
      className="absolute right-0 top-0 mr-4 mt-2 h-3 pointer-events-none"
      viewBox="0 0 34 34"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33 9L17 25L1 9"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </span>
);

export default Select;

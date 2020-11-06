import { forwardRef, HTMLProps } from 'react';

type Props = Pick<HTMLProps<HTMLAnchorElement>, 'children' | 'href'> & {
  external?: boolean;
};

const Anchor = forwardRef<HTMLAnchorElement, Props>(
  ({ children, href, external = false }, ref) => (
    <a
      className=" text-blue-700 hover:underline focus:underline cursor-pointer align-top"
      href={href}
      ref={ref}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
    >
      {external && (
        <svg
          className="inline-block h-3 mr-1"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 12C7.18629 12 4.5 14.6863 4.5 18V34C4.5 37.3137 7.18629 40 10.5 40H26.5C29.8137 40 32.5 37.3137 32.5 34V26C32.5 24.8954 33.3954 24 34.5 24C35.6046 24 36.5 24.8954 36.5 26V34C36.5 39.5228 32.0228 44 26.5 44H10.5C4.97715 44 0.5 39.5228 0.5 34V18C0.5 12.4772 4.97715 8 10.5 8H18.5C19.6046 8 20.5 8.89543 20.5 10C20.5 11.1046 19.6046 12 18.5 12H10.5Z"
            className="fill-current"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M43.4142 0.585786C44.1953 1.36684 44.1953 2.63317 43.4142 3.41421L19.4142 27.4142C18.6332 28.1953 17.3668 28.1953 16.5858 27.4142C15.8047 26.6332 15.8047 25.3668 16.5858 24.5858L40.5858 0.585786C41.3668 -0.195262 42.6332 -0.195262 43.4142 0.585786Z"
            className="fill-current"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.8 2C20.8 0.89543 21.6954 0 22.8 0H42C43.1046 0 44 0.89543 44 2V21.2C44 22.3046 43.1046 23.2 42 23.2C40.8954 23.2 40 22.3046 40 21.2V4H22.8C21.6954 4 20.8 3.10457 20.8 2Z"
            className="fill-current"
          />
        </svg>
      )}
      {children}
    </a>
  )
);

Anchor.displayName = 'Anchor';

export default Anchor;

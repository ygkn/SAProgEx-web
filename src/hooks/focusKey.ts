import { useRef, useEffect, MutableRefObject } from 'react';

export const useFocusKey = <RefElement extends HTMLElement>(
  key: string
): MutableRefObject<RefElement | null> => {
  const ref = useRef<RefElement>(null);

  useEffect(() => {
    const focus = (event: KeyboardEvent): void => {
      if (event.key === key) {
        ref.current?.focus();
      }
    };

    document.addEventListener('keyup', focus);

    return () => document.removeEventListener('keyup', focus);
  }, [key]);

  return ref;
};

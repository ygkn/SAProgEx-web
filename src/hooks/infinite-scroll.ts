import { useRef, useEffect, MutableRefObject } from 'react';

export const useInfiniteScroll = <RefElement extends Element>(
  fetchMore: () => void,
  intersectionObserverInit?: IntersectionObserverInit
): {
  loaderRef: MutableRefObject<RefElement | null>;
} => {
  const loaderRef = useRef<RefElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([target]) => {
      if (!target.isIntersecting) {
        return;
      }

      fetchMore();
    }, intersectionObserverInit);

    if (loaderRef.current !== null) {
      observer.observe(loaderRef.current);
    }

    return (): void => {
      if (loaderRef.current !== null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchMore, intersectionObserverInit]);

  return { loaderRef };
};

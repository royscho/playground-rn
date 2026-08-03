import { useEffect, useState } from 'react';

export const useDebounce = (text: string) => {
  const [search, setsSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setsSearch(text), 1000);
    return () => clearTimeout(timer);
  }, [text]);

  return search;
};

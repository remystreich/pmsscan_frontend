import { useCallback, useEffect } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
   const handleScroll = useCallback(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 20) {
         callback();
      }
   }, [callback]);

   useEffect(() => {
      console.log('useInfiniteScroll');
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [handleScroll]);
};

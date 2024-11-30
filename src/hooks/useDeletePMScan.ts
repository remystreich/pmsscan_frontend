import { useAuthFetch } from '@/hooks/useAuthFetch';

const useDeletePMScan = () => {
   const deletePMScan = (id: number) => {
      console.log('deletePMScan');
      console.log(id);
   };

   return deletePMScan;
};

export default useDeletePMScan;

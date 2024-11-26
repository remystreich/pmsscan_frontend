// src/pages/Home/Home.tsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePMScanListFetch } from '@/hooks/usePMScanListFetch';
import { useAuthStore } from '@/stores/authStore';

const Home = () => {
   const fetchPMScanList = usePMScanListFetch();
   const accessToken = useAuthStore((state) => state.accessToken);

   useEffect(() => {
      console.log('Home useEffect');
      const getPMScanList = async () => {
         if (accessToken) {
            // Vérifie que l'accessToken est disponible
            try {
               const pmscansList = await fetchPMScanList();
               console.log(pmscansList);
            } catch (error) {
               console.error(
                  'Erreur lors de la récupération des PMScans:',
                  error,
               );
            }
         }
      };
      getPMScanList();
   }, [fetchPMScanList, accessToken]);

   return (
      <>
         <div className="card mt-64">
            <h1>Home</h1>
         </div>
      </>
   );
};

export default Home;

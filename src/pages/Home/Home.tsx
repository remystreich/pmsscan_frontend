import { usePMScanListFetch } from '@/hooks/usePMScanListFetch';
import PMScanCard from '@/components/PMScanCard/PMScanCard';
import { PMScan } from '@/types/types';

const Home = () => {
   const { pmscans, isLoading, error } = usePMScanListFetch();

   if (isLoading) {
      return <div>Chargement...</div>;
   }

   if (error) {
      return <div>Erreur: {error}</div>;
   }

   return (
      <>
         <main className="grid grid-cols-1 p-2 lg:grid-cols-2 lg:p-4">
            {pmscans.map((pmscan: PMScan) => (
               <PMScanCard key={pmscan.id} pmscan={pmscan} />
            ))}
         </main>
      </>
   );
};

export default Home;

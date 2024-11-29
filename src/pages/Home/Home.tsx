import { usePMScanListFetch } from '@/hooks/usePMScanListFetch';

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
         <div className="card mt-64">
            <h1>Home</h1>
            {pmscans.map((pmscan) => {
               return <div key={pmscan.id}>{pmscan.deviceName}</div>;
            })}
         </div>
      </>
   );
};

export default Home;

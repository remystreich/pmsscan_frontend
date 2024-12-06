// RecordsContent.tsx
import { useFetchRecords } from '@/hooks/useFetchRecords';

interface RecordsContentProps {
   pmscanId: number;
}

const RecordsContent = ({ pmscanId }: RecordsContentProps) => {
   const { response, isLoading, error } = useFetchRecords(pmscanId, 1, 10);

   if (isLoading) return <div>Chargement des enregistrements...</div>;
   if (error) return <div>Erreur: {error}</div>;

   console.log(response);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {/* Affichez les enregistrements ici */}
         {JSON.stringify(response)}
      </div>
   );
};

export default RecordsContent;

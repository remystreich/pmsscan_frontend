import { useFetchRecords } from '@/hooks/useFetchRecords';
import { RecordCard } from '@/components/RecordCard/RecordCard';
import { useEffect, useState } from 'react';
import { useDeleteRecord } from '@/hooks/useDeleteRecord';

interface RecordsContentProps {
   pmscanId: number;
}

interface Record {
   id: number;
   name: string;
   pmScanId: number;
   createdAt: string;
   updatedAt: string;
   type: string;
   measuresCount: number;
}
interface Meta {
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}
interface ResponseType {
   records: Record[];
   meta: Meta;
}

const RecordsContent = ({ pmscanId }: RecordsContentProps) => {
   const { response, isLoading, error } = useFetchRecords<ResponseType>(pmscanId, 1, 20);
   const deleteRecord = useDeleteRecord();
   const [records, setRecords] = useState<Record[]>([]);

   useEffect(() => {
      if (response?.records) {
         setRecords(response.records);
      }
   }, [response]);

   const handleDelete = async (id: number) => {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((record) => record.id !== id));
   };

   if (isLoading) return <div>Chargement des enregistrements...</div>;
   if (error) return <div>Erreur: {error}</div>;

   return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
         {records.map((record) => (
            <RecordCard
               key={record.id}
               recordName={record.name}
               measuresCount={record.measuresCount}
               type={record.type}
               onDelete={() => handleDelete(record.id)}
            />
         ))}
      </div>
   );
};

export default RecordsContent;

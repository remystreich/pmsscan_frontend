import { useFetchRecords } from '@/hooks/useFetchRecords';
import { RecordCard } from '@/components/RecordCard/RecordCard';
import { useEffect, useState } from 'react';
import { useDeleteRecord } from '@/hooks/useDeleteRecord';
import { ChartModal } from '@/components/ChartModal/ChartModal';
import { RecordData } from '@/types/types';
import { useGetSingleRecord } from '@/hooks/useGetSingleRecord';

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
   const { fetchRecord, data, loading: singleRecordLoading, error: singleRecordError } = useGetSingleRecord();

   const [records, setRecords] = useState<Record[]>([]);
   const [isChartVisible, setIsChartVisible] = useState(false);
   const [recordData, setRecordData] = useState<RecordData>({
      id: 0,
      createdAt: '',
      updatedAt: '',
      data: {
         type: '',
         data: [],
      },
      name: '',
      type: '',
      pmScanId: 0,
   });

   useEffect(() => {
      if (response?.records) {
         setRecords(response.records);
      }
   }, [response]);

   const handleDelete = async (id: number) => {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((record) => record.id !== id));
   };

   const handleViewChart = async (id: number) => {
      await fetchRecord(id);
      // setPmDataForChart(data);
      if (data == null) return;
      setRecordData(data);
      setIsChartVisible(true);

      // const buffer = new Uint8Array(data.data.data);
      // const segments = [];
      // for (let i = 0; i < buffer.length; i += 20) {
      //    segments.push(buffer.slice(i, i + 20));
      // }
   };

   const onChartClose = () => {
      setIsChartVisible(false);
   };

   if (isLoading) return <div>Chargement des enregistrements...</div>;
   if (error) return <div>Erreur: {error}</div>;

   return (
      <>
         <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
               <RecordCard
                  key={record.id}
                  recordName={record.name}
                  measuresCount={record.measuresCount}
                  type={record.type}
                  onDelete={() => handleDelete(record.id)}
                  onViewChart={() => handleViewChart(record.id)}
               />
            ))}
         </div>
         <ChartModal recordData={recordData} isVisible={isChartVisible} onClose={onChartClose} />
      </>
   );
};

export default RecordsContent;

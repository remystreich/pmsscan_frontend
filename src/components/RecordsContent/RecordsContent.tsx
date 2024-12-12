import { useFetchRecords } from '@/hooks/useFetchRecords';
import { RecordCard } from '@/components/RecordCard/RecordCard';
import { useEffect, useState } from 'react';
import { useDeleteRecord } from '@/hooks/useDeleteRecord';
import { ChartModal } from '@/components/ChartModal/ChartModal';
import { RecordData } from '@/types/types';
import { useGetSingleRecord } from '@/hooks/useGetSingleRecord';
import { usePopupStore } from '@/stores/popupStore';
import { useExportToCsv } from '@/hooks/useExportToCsv';
import { ChangeRecordNameModal } from '@/components/ChangeRecordNameModal/ChangeRecordNameModal';

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
   const { fetchRecord, loading: chartLoading, error: chartError } = useGetSingleRecord();
   const showPopup = usePopupStore((state) => state.showPopup);
   const exportToCsv = useExportToCsv();

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

   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
   const [recordIdToEdit, setRecordIdToEdit] = useState(0);
   const [recordNameToEdit, setRecordNameToEdit] = useState('');

   useEffect(() => {
      if (response?.records) {
         setRecords(response.records);
      }
   }, [response]);

   const handleDelete = async (id: number) => {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((record) => record.id !== id));
   };

   const handleExportToCSV = async (id: number) => {
      await exportToCsv(id);
   };

   const handleViewChart = async (id: number) => {
      const fetchedData = await fetchRecord(id);
      // setPmDataForChart(data);
      if (chartError) {
         showPopup('error', chartError);
         return;
      }

      if (fetchedData == null) return;
      setRecordData(fetchedData);
      setIsChartVisible(true);
   };

   const handleEditName = (name: string, id: number) => {
      setRecordNameToEdit(name);
      setRecordIdToEdit(id);
      setIsEditModalVisible(true);
   };

   const handleRecordUpdate = (recordId: number, newName: string) => {
      setRecords((prevRecords) => prevRecords?.map((record) => (record.id === recordId ? { ...record, name: newName } : record)));
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
                  onExportCSV={() => handleExportToCSV(record.id)}
                  onEditName={() => {
                     handleEditName(record.name, record.id);
                  }}
               />
            ))}
         </div>
         {isChartVisible && (
            <ChartModal recordData={recordData} isVisible={isChartVisible} onClose={onChartClose} loading={chartLoading} />
         )}
         {isEditModalVisible && (
            <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80">
               <ChangeRecordNameModal
                  recordName={recordNameToEdit}
                  recordId={recordIdToEdit}
                  onClose={() => setIsEditModalVisible(false)}
                  onSuccess={handleRecordUpdate}
               />
            </div>
         )}
      </>
   );
};

export default RecordsContent;

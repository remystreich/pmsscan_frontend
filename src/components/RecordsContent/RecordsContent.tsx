import { RecordCard } from '@/components/RecordCard/RecordCard';
import { useEffect, useState } from 'react';
import { ChartModal } from '@/components/ChartModal/ChartModal';
import { RecordData } from '@/types/types';
import { ChangeRecordNameModal } from '@/components/ChangeRecordNameModal/ChangeRecordNameModal';
import { Button } from '@/components/ui/button';
import { useRecordStore } from '@/stores/recordsStore';

interface RecordsContentProps {
   pmscanId: number;
}

const RecordsContent = ({ pmscanId }: RecordsContentProps) => {
   const [currentPage, setCurrentPage] = useState(1);

   const {
      records,
      loading,
      error,
      fetchRecords,
      reset,
      meta,
      deleteRecord,
      singleRecordLoading,
      singleRecordError,
      getSingleRecord,
      exportToCsv,
   } = useRecordStore();

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
      fetchRecords(pmscanId, currentPage, 20);

      // return () => {
      //    reset();
      // };
   }, [pmscanId, currentPage, fetchRecords, reset]);

   const handleDelete = async (id: number) => {
      await deleteRecord(id);
   };

   const handleExportToCSV = async (id: number) => {
      await exportToCsv(id);
   };

   const handleViewChart = async (id: number) => {
      const fetchedData = await getSingleRecord(id);
      if (singleRecordError || fetchedData == null) {
         return;
      }

      setRecordData(fetchedData);
      setIsChartVisible(true);
   };

   const handleEditName = (name: string, id: number) => {
      setRecordNameToEdit(name);
      setRecordIdToEdit(id);
      setIsEditModalVisible(true);
   };

   const onChartClose = () => {
      setIsChartVisible(false);
   };

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };

   if (loading) return <div>Loading records...</div>;
   if (error) return <div>Erreur: {error}</div>;

   return (
      <>
         <div className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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

         {meta && (
            <div className="mt-4 flex items-center justify-center gap-2">
               <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
               </Button>
               <span>
                  Page {currentPage} of {meta.totalPages}
               </span>
               <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === meta.totalPages}>
                  Next
               </Button>
            </div>
         )}

         {isChartVisible && (
            <ChartModal recordData={recordData} isVisible={isChartVisible} onClose={onChartClose} loading={singleRecordLoading} />
         )}
         {isEditModalVisible && (
            <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80">
               <ChangeRecordNameModal
                  recordName={recordNameToEdit}
                  recordId={recordIdToEdit}
                  onClose={() => setIsEditModalVisible(false)}
               />
            </div>
         )}
      </>
   );
};

export default RecordsContent;

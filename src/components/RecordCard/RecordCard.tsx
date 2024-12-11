import { ChartLine, Pen, Sheet, Trash } from 'lucide-react';

type RecordCardProps = {
   recordName: string;
   measuresCount: number;
   type: string;
   onDelete: () => void;
   onViewChart: () => void;
};

export const RecordCard = ({ recordName, measuresCount, type, onDelete, onViewChart }: RecordCardProps) => {
   const handleChangeName = () => {
      console.log('Change name');
      //TODO: Implementer la modification du nom
   };

   const handleViewChart = () => {
      onViewChart();
   };

   const handleExportCSV = () => {
      console.log('Export to CSV');
      //TODO: Implementer l'export en CSV
   };

   const handleDelete = () => {
      onDelete();
   };

   return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-1 text-card-foreground shadow-sm">
         <div className="flex items-center justify-start gap-1">
            <h3 className="text-base font-bold">{recordName}</h3>
            <button onClick={handleChangeName} className="group relative rounded-md p-2 hover:bg-secondary">
               <Pen className="size-5 text-foreground" />
               <span className="absolute bottom-0 left-full mb-2 hidden w-max rounded-md bg-gray-900 px-2 py-1 text-sm text-white group-hover:block">
                  Edit record name
               </span>
            </button>
         </div>
         <p>Type: {type} </p>
         <div className="flex items-center justify-between">
            <p> {measuresCount} samples </p>
            <div className="flex items-center justify-evenly">
               <button onClick={handleViewChart} className="group relative rounded-md p-2 hover:bg-secondary">
                  <ChartLine className="size-6 text-foreground" />
                  <span className="absolute bottom-full mb-2 hidden w-max rounded-md bg-gray-900 px-2 py-1 text-sm text-white group-hover:block">
                     View Chart
                  </span>
               </button>
               <button onClick={handleExportCSV} className="group relative rounded-md p-2 hover:bg-secondary">
                  <Sheet className="size-6 text-foreground" />
                  <span className="absolute bottom-full mb-2 hidden w-max rounded-md bg-gray-900 px-2 py-1 text-sm text-white group-hover:block">
                     Export to CSV
                  </span>
               </button>
               <button onClick={handleDelete} className="rounded-md p-2 hover:bg-secondary">
                  <Trash className="size-6 text-destructive" />
               </button>
            </div>
         </div>
      </div>
   );
};

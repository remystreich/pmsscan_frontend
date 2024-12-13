import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { useRecordStore } from '@/stores/recordsStore';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';

export const DatePicker = () => {
   const [date, setDate] = useState<Date | undefined>(undefined);
   const { recordsDays, getRecordsDays, setSelectedDate } = useRecordStore();
   const [allowedDates, setAllowedDates] = useState<Date[]>([]);

   useEffect(() => {
      if (recordsDays.length === 0) return;
      setAllowedDates(recordsDays.map((date) => new Date(date)));
   }, [recordsDays]);

   function isSameDay(date1: Date, date2: Date) {
      return (
         date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
      );
   }

   const isDateDisabled = (date: Date) => {
      return !allowedDates.some((allowedDate) => isSameDay(date, allowedDate));
   };

   const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      if (selectedDate) setSelectedDate(selectedDate);
   };

   const handleResetDate = () => {
      setDate(undefined);
      setSelectedDate(undefined);
   }

   return (
      <div className="flex items-center">
         <Popover>
            <PopoverTrigger asChild>
               <Button variant="outline" onClick={getRecordsDays}>
                  Pick a date
                  <CalendarIcon className="ml-auto size-4" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  disabled={isDateDisabled}
               />
            </PopoverContent>
         </Popover>
         <Button className="pl-1 pr-2" variant="ghost" onClick={handleResetDate}>
            <X size={32} strokeWidth={2.75} />
         </Button>
      </div>
   );
};

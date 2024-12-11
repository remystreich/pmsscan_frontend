import ReactEcharts from 'echarts-for-react';
import { FC, useEffect, useState } from 'react';
import { RecordData } from '@/types/types';
import { set } from 'react-hook-form';
import { CircleX } from 'lucide-react';

type PMData = {
   pm1: [number, number][];
   pm25: [number, number][];
   pm10: [number, number][];
};

// type ChartModalProps = {
//    pmData: PMData;
//    isVisible: boolean;
//    name: string;
// };

type ChartModalProps = {
   recordData: RecordData;
   isVisible: boolean;
   onClose: () => void;
};

export const ChartModal: FC<ChartModalProps> = ({ recordData, isVisible, onClose }) => {
   const [pmData, setPmData] = useState<PMData>({
      pm1: [],
      pm25: [],
      pm10: [],
   });
   const [name, setName] = useState<string>('');

   useEffect(() => {
      setName(recordData.name);

      const newPm1Data: [number, number][] = [];
      const newPm25Data: [number, number][] = [];
      const newPm10Data: [number, number][] = [];

      const buffer = new Uint8Array(recordData.data.data);
      const segments = [];
      for (let i = 0; i < buffer.length; i += 20) {
         segments.push(buffer.slice(i, i + 20));
      }

      segments.forEach((rawData) => {
         const dt2000 = 946684800;
         const ts2000 =
            ((rawData[3] & 0xff) << 24) | ((rawData[2] & 0xff) << 16) | ((rawData[1] & 0xff) << 8) | (rawData[0] & 0xff);
         const measuredAt = new Date((ts2000 + dt2000) * 1000);
         const timestamp = measuredAt.getTime();

         newPm1Data.push([timestamp, (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10]);
         newPm25Data.push([timestamp, (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10]);
         newPm10Data.push([timestamp, (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10]);
      });

      newPm1Data.sort((a, b) => a[0] - b[0]);
      newPm25Data.sort((a, b) => a[0] - b[0]);
      newPm10Data.sort((a, b) => a[0] - b[0]);

      setPmData({
         pm1: newPm1Data,
         pm25: newPm25Data,
         pm10: newPm10Data,
      });
      console.log('pmData', pmData);
   }, [recordData]);

   const getOption = () => ({
      tooltip: {
         trigger: 'axis',
         position: function (pt: number[]) {
            return [pt[0], '10%'];
         },
      },
      dataZoom: [
         {
            start: 0,
            end: 100,
            type: 'inside',
         },
         {
            start: 0,
            end: 100,
            type: 'slider',
         },
      ],
      legend: {
         data: ['PM 1', 'PM 2.5', 'PM 10'],
         top: '10%',
      },
      title: {
         text: `${name} - Chart`,
         top: '3%',
      },
      grid: {
         top: '20%',
         left: '3%',
         right: '4%',
         bottom: '10%',
         containLabel: true,
      },
      xAxis: {
         type: 'time',
         axisLabel: {
            margin: 10,
         },
      },
      yAxis: {
         type: 'value',
         axisLabel: {
            margin: 10,
         },
      },
      series: [
         {
            name: 'PM 1',
            type: 'line',
            showSymbol: false,
            data: pmData.pm1,
            color: '#3b82f6',
         },
         {
            name: 'PM 2.5',
            type: 'line',
            showSymbol: false,
            data: pmData.pm25,
            color: '#22c55e',
         },
         {
            name: 'PM 10',
            type: 'line',
            showSymbol: false,
            data: pmData.pm10,
            color: '#fb923c',
         },
      ],
   });

   return (
      <div
         className={`${isVisible ? 'fixed' : 'hidden'} inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80`}
         onClick={onClose}
      >
         <div onClick={(e) => e.stopPropagation()} className="relative w-full rounded-md bg-white p-4 pt-7 lg:w-11/12">
            <button onClick={onClose} className="absolute right-3 top-2">
               <CircleX />
            </button>
            <ReactEcharts option={getOption()} style={{ height: '500px' }} opts={{ renderer: 'svg' }} />
         </div>
      </div>
   );
};

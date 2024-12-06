import { usePMScanStore } from '@/stores/usePMScanStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button } from '@/components/ui/button';

interface PMData {
   pm1: [number, number][];
   pm25: [number, number][];
   pm10: [number, number][];
}

interface DataZoomEvent {
   batch?: { start: number; end: number }[];
}

export const RealTimeView = () => {
   const { datasForChart, PMScanObj } = usePMScanStore();
   const [pmData, setPmData] = useState<PMData>({
      pm1: [[0, 0]],
      pm25: [[0, 0]],
      pm10: [[0, 0]],
   });
   const [activeButton, setActiveButton] = useState('1h');
   const [timeRange, setTimeRange] = useState(60 * 60 * 1000);
   const [resetZoom, setResetZoom] = useState(false);
   const [startTimeForChart, setStartTimeForChart] = useState(new Date().getTime() - timeRange);
   const [endTimeForChart, setEndTimeForChart] = useState(new Date().getTime());
   const chartRef = useRef<ReactEcharts | null>(null);
   const [disabledButtons, setDisabledButtons] = useState({
      '1m': false,
      '10m': false,
      '30m': false,
      '1h': false,
      '24h': false,
   });

   const getOption = () => ({
      tooltip: {
         trigger: 'axis',
         position: function (pt: number[]) {
            return [pt[0], '10%'];
         },
      },
      dataZoom: [
         {
            type: 'inside',
         },
         {
            type: 'slider',
         },
      ],
      legend: {
         data: ['PM 1', 'PM 2.5', 'PM 10'],
         top: '10%',
      },
      title: {
         text: 'Real Time Chart',
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

   const updateChart = useCallback(
      (datas: Uint8Array[]) => {
         if (!datas.length) return;

         const dt2000 = 946684800;
         const newPm1Data: [number, number][] = [];
         const newPm25Data: [number, number][] = [];
         const newPm10Data: [number, number][] = [];

         datas.forEach((rawData) => {
            const ts2000 =
               ((rawData[3] & 0xff) << 24) | ((rawData[2] & 0xff) << 16) | ((rawData[1] & 0xff) << 8) | (rawData[0] & 0xff);
            const measuredAt = new Date((ts2000 + dt2000) * 1000);
            const timestamp = measuredAt.getTime();

            newPm1Data.push([timestamp, (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10]);
            newPm25Data.push([timestamp, (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10]);
            newPm10Data.push([timestamp, (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10]);
         });

         setPmData({
            pm1: newPm1Data,
            pm25: newPm25Data,
            pm10: newPm10Data,
         });

         if (resetZoom) {
            const endTime = newPm1Data[newPm1Data.length - 1][0];
            const startTime = endTime - timeRange;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
         }
      },
      [resetZoom, timeRange],
   );

   useEffect(() => {
      updateChart(datasForChart);
   }, [datasForChart, updateChart]);

   const handleDataZoom = useCallback((event: DataZoomEvent) => {
      if (event.batch) {
         setResetZoom(false);
         setActiveButton('');
      }
   }, []);

   const onEvents = useRef({
      dataZoom: handleDataZoom,
   }).current;

   const handleTimeSelect = (time: string) => {
      setActiveButton(time);
      setResetZoom(true);
      const endTime = new Date().getTime();

      switch (time) {
         case '1m': {
            setTimeRange(60 * 1000);
            const startTime = endTime - 60 * 1000;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
            break;
         }
         case '10m': {
            setTimeRange(10 * 60 * 1000);
            const startTime = endTime - 10 * 60 * 1000;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
            break;
         }
         case '30m': {
            setTimeRange(30 * 60 * 1000);
            const startTime = endTime - 30 * 60 * 1000;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
            break;
         }
         case '1h': {
            setTimeRange(60 * 60 * 1000);
            const startTime = endTime - 60 * 60 * 1000;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
            break;
         }
         case '24h': {
            setTimeRange(24 * 60 * 60 * 1000);
            const startTime = endTime - 24 * 60 * 60 * 1000;
            setStartTimeForChart(startTime);
            setEndTimeForChart(endTime);
            break;
         }
         default:
            break;
      }
   };

   useEffect(() => {
      const echartsInstance = chartRef.current?.getEchartsInstance();
      if (echartsInstance) {
         echartsInstance.dispatchAction({
            type: 'dataZoom',
            startValue: Number(startTimeForChart) || 0,
            endValue: Number(endTimeForChart) || Date.now(),
         });
      }
   }, [startTimeForChart, endTimeForChart]);

   useEffect(() => {
      const interval = PMScanObj.interval;
      if (interval === 5 || interval === 4) {
         setDisabledButtons({
            '1m': false,
            '10m': false,
            '30m': false,
            '1h': false,
            '24h': true,
         });

         if (activeButton === '24h') {
            handleTimeSelect('1h');
         }
      }
      if (interval === 2 || interval == 1) {
         setDisabledButtons({
            '1m': true,
            '10m': false,
            '30m': false,
            '1h': false,
            '24h': false,
         });
         if (activeButton === '1m') {
            handleTimeSelect('10m');
         }
      }
      if (interval === 0) {
         setDisabledButtons({
            '1m': true,
            '10m': true,
            '30m': false,
            '1h': false,
            '24h': false,
         });
         if (activeButton === '1m' || activeButton === '10m') {
            handleTimeSelect('30m');
         }
      }
      if (interval === 3) {
         setDisabledButtons({
            '1m': false,
            '10m': false,
            '30m': false,
            '1h': false,
            '24h': false,
         });
      }
   }, [PMScanObj.interval, activeButton]);

   return (
      <section className="z-0 p-2">
         <div className="flex items-center gap-4 lg:m-4">
            <Button
               variant={activeButton === '1m' ? 'default' : 'secondary'}
               onClick={() => handleTimeSelect('1m')}
               disabled={disabledButtons['1m']}
            >
               1 m
            </Button>
            <Button
               variant={activeButton === '10m' ? 'default' : 'secondary'}
               onClick={() => handleTimeSelect('10m')}
               disabled={disabledButtons['10m']}
            >
               10 m
            </Button>
            <Button
               variant={activeButton === '30m' ? 'default' : 'secondary'}
               onClick={() => handleTimeSelect('30m')}
               disabled={disabledButtons['30m']}
            >
               30 m
            </Button>
            <Button
               variant={activeButton === '1h' ? 'default' : 'secondary'}
               onClick={() => handleTimeSelect('1h')}
               disabled={disabledButtons['1h']}
            >
               1 h
            </Button>
            <Button
               variant={activeButton === '24h' ? 'default' : 'secondary'}
               onClick={() => handleTimeSelect('24h')}
               disabled={disabledButtons['24h']}
            >
               24 h
            </Button>
         </div>
         <ReactEcharts
            ref={chartRef}
            option={getOption()}
            style={{ height: '500px' }}
            opts={{ renderer: 'svg' }}
            onEvents={onEvents}
         />
      </section>
   );
};

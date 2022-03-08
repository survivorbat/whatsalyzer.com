import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { Tick } from 'chart.js';

const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

function UserHourlyActivityGraph({ data }: InputData) {
  const chartData = {
    labels: hours,
    datasets: data.participants.map((name, index) => ({
      id: index,
      label: name,
      data: Object.keys(data.hourUserCount).map(
        (date) => data.hourUserCount[date][name]/data.userMessages[name].length * 100 || 0
      ),
      borderColor: defaultChartColors[index % defaultChartColors.length],
      backgroundColor: defaultChartColors[index % defaultChartColors.length],
      tension: 0.3,
    })),
  };

  const options = {
    scales: {
      y: {
        ticks: {
          callback: (label: string, index: number, ticks: Tick[]) => `${label}%`,
        },
      },
      x: {
        ticks: {
          callback: (label: string, index: number, ticks: Tick[]) => `${label}:00`,
        }
      }
    },
  }

  // @ts-ignore
  return <Line datasetIdKey="id" data={chartData} options={options} />;
}

export default UserHourlyActivityGraph;

import * as React from 'react';
import { InputData } from './input-interface';
import { defaultChartColors } from '../../constants/colors';
import {
  defaultGridXConfig,
  defaultGridYConfig,
  defaultLabelColor,
} from '../../constants/charts';
import { Tick } from 'chart.js';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

const UserTimelineBars = ({ data }: InputData) => {
  const users = Object.keys(data.userTimelines);

  const maxTimelineItems = users.reduce(
    (res, prev) => (res < prev.length ? prev.length : res),
    0
  );

  const chartData = {
    labels: users,
    datasets: new Array(maxTimelineItems).fill(0).map((_, i) => ({
      id: i,
      data: users.map((user) => {
        if (data.userTimelines[user][i]) {
          return [
            data.userTimelines[user][i].joinDate.unix(),
            data.userTimelines[user][i].leaveDate.unix(),
          ];
        }

        return null;
      }),
      borderColor: defaultChartColors,
      backgroundColor: defaultChartColors,
      minBarLength: 5,
    })),
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        grid: defaultGridXConfig,
        ticks: {
          callback: (label: number, index: number, ticks: Tick[]) =>
            moment.unix(label).format('MMM YYYY'),
          color: defaultLabelColor,
        },
        beginAtZero: false,
      },
      y: {
        stacked: true,
        grid: defaultGridYConfig,
        ticks: {
          color: defaultLabelColor,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const begin = context.dataset.data[0][0];
            const end = context.dataset.data[0][1];

            return (
              moment.unix(begin).format('MMM YYYY') +
              ' - ' +
              moment.unix(end).format('MMM YYYY')
            );
          },
        },
      },
    },
  };

  // @ts-ignore
  return <Bar options={options} data={chartData} />;
};

export default UserTimelineBars;

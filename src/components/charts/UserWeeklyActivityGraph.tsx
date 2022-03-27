import * as React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import defaultColors from '../../constants/colors';
import { InputData } from './input-interface';
import {
  defaultGridXConfig,
  defaultGridYConfig,
  defaultLabelColor,
  defaultPluginConfig,
} from '../../constants/charts';
import { weekdays } from '../../constants/time';

function UserWeeklyActivityGraph({ data }: InputData) {
  const userWeekData = data.users.map((name, index) => ({
    id: index + 1,
    label: name,
    data: Object.keys(data.messagesPerDayPerUser).map(
      (date) => (data.messagesPerDayPerUser[date][name]
          / data.messagesPerUser[name].length)
        * 100 || 0,
    ),
    borderColor: defaultColors[index % defaultColors.length],
    backgroundColor: defaultColors[index % defaultColors.length],
    tension: 0.2,
  }));

  const chartData = {
    labels: weekdays,
    datasets: [
      ...userWeekData,
      {
        id: 0,
        label: 'Total Average',
        data: Object.keys(data.messagesPerDayPerUser).map((date) => Object.keys(data.messagesPerDayPerUser[date]).reduce((res, user) => res + data.messagesPerDayPerUser[date][user], 0) / data.totalMessages * 100 || 0),
        borderColor: 'white',
        backgroundColor: 'white',
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        grid: defaultGridYConfig,
        ticks: {
          callback: (label: string) => `${label}%`,
          color: defaultLabelColor,
        },
      },
      x: {
        grid: defaultGridXConfig,
        ticks: {
          callback: (label: number) => moment.weekdays()[label],
          color: defaultLabelColor,
        },
      },
    },
    plugins: {
      ...defaultPluginConfig,
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${Math.round(context.dataset.data[context.dataIndex])}%`,
          title: (context: any) => moment.weekdays()[context[0].label],
        },
      },
    },
  };

  // @ts-ignore
  return <Line datasetIdKey="id" data={chartData} options={options} />;
}

export default UserWeeklyActivityGraph;

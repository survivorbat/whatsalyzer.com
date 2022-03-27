import * as React from 'react';
import { Line } from 'react-chartjs-2';
import defaultColors from '../../constants/colors';
import { InputData } from './input-interface';
import {
  defaultGridXConfig,
  defaultGridYConfig,
  defaultLabelColor,
  defaultPluginConfig,
} from '../../constants/charts';
import { hours } from '../../constants/time';

function UserHourlyActivityGraph({ data }: InputData) {
  const userHourData = data.users.map((name, index) => ({
    id: index + 1,
    label: name,
    data: Object.keys(data.messagesPerHourPerUser).map(
      (date) => (data.messagesPerHourPerUser[date][name]
          / data.messagesPerUser[name].length)
        * 100 || 0,
    ),
    borderColor: defaultColors[index % defaultColors.length],
    backgroundColor: defaultColors[index % defaultColors.length],
    tension: 0.3,
  }));

  const chartData = {
    labels: hours,
    datasets: [
      ...userHourData,
      {
        id: 0,
        label: 'Total Average',
        data: Object.keys(data.messagesPerHourPerUser).map((date) => Object.keys(data.messagesPerHourPerUser[date]).reduce((res, user) => res + data.messagesPerHourPerUser[date][user], 0) / data.totalMessages * 100 || 0),
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
          callback: (label: string) => `${label}:00`,
          color: defaultLabelColor,
        },
      },
    },
    plugins: {
      ...defaultPluginConfig,
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${Math.round(context.dataset.data[context.dataIndex])}%`,
          title: (context: any) => `${context[0].label}:00`,
        },
      },
    },
  };

  // @ts-ignore
  return <Line datasetIdKey="id" data={chartData} options={options} />;
}

export default UserHourlyActivityGraph;

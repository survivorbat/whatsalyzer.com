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

function UserMonthlyActivityGraph({ data }: InputData) {
  const userMonthData = data.users.map((name, index) => ({
    id: index + 1,
    label: name,
    data: Object.keys(data.messagesPerMonthPerUser).map(
      (date) => data.messagesPerMonthPerUser[date][name] || 0,
    ),
    borderColor: defaultColors[index % defaultColors.length],
    backgroundColor: defaultColors[index % defaultColors.length],
    tension: 0.3,
  }));

  const chartData = {
    labels: Object.keys(data.messagesPerMonthPerUser),
    datasets: [
      ...userMonthData,
      {
        id: 0,
        label: 'Total Messages',
        data: Object.keys(data.messagesPerMonthPerUser).map((date) => Object.keys(data.messagesPerMonthPerUser[date]).reduce((res, user) => res + data.messagesPerMonthPerUser[date][user], 0)),
        borderColor: 'white',
        backgroundColor: 'white',
        tension: 0.3,
        hidden: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        grid: defaultGridYConfig,
        ticks: {
          color: defaultLabelColor,
        },
      },
      x: {
        grid: defaultGridXConfig,
        ticks: {
          color: defaultLabelColor,
        },
      },
    },
    plugins: {
      ...defaultPluginConfig,
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.dataset.data[context.dataIndex]} messages`,
        },
      },
    },
  };

  // @ts-ignore
  return <Line datasetIdKey="id" data={chartData} options={options} />;
}

export default UserMonthlyActivityGraph;

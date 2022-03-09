import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';
import {
  defaultGridXConfig,
  defaultGridYConfig,
  defaultLabelColor,
  defaultPluginConfig,
} from '../../constants/charts';

function UserMessageCountPie({ data }: InputData) {
  const chartData = {
    labels: Object.keys(data.messagesPerMonthPerUser),
    datasets: data.users.map((name, index) => ({
      id: index,
      label: name,
      data: Object.keys(data.messagesPerMonthPerUser).map(
        (date) => data.messagesPerMonthPerUser[date][name] || 0
      ),
      borderColor: defaultChartColors[index % defaultChartColors.length],
      backgroundColor: defaultChartColors[index % defaultChartColors.length],
      tension: 0.3,
    })),
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
    plugins: defaultPluginConfig,
  };

  // @ts-ignore
  return <Line datasetIdKey="id" data={chartData} options={options} />;
}

export default UserMessageCountPie;

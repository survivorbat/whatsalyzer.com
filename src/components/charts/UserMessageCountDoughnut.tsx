import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { defaultGridXConfig, defaultGridYConfig, defaultLabelColor, defaultPluginConfig } from '../../constants/charts';

function UserMessageCountDoughnut({ data }: InputData) {
  const chartData = {
    labels: data.users,
    datasets: [
      {
        id: 0,
        data: data.users.map((name) => Math.round(data.messagesPerUser[name].length / data.totalMessages * 100)),
        backgroundColor: defaultColors,
        borderColor: '#000000',
      },
    ],
  };

  const options = {
    plugins:  {
      legend: defaultPluginConfig.legend,
      tooltip: {
        callbacks: {
          label: (data: any) => `${data.label}: ${data.dataset.data[data.dataIndex]}%`
        },
      },
    },
  };

  // @ts-ignore
  return <Doughnut datasetIdKey="id" data={chartData} options={options} />;
}

export default UserMessageCountDoughnut;

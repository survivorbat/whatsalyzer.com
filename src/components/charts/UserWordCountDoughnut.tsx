import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { defaultPluginConfig } from '../../constants/charts';

function UserWordCountDoughnut({ data }: InputData) {
  const chartData = {
    labels: data.users,
    datasets: [
      {
        id: 0,
        data: data.users.map((name) => Math.round(data.wordsPerUser[name].length / data.totalWords * 100)),
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

  return <Doughnut datasetIdKey="id" data={chartData} options={options} />;
}

export default UserWordCountDoughnut;

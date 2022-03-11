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
        data: data.users.map((name) => data.wordsPerUser[name].length),
        backgroundColor: defaultColors,
        borderColor: '#000000',
      },
    ],
  };

  const options = {
    plugins: defaultPluginConfig,
  };

  return <Doughnut datasetIdKey="id" data={chartData} options={options} />;
}

export default UserWordCountDoughnut;

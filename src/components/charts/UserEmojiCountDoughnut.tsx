import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { defaultPluginConfig } from '../../constants/charts';

function UserEmojiCountDoughnut({ data }: InputData) {
  const chartData = {
    labels: data.users,
    datasets: [
      {
        id: 0,
        data: data.users.map((name) => data.emojisPerUser[name].length),
        backgroundColor: defaultChartColors,
        borderColor: '#000000',
      },
    ],
  };

  const options = {
    plugins: defaultPluginConfig,
  };

  return <Doughnut datasetIdKey="id" data={chartData} options={options} />;
}

export default UserEmojiCountDoughnut;

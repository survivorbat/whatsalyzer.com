import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { defaultLabelColor, defaultPluginConfig } from '../../constants/charts';

function UserMessageCountDoughnut({ data }: InputData) {
  const chartData = {
    labels: data.users,
    datasets: [
      {
        id: 0,
        data: data.users.map((name) => data.messagesPerUser[name].length),
        backgroundColor: defaultChartColors,
        borderColor: '#000000',
      },
    ],
  };

  const options = {
    plugins: defaultPluginConfig,
  };

  // @ts-ignore
  return <Doughnut datasetIdKey="id" data={chartData} options={options} />;
}

export default UserMessageCountDoughnut;

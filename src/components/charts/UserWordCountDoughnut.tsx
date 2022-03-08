import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';

function UserWordCountDoughnut({ data }: InputData) {
  const sortedKeys = Object.keys(data.userWords).sort(
    (a, b) => data.userWords[b].length - data.userWords[a].length
  );

  const chartData = {
    labels: sortedKeys,
    datasets: [
      {
        id: 0,
        data: sortedKeys.map((name) => data.userWords[name].length),
        backgroundColor: defaultChartColors,
        borderColor: "#000000",
      },
    ],
  };

  return <Doughnut datasetIdKey="id" data={chartData} />;
}

export default UserWordCountDoughnut;

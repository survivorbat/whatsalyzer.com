import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';

function UserMessageCountDoughnut({ data }: InputData) {
  const sortedKeys = Object.keys(data.userMessages).sort(
    (a, b) => data.userMessages[b].length - data.userMessages[a].length
  );

  const chartData = {
    labels: sortedKeys,
    datasets: [
      {
        id: 0,
        data: sortedKeys.map((name) => data.userMessages[name].length),
        backgroundColor: defaultChartColors,
        borderColor: "#000000",
      },
    ],
  };

  const options = {
    legend: {
      labels: {
        fontColor: "light",
      }
    }
  }

  // @ts-ignore
  return <Doughnut datasetIdKey="id" data={chartData} options={options}/>;
}

export default UserMessageCountDoughnut;

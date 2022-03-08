import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartColors } from '../../constants/colors';
import { InputData } from './input-interface';

function UserMessageCountPie({ data }: InputData) {
  const chartData = {
    labels: Object.keys(data.monthUserCount),
    datasets: data.participants.map((name, index) => ({
      id: index,
      label: name,
      data: Object.keys(data.monthUserCount).map(
        (date) => data.monthUserCount[date][name] || 0
      ),
      borderColor: defaultChartColors[index % defaultChartColors.length],
      backgroundColor: defaultChartColors[index % defaultChartColors.length],
      tension: 0.3,
    })),
  };

  return <Line datasetIdKey="id" data={chartData} />;
}

export default UserMessageCountPie;

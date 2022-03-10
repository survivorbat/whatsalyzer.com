import * as React from 'react';
import { InputData } from './input-interface';
import { defaultChartColors } from '../../constants/colors';
import moment from 'moment';
import {Bar} from 'react-chartjs-2';
import { defaultGridXConfig, defaultGridYConfig, defaultLabelColor } from '../../constants/charts';
import { Tick } from 'chart.js';

const SubjectTimelineBars = ({data}: InputData) => {
  const chartData = {
    labels: data.conversationNames.map((convo) => convo.name),
    datasets: [{
      id: 0,
      data: data.conversationNames.map((convo) => [convo.startDate.unix(), convo.endDate.unix()]),
      borderColor: defaultChartColors,
      backgroundColor: defaultChartColors,
      minBarLength: 5,
    }],
  }

  const options = {
    indexAxis: 'y',
    aspectRatio: 1.5,
    scales: {
      x: {
        grid: defaultGridXConfig,
        ticks: {
          callback: (label: number, index: number, ticks: Tick[]) => moment.unix(label).format('MMM YYYY'),
          color: defaultLabelColor,
          autoSkip: false,
        },
        beginAtZero: false,
      },
      y: {
        grid: defaultGridYConfig,
        ticks: {
          color: defaultLabelColor,
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const begin = context.dataset.data[0][0];
            const end = context.dataset.data[0][1];

            return moment.unix(begin).format('MMM YYYY') + ' - ' + moment.unix(end).format('MMM YYYY')
          }
        }
      }
    }
  };

  // @ts-ignore
  return <Bar options={options} data={chartData}/>
}

export default SubjectTimelineBars;
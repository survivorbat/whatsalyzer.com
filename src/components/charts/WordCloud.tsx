import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { defaultColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

ChartJS.register(WordCloudController, WordElement);

const minFontSize = 16;
const fontSizeDivider = 5;

function WordCloud({ data }: InputData) {
  const relevantWords = Object.keys(data.wordUsage)
    .filter((word) => word.length > 6)
    .filter((word) => data.wordUsage[word] > 29);

  const chartData = {
    labels: relevantWords,
    datasets: [
      {
        id: 0,
        data: relevantWords.map((name) => data.wordUsage[name] / fontSizeDivider + minFontSize),
        color: defaultColors,
        borderColor: defaultColors,
        backgroundColor: defaultColors,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipData: any) => `Found ${data.wordUsage[tooltipData.label]}`,
        },
        titleFont: {
          size: 20,
        },
        color: defaultColors,
        displayColors: false,
      },
    },
  };

  // @ts-ignore
  return <div style={{height: '80vh'}}><Chart type="wordCloud" datasetIdKey="id" data={chartData} options={options}/></div>;
}

export default WordCloud;

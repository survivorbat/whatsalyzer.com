import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { defaultColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

ChartJS.register(WordCloudController, WordElement);

const minFontSize = 22;
const fontSizeDivider = 4.6;

function EmojiCloud({ data }: InputData) {
  const relevantEmojis = Object.keys(data.emojiUsage);

  const chartData = {
    labels: relevantEmojis,
    datasets: [
      {
        id: 0,
        data: relevantEmojis.map((name) => data.emojiUsage[name] / fontSizeDivider + minFontSize),
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
          label: (tooltipData: any) => `Found ${data.emojiUsage[tooltipData.label]}`,
        },
        color: defaultColors,
        titleFont: {
          size: 100,
        },
        padding: 12,
        displayColors: false,
      },
    },
  };

  // @ts-ignore
  return <div style={{height: '100vh'}}><Chart type="wordCloud" datasetIdKey="id" data={chartData} options={options}/></div>;
}

export default EmojiCloud;

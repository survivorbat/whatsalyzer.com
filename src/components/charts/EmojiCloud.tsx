import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { defaultColors } from '../../constants/colors';
import { InputData } from './input-interface';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

import './Cloud.css';

ChartJS.register(WordCloudController, WordElement);

const minFontSize = 20;
const maxFontSize = 300;

const minFrequency = 2;

function EmojiCloud({ data }: InputData) {
  const relevantEmojis = Object.keys(data.emojiUsage).filter(
    (emoji) => data.emojiUsage[emoji] >= minFrequency
  );

  // Determine the highest frequency
  const maxFrequency = relevantEmojis.reduce((maxFrequency, word) => {
    const frequency = data.emojiUsage[word];

    return frequency > maxFrequency ? frequency : maxFrequency;
  }, minFrequency + 1);

  // Determine the difference between the lowest and the highest frequency
  const spread = maxFrequency - minFrequency;

  const chartData = {
    labels: relevantEmojis,
    datasets: [
      {
        id: 0,
        // For each emoji usage, divide by the spread and multiply by the font size spread, add additional minimum font size.
        data: relevantEmojis.map(
          (name) =>
            (data.emojiUsage[name] / spread) * (maxFontSize - minFontSize) +
            minFontSize
        ),
        color: defaultColors,
        borderColor: defaultColors,
        backgroundColor: defaultColors,
        fit: true,
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
          label: (tooltipData: any) =>
            `Found ${data.emojiUsage[tooltipData.label]}`,
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
  return (
    <div className="cloud-container">
      <div className="cloud-wrapper">
        <Chart
          type="wordCloud"
          datasetIdKey="id"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
}

export default EmojiCloud;

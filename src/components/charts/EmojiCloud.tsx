import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { CloudChartProps } from './input-interface';

import './Cloud.css';
import { getMaxWordFrequency } from '../../logic/chart-helpers';

ChartJS.register(WordCloudController, WordElement);

function EmojiCloud({
  data,
  minFrequency,
  minFontSize,
  maxFontSize,
}: CloudChartProps) {
  const relevantEmojis = Object.keys(data.emojiUsage).filter(
    (emoji) => data.emojiUsage[emoji] >= minFrequency,
  );

  if (relevantEmojis.length === 0) {
    return (
      <span className="text-muted">Not enough data for emoji cloud :(</span>
    );
  }

  const maxFrequency = getMaxWordFrequency(
    minFrequency,
    relevantEmojis,
    data.emojiUsage,
  );

  const frequencySpread = maxFrequency - minFrequency;
  const fontSizeSpread = maxFontSize - minFontSize;

  const chartData = {
    labels: relevantEmojis,
    datasets: [
      {
        id: 0,
        data: relevantEmojis.map(
          (name) => (fontSizeSpread / frequencySpread) * (data.emojiUsage[name] - 1) + minFontSize,
        ),
      },
    ],
  };

  const options = {
    animation: {
      duration: 0,
    },
    responsiveAnimationDuration: 0,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipData: any) => `Found ${data.emojiUsage[tooltipData.label]}`,
        },
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

import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import defaultColors from '../../constants/colors';
import { CloudChartProps } from './input-interface';

import './Cloud.css';
import { getMaxWordFrequency } from '../../logic/chart-helpers';

ChartJS.register(WordCloudController, WordElement);

function WordCloud({
  data,
  minFrequency,
  minLength,
  minFontSize,
  maxFontSize,
}: CloudChartProps) {
  const relevantWords = Object.keys(data.wordUsage)
    .filter((word) => word.length > minLength!)
    .filter((word) => data.wordUsage[word] > minFrequency);

  if (relevantWords.length === 0) {
    return (
      <span className="text-muted">Not enough data for word cloud :(</span>
    );
  }

  const maxFrequency = getMaxWordFrequency(
    minFrequency,
    relevantWords,
    data.wordUsage,
  );

  const frequencySpread = maxFrequency - minFrequency;
  const fontSizeSpread = maxFontSize - minFontSize;

  const chartData = {
    labels: relevantWords,
    datasets: [
      {
        id: 0,
        data: relevantWords.map(
          (name) => (fontSizeSpread / frequencySpread) * (data.wordUsage[name] - 1) + minFontSize,
        ),
        fit: true,
        color: defaultColors,
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
          label: (tooltipData: any) => `Found ${data.wordUsage[tooltipData.label]}`,
        },
        titleFont: {
          size: 20,
        },
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

export default WordCloud;

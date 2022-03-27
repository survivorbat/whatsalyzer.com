import * as React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import defaultColors from '../../constants/colors';
import { InputCloudData } from './input-interface';

import './Cloud.css';
import { getMaxWordFrequency } from '../../logic/chart-helpers';

ChartJS.register(WordCloudController, WordElement);

function WordCloud({
  data,
  minFrequency,
  minLength,
  minFontSize,
  maxFontSize,
}: InputCloudData) {
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
  const spread = maxFrequency - minFrequency;

  const chartData = {
    labels: relevantWords,
    datasets: [
      {
        id: 0,
        // For each word usage, divide by the spread and multiply by the font size spread, add additional minimum font size.
        data: relevantWords.map(
          (name) => (data.wordUsage[name] / spread) * (maxFontSize - minFontSize)
            + minFontSize,
        ),
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

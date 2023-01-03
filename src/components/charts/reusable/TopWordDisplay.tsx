import * as React from 'react';
import AmountTag from './AmountTag';
import { TopWord } from '../../../logic/chart-helpers';

interface TopWordDisplayProps {
  topWord: TopWord;
}

function TopWordDisplay({ topWord }: TopWordDisplayProps) {
  return (
    <span className="rounded-pill participant-pill" key={topWord.name}>
      {topWord.name} <AmountTag amount={topWord.amount} />
    </span>
  );
}

export default TopWordDisplay;

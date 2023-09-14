import * as React from 'react';

interface MinimalFrequencyTagProps {
  frequency: number;
}

function MinimalFrequencyTag({ frequency }: MinimalFrequencyTagProps) {
  return (
    <p>
      <small className="text-light">
        Minimum frequency:
        {frequency}
      </small>
    </p>
  );
}

export default MinimalFrequencyTag;

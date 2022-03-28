import * as React from 'react';

interface MinimalFrequencyTagProps {
  frequency: number;
}

function MinimalFrequencyTag({ frequency }: MinimalFrequencyTagProps) {
  return (
    <p>
      <small className="text-muted">
        Minimal frequency:
        {frequency}
      </small>
    </p>
  );
}

export default MinimalFrequencyTag;

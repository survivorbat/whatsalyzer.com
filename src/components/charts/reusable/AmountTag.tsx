import * as React from 'react';

interface AmountTagProps {
  amount: number;
}

function AmountTag({ amount }: AmountTagProps) {
  return <small className="text-muted">({amount})</small>;
}

export default AmountTag;

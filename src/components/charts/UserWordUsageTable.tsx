import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';

const getTopWords = (
  inputData: Record<string, number>,
  amount: number
): { name: string; amount: number }[] => {
  const sorted = Object.keys(inputData)
    .filter((w) => w.length > 4)
    .sort((a, b) => inputData[b] - inputData[a]);

  return new Array(amount)
    .fill(0)
    .map((_, i) => ({ name: sorted[i], amount: inputData[sorted[i]] }));
};

function UserWordUsageTable({ data }: InputData) {
  const sortedKeys = Object.keys(data.userWordUsage).sort(
    (a, b) => data.userWords[b].length - data.userWords[a].length
  );

  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th>User</th>
          <th>Words</th>
        </tr>
      </thead>
      <tbody>
        {sortedKeys.map((name) => (
          <tr key={name}>
            <td className="user-name-table">{name}</td>
            <td>
              {getTopWords(data.userWordUsage[name], 5).map((word) => (
                <span className="rounded-pill participant-pill" key="word">
                  {word.name} <small>({word.amount})</small>
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td>Total</td>
          <td>{data.totalWords}</td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default UserWordUsageTable;

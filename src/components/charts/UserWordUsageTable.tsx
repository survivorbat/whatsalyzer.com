import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';
import { defaultColors } from '../../constants/colors';

const getTopWords = (
  inputData: Record<string, number>,
  amount: number
): { name: string; amount: number }[] => {
  const sorted = Object.keys(inputData)
    .filter((w) => w.length > 4)
    .sort((a, b) => inputData[b] - inputData[a]);

  return new Array(amount)
    .fill(0)
    .map((_, i) => ({ name: sorted[i], amount: inputData[sorted[i]] }))
    .filter((i) => i.name);
};

function UserWordUsageTable({ data }: InputData) {
  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Words</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name, index) => (
          <tr key={name}>
            <th
              scope="row"
              style={{ color: defaultColors[index % defaultColors.length] }}
              className="user-name-table"
            >
              {name}
            </th>
            <td>
              {getTopWords(data.wordUsagePerUser[name], 5).map((word) => (
                <span className="rounded-pill participant-pill" key={word.name}>
                  {word.name} <small>({word.amount})</small>
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserWordUsageTable;

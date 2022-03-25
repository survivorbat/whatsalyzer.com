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

const amount = 5;

const UserWordUsageTable = ({ data }: InputData)  => {
  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" title="The user">
            User
          </th>
          <th scope="col" title={`Top-${amount} words this user uses`}>
            Words
          </th>
          <th scope="col" title="Total amount of words this user has messaged">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name, index) => (
          <tr key={name}>
            <th
              scope="row"
              style={{ color: defaultColors[index % defaultColors.length] }}
            >
              {name}
            </th>
            <td>
              {getTopWords(data.wordUsagePerUser[name], amount).map((word) => (
                <span className="rounded-pill participant-pill" key={word.name}>
                  {word.name}{' '}
                  <small className="text-muted">({word.amount})</small>
                </span>
              ))}
            </td>
            <td>{data.wordsPerUser[name].length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserWordUsageTable;

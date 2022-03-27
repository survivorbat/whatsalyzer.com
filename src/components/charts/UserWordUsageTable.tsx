import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData, InputUsageTableData } from './input-interface';
import defaultColors from '../../constants/colors';
import { getTopWords } from '../../logic/chart-helpers';

function UserWordUsageTable({ data, minLength, displayAmount }: InputUsageTableData) {
  const topWords = data.users.map((name) => getTopWords(data.wordUsagePerUser[name], minLength, displayAmount));

  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" title="The user">
            User
          </th>
          <th scope="col" title={`Top-${displayAmount} words this user uses`}>
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
              {topWords[index].map((word) => (
                <span className="rounded-pill participant-pill" key={word.name}>
                  {word.name}
                  {' '}
                  <small className="text-muted">
                    (
                    {word.amount}
                    )
                  </small>
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

import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';
import { defaultColors } from '../../constants/colors';

function UserWordCountTable({ data }: InputData) {
  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" title="The user">User</th>
          <th scope="col" title="The amount of words a specific user has contributed to this conversation">#</th>
          <th scope="col" title="The percentage of words a specific user has contributed to this conversation">%</th>
          <th scope="col" title="The average amount of words per message">Average Per Message</th>
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
            <td>{data.wordsPerUser[name].length}</td>
            <td>
              {Math.round(
                (data.wordsPerUser[name].length / data.totalWords) * 100
              )}
              %
            </td>
            <td>
              {parseFloat(
                `${
                  data.wordsPerUser[name].length /
                  data.messagesPerUser[name].length
                }`
              ).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td>Total</td>
          <td>{data.totalWords}</td>
          <td>100%</td>
          <td>
            {parseFloat(`${data.totalWords / data.totalMessages}`).toFixed(1)}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default UserWordCountTable;

import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';

function UserWordCountTable({ data }: InputData) {
  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th>User</th>
          <th>#</th>
          <th>%</th>
          <th>Avg</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name) => (
          <tr key={name}>
            <td className="user-name-table">{name}</td>
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

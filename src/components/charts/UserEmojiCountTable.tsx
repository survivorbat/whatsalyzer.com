import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';
import { defaultColors } from '../../constants/colors';

function UserEmojiCountTable({ data }: InputData) {
  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">#</th>
          <th scope="col">%</th>
          <th scope="col">Average Per Message</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name, index) => (
          <tr key={name}>
            <th
              scope="row"
              className="user-name-table"
              style={{ color: defaultColors[index % defaultColors.length] }}
            >
              {name}
            </th>
            <td>{data.emojisPerUser[name].length}</td>
            <td>
              {Math.round(
                (data.emojisPerUser[name].length / data.totalEmojis) * 100
              )}
              %
            </td>
            <td>
              {parseFloat(
                `${
                  data.emojisPerUser[name].length /
                  data.messagesPerUser[name].length
                }`
              ).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td>Total</td>
          <td>{data.totalEmojis}</td>
          <td>100%</td>
          <td>
            {parseFloat(`${data.totalEmojis / data.totalMessages}`).toFixed(1)}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default UserEmojiCountTable;

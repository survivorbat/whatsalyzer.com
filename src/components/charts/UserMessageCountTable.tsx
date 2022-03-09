import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData } from './input-interface';
import moment from 'moment';

function UserMessageCountTable({ data }: InputData) {
  if (!data.firstMessage || !data.lastMessage) {
    return <></>;
  }

  const firstDate = moment(data.firstMessage.date);
  const lastDate = moment(data.lastMessage.date);

  const duration = moment.duration(lastDate.diff(firstDate));
  const totalDays = duration.asDays();
  const totalMonths = duration.asMonths();
  const totalYears = duration.asYears();

  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">#</th>
          <th scope="col">%</th>
          <th scope="col">Daily</th>
          <th scope="col">Monthly</th>
          <th scope="col">Yearly</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name) => (
          <tr key={name}>
            <th scope="row" className="user-name-table">
              {name}
            </th>
            <td>{data.messagesPerUser[name].length}</td>
            <td>
              {Math.round(
                (data.messagesPerUser[name].length / data.totalMessages) * 100
              )}
              %
            </td>
            <td>
              {parseFloat(
                `${data.messagesPerUser[name].length / totalDays}`
              ).toFixed(1)}
            </td>
            <td>
              {parseFloat(
                `${data.messagesPerUser[name].length / totalMonths}`
              ).toFixed(1)}
            </td>
            <td>
              {parseFloat(
                `${data.messagesPerUser[name].length / totalYears}`
              ).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <th scope="row">Total</th>
          <td>{data.totalMessages}</td>
          <td>100%</td>
          <td>{parseFloat(`${data.totalMessages / totalDays}`).toFixed(1)}</td>
          <td>
            {parseFloat(`${data.totalMessages / totalMonths}`).toFixed(1)}
          </td>
          <td>{parseFloat(`${data.totalMessages / totalYears}`).toFixed(1)}</td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default UserMessageCountTable;

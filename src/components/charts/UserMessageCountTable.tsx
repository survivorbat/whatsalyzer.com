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

  const sortedKeys = Object.keys(data.userMessages).sort(
    (a, b) => data.userMessages[b].length - data.userMessages[a].length
  );

  return (
    <Table borderless className="text-light">
      <thead>
        <tr>
          <th>User</th>
          <th>#</th>
          <th>%</th>
          <th>Daily</th>
          <th>Monthly</th>
          <th>Yearly</th>
        </tr>
      </thead>
      <tbody>
        {sortedKeys.map((name) => (
          <tr key={name}>
            <td className="user-name-table">{name}</td>
            <td>{data.userMessages[name].length}</td>
            <td>
              {Math.round(
                (data.userMessages[name].length / data.totalMessages) * 100
              )}
              %
            </td>
            <td>
              {parseFloat(
                `${data.userMessages[name].length / totalDays}`
              ).toFixed(1)}
            </td>
            <td>
              {parseFloat(
                `${data.userMessages[name].length / totalMonths}`
              ).toFixed(1)}
            </td>
            <td>
              {parseFloat(
                `${data.userMessages[name].length / totalYears}`
              ).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td>Total</td>
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

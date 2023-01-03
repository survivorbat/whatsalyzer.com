import * as React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { DefaultProps } from './input-interface';
import UserTableHead from './reusable/UserTableHead';

function UserMessageCountTable({ data }: DefaultProps) {
  const duration = moment.duration(
    data.lastMessage.date.diff(data.firstMessage.date)
  );

  const totalDays = duration.asDays();
  const totalMonths = duration.asMonths();
  const totalYears = duration.asYears();

  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" title="The user">
            User
          </th>
          <th
            scope="col"
            title="The amount of messages a specific user has contributed to this conversation"
          >
            #
          </th>
          <th
            scope="col"
            title="The percentage of messages a specific user has contributed to the conversation"
          >
            %
          </th>
          <th
            scope="col"
            title="The daily amount of messages a user has contributed to the conversation"
          >
            Daily
          </th>
          <th
            scope="col"
            title="The weekly amount of messages a user has contributed to the conversation"
          >
            Monthly
          </th>
          <th
            scope="col"
            title="The yearly amount of messages a user has contributed to the conversation"
          >
            Yearly
          </th>
          <th
            scope="col"
            title="⇪↩ヾ   ⤷э⇅   ↪↩∧   э⇅⤷⇆⇪   ∧↩   ⊏↩⤣↻э⇅⇇⇅↪⇆   ∧⇇⇅   ↹⇅⤣⇊⇅"
          >
            FEMKE
          </th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name, index) => (
          <tr key={name}>
            <UserTableHead name={name} index={index} />
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
            <td>
              {Math.round(
                (data.femkePerUser[name] / data.charactersPerUser[name]) * 100
              )}
              %
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
          <td>{Math.round((data.totalFemke / data.totalCharacters) * 100)}%</td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default UserMessageCountTable;

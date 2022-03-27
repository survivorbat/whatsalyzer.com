import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputUsageTableData } from './input-interface';
import { getTopWords } from '../../logic/chart-helpers';
import UserTableHead from './reusable/UserTableHead';
import TopWordDisplay from './reusable/TopWordDisplay';

function UserWordUsageTable({
  data,
  minLength,
  displayAmount,
}: InputUsageTableData) {
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
            <UserTableHead name={name} index={index} />
            <td>
              {topWords[index].map((word) => (
                <TopWordDisplay key={word.name} topWord={word} />
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

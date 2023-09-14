import * as React from 'react';
import { Table } from 'react-bootstrap';
import { UsageTableProps } from './input-interface';
import { getTopWords } from '../../logic/chart-helpers';
import UserTableHead from './reusable/UserTableHead';
import TopWordDisplay from './reusable/TopWordDisplay';

function UserEmojiUsageTable({
  data,
  minLength,
  displayAmount,
}: UsageTableProps) {
  const topWords = data.users.map((name) =>
    getTopWords(data.emojiUsagePerUser[name], minLength, displayAmount)
  );

  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" className="text-light" title="The user">
            User
          </th>
          <th scope="col" className="text-light" title={`Top-${displayAmount} emojis this user uses`}>
            Emojis
          </th>
          <th scope="col" className="text-light" title="Total amount of emojis this user has messaged">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((name, index) => (
          <tr key={name}>
            <UserTableHead name={name} index={index} />
            <td>
              {topWords[index].map((emoji) => (
                <TopWordDisplay key={emoji.name} topWord={emoji} />
              ))}
            </td>
            <td className="text-light">{data.emojisPerUser[name].length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserEmojiUsageTable;

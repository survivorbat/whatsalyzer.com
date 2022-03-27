import * as React from 'react';
import { Table } from 'react-bootstrap';
import { InputData, InputUsageTableData } from './input-interface';
import defaultColors from '../../constants/colors';
import { getTopWords } from '../../logic/chart-helpers';

function UserEmojiUsageTable({ data, minLength, displayAmount }: InputUsageTableData) {
  const topWords = data.users.map((name) => getTopWords(data.emojiUsagePerUser[name], minLength, displayAmount));

  return (
    <Table borderless responsive className="text-light">
      <thead>
        <tr>
          <th scope="col" title="The user">
            User
          </th>
          <th scope="col" title={`Top-${displayAmount} emojis this user uses`}>
            Emojis
          </th>
          <th scope="col" title="Total amount of emojis this user has messaged">
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
              {topWords[index].map((emoji) => (
                <span
                  className="rounded-pill participant-pill"
                  key={emoji.name}
                >
                  {emoji.name}
                  {' '}
                  <small className="text-muted">
                    (
                    {emoji.amount}
                    )
                  </small>
                </span>
              ))}
            </td>
            <td>{data.emojisPerUser[name].length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserEmojiUsageTable;

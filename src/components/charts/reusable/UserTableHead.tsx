import * as React from 'react';
import { colorIndex } from '../../../logic/chart-helpers';

interface UserTableHeadProps {
  name: string;
  index: number;
}

function UserTableHead({ index, name }: UserTableHeadProps) {
  return (
    <th scope="row" style={{ color: colorIndex(index) }}>
      {name}
    </th>
  );
}

export default UserTableHead;

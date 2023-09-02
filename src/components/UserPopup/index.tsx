import {Select} from 'antd';
import {useProjectStore} from '../../store/project.store';
import type {User} from '@prisma/client';

import React from 'react';

const UserSelect = () => {
  const getUserOptions = (users: User[]) => {
    const options = users.map((member) => {
      return {
        value: member.id,
        label: member.name,
      };
    });
    return options;
  };
  const projectMembers = useProjectStore((state) => state.project?.members);
  const userOptions = getUserOptions(projectMembers ?? []);
  return (
    <Select
      bordered={false}
      defaultActiveFirstOption={true}
      defaultValue={userOptions[0]}
      showSearch
      placeholder="Unassignee"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={[
        {
          value: undefined,
          label: 'Unassigned',
        },
        ...userOptions,
      ]}
    />
  );
};

export default UserSelect;

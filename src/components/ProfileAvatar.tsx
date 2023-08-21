import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import {Dropdown, Avatar} from 'antd';

import {UserOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import type {User} from 'next-auth';
import type {MenuProps} from 'antd';

interface Props {
  user: User;
}

export const ProfileAvatar = (props: Props) => {
  const sprintMenuOptions: MenuProps['items'] = [
    {
      label: (
        <div className="flex gap-1-2">
          <UserOutlined />
          <p>Profile</p>
        </div>
      ),
      key: 'profile',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className="flex gap-1-2">
          <SettingOutlined />
          <p>Settings</p>
        </div>
      ),
      key: 'settings',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className="flex gap-1-2">
          <LogoutOutlined />
          <p>Logout</p>
        </div>
      ),
      key: 'logout',
    },
  ];

  const router = useRouter();

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      signOut();
      router.push('/');
    }
  };

  return (
    <Dropdown
      menu={{
        items: sprintMenuOptions,
        onClick: handleMenuClick,
      }}
      trigger={['click']}
    >
      <Avatar src={props.user.image} alt='dp' style={{cursor:"pointer"}}>
        {props.user.image ? null : props.user.name![0]}
      </Avatar>
    </Dropdown>
  );
};

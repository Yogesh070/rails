import React from 'react';
import Board from './Board';

import type {ReactNode} from 'react';
import {Button, Divider, Typography} from 'antd';
import {useRouter} from 'next/router';

import {InfoCircleOutlined, TagsOutlined} from '@ant-design/icons';

const {Title} = Typography;

const SettingsLayout = ({children}: {children: ReactNode}) => {
  const settingsOptions = [
    {
      icon: <InfoCircleOutlined />,
      label: 'Overview',
      route: 'settings',
      href: '',
    },
    {
      icon: <TagsOutlined />,
      label: 'Labels',
      route: 'labels',
      href: 'labels',
    },
  ];
  const router = useRouter();
  return (
    <>
      <Board>
        <Title level={4} className='mb-0'>Settings</Title>
        <div className="flex gap-1-2">
          {settingsOptions.map((option, index) => {
            const key = String(index + 1);
            return (
              <Button
                key={key}
                type={
                  router.pathname.split('/')[
                    router.pathname.split('/').length - 1
                  ] == option.route
                    ? 'default'
                    : 'text'
                }
                icon={option.icon}
                onClick={() =>
                  router.push({
                    pathname: `/w/${router.query.workspaceId}/projects/${router.query.projectId}/settings/${option.href}`,
                  })
                }
              >
                {option.label}
              </Button>
            );
          })}
        </div>
        <Divider dashed className="my-1" />
        {children}
      </Board>
    </>
  );
};

export default SettingsLayout;

import type {ReactNode} from 'react';
import {
  DashboardOutlined,
  IssuesCloseOutlined,
  UsergroupAddOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Layout, Menu, theme} from 'antd';
import {useRouter} from 'next/router';
import React from 'react';
import Image from 'next/image';
import CustomDivider from '../components/CustomDivider/CustomDivider';

type SidebarOption = {
  icon: React.ElementType;
  label: string;
  route: string;
};

const WorkSpaceLayout = ({children}: {children: ReactNode}) => {
  const {Header, Sider} = Layout;
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const sidebarOptions: SidebarOption[] = [
    {
      icon: DashboardOutlined,
      label: 'home',
      route: 'projects',
    },
    {
      icon: DatabaseOutlined,
      label: 'Analytics',
      route: 'analytics',
    },
    {
      icon: IssuesCloseOutlined,
      label: 'My Issues',
      route: 'issues',
    },
    {
      icon: UsergroupAddOutlined,
      label: 'Members',
      route: 'members',
    },
    {
      icon: SettingOutlined,
      label: 'Settings',
      route: 'settings',
    },
  ];

  const sidebarMenu: MenuProps['items'] = sidebarOptions.map(
    (option, index) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: React.createElement(option.icon),
        label: option.label,
        onClick: async () => {
          await router.push(`/w/${router.query.workspaceId}/${option.route}`);
        },
      };
    }
  );

  const {
    token: {colorBgContainer},
  } = theme.useToken();

  return (
    <Layout>
      <Header
        className="flex justify-between items-center px-4"
        style={{backgroundColor: colorBgContainer}}
      >
        <Image src="/logo.svg" width={32} height={32} alt={'logo'} />
        {/* //TODO: ADD USER AVATAR TO NAVIGATE TO PROFILE AND SIGN OUT*/}
      </Header>
      <CustomDivider />
      <Layout hasSider style={{backgroundColor: colorBgContainer}}>
        <Sider
          color={colorBgContainer}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          defaultCollapsed={true}
          className="h-100 mt-4"
          theme="light"
          style={{backgroundColor: colorBgContainer}}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1']}
            defaultOpenKeys={['sub1']}
            items={sidebarMenu}
            className="p-2"
          />
        </Sider>
        <Layout
          className="p-4 gap-1-2 overflow-x-scroll"
          style={{
            height: 'calc(100vh - 64px)',
            backgroundColor: colorBgContainer,
          }}
        >
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default WorkSpaceLayout;

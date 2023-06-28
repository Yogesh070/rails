import type { ReactNode } from 'react';
import { LaptopOutlined, SettingOutlined, TableOutlined, LineChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import React from 'react';
import Image from 'next/image';

type SidebarOption = {
  icon: React.ElementType,
  label: string,
  route: string
}

const Board = ({ children }: { children: ReactNode }) => {
  const { Header, Sider } = Layout;
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(true);

  const sidebarOptions: SidebarOption[] = [
    {
      icon: TableOutlined,
      label: "Home",
      route: ''
    },
    {
      icon: LaptopOutlined,
      label: "Backlog",
      route: 'backlog'
    },
    {
      icon: LineChartOutlined,
      label: "Analytics",
      route: 'analytics'
    },
    {
      icon: SettingOutlined,
      label: "Settings",
      route: 'settings'
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
          await router.push(`/w/${router.query.workspaceId}/projects/${router.query.projectId}/${option.route}`);
        },
      };
    },
  );

  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout >
      <Header className="flex justify-between items-center px-6 py-0 border-bottom" style={{ backgroundColor: colorBgContainer }}>
        <Image src="/logo.svg" width={32} height={32} alt={'logo'} />
        <Button type="dashed" onClick={() => { void signOut() }}>Logout</Button>
      </Header>
      <Layout hasSider style={{ backgroundColor: colorBgContainer }}>
        <Sider color={colorBgContainer} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} defaultCollapsed={true} className='h-100 mt-4' theme='light' style={{ backgroundColor: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1']}
            defaultOpenKeys={['sub1']}
            items={sidebarMenu}
            className='p-2'
          />
        </Sider>
        <Layout className='px-4 gap-1-2 overflow-x-scroll mt-2' style={{ height: "calc(100vh - 76px)", backgroundColor: colorBgContainer }}>
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Board;
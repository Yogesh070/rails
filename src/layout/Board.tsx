import type { ReactNode } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button } from 'antd';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import React from 'react';
import { Content } from 'antd/es/layout/layout';

const { Header, Sider } = Layout;

type SidebarOption = {
  icon: React.ElementType,
  label: string,
  route: string
}

const Board = ({ children }: { children: ReactNode }) => {

  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const sidebarOptions: SidebarOption[] = [
    {
      icon: UserOutlined,
      label: "home",
      route: '/'
    },
    {
      icon: LaptopOutlined,
      label: "test",
      route: '/test'
    },
    {
      icon: NotificationOutlined,
      label: "test",
      route: '/'
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
          await router.push(option.route);
        },
      };
    },
  );

  return (
    <Layout >
      <Header style={{ color: "white" }} className="flex justify-between items-center">
        <p>logo</p>
        <Button type="dashed" onClick={() => { void signOut() }}>Logout</Button>
      </Header>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1']}
            defaultOpenKeys={['sub1']}
            items={sidebarMenu}
          />
        </Sider>
        <Layout className='bg-white p-3 gap-1-2 overflow-x-scroll' style={{ height: "calc(100vh - 64px)" }}>
          <Content>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Board;
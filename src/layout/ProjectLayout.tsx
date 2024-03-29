import type { ReactNode } from 'react';
import { LaptopOutlined, SettingOutlined, TableOutlined, LineChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { App, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { useSession } from 'next-auth/react';
import ProjectWrapper from './ProjectWrapper';

type SidebarOption = {
  icon: React.ElementType,
  label: string,
  route: string
}

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  const { Header, Sider } = Layout;
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(true);

  const session = useSession();

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


  const sidebarMenu: MenuProps['items'] = sidebarOptions.map((option) => {
      return {
        key: option.route,
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
    <App>
      <ProjectWrapper>
        <Layout >
          <Header className="flex justify-between items-center px-6 py-0 border-bottom" style={{ backgroundColor: colorBgContainer }}>
            <Image src="/logo.svg" width={32} height={32} alt={'logo'} priority />
            {
              session.data?.user && <ProfileAvatar user={session.data?.user} />
            }
          </Header>
          <Layout hasSider style={{ backgroundColor: colorBgContainer }}>
            <Sider color={colorBgContainer} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} defaultCollapsed={true} className='h-100 mt-4' theme='light' style={{ backgroundColor: colorBgContainer }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[router.pathname.split('/')[5] ?? '']}
                items={sidebarMenu}
                className='p-2'
              />
            </Sider>
            <Layout className='px-4 gap-1-2 overflow-x-scroll mt-2' style={{ height: "calc(100vh - 76px)", backgroundColor: colorBgContainer }}>
              {children}
            </Layout>
          </Layout>
        </Layout>
      </ProjectWrapper>
    </App>
  );
};

export default ProjectLayout;
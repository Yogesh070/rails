import { useRouter } from 'next/router';
import React from 'react';
import { RouterOutputs, api } from '../../../../utils/api';
import { Typography, Avatar, Table, Button, } from 'antd';
import CustomDivider from '../../../../components/CustomDivider/CustomDivider';
import { ColumnsType } from 'antd/es/table';

import Image from 'next/image';
import WorkSpaceLayout from '../../../../layout/WorkspaceLayout';
import { useWorkspaceStore } from '../../../../store/workspace.store';

type ProjectWithLead = RouterOutputs['project']['getUserProjects'][number];

const { Title, Paragraph } = Typography;

const WorkSpace = () => {
  const router = useRouter();
  const { workspaceId } = router.query;

  const workspaceQuery = api.workspace.getWorkspaceByShortName.useQuery({
    shortname: workspaceId as string,
  });

  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);

  React.useEffect(() => {
    if (workspaceQuery.isSuccess) {
      setWorkspace(workspaceQuery.data);
    }
  }, [workspaceQuery.isSuccess]);

  const workspace = useWorkspaceStore((state) => state.workspace);

  const columns: ColumnsType<ProjectWithLead> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Project Type',
      dataIndex: 'projectType',
    },
    {
      title: 'Project Lead',
      dataIndex: ["projectLead", "image"],
      render: (text, record) => {
        return <Avatar size="small"> {record.projectLead?.image ? <Image src={text || '/logo.svg'} width={24} height={24} alt={text} style={{ objectFit: "contain" }} /> : text}</Avatar>
      }
    },
    {
      title: 'Project Status',
      dataIndex: 'status',
    },
  ];

  if (workspaceQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex gap-1 items-center">
        <Avatar
          size="small"
          shape="square"
          style={{ backgroundColor: workspace?.color, minWidth: '40px', minHeight: '40px' }}
        >{workspace?.name[0]}</Avatar>
        <div>
          <Title level={4} className='m-0'>{workspace?.name}</Title>
          <Paragraph className='m-0'>{workspace?.description}</Paragraph>
        </div>
      </div>
      <CustomDivider className='my-2' />
      <div className="flex items-center justify-between">
        <Title level={5} className='m-0'>All Projects</Title >
        <Button type="primary" onClick={() => { void router.push(`/w/${workspaceId}/projects/create`) }}>Create Project</Button>
      </div>
      <Table columns={columns} dataSource={workspace?.projects} size="small" loading={workspaceQuery.isLoading}
        className='mt-4'
        onRow={(record) => ({
          onClick: () => {
            void router.push(`/w/${workspaceId}/projects/${record.id}`);
          },
        })}
        rowKey="id"
      />
    </div>
  );
};

WorkSpace.getLayout = (page: React.ReactElement) => {
  return (
    <WorkSpaceLayout>{page}</WorkSpaceLayout>
  )
}

export default WorkSpace;


import {useRouter} from 'next/router';
import React from 'react';
import {Typography, Avatar, Table, Button} from 'antd';
import CustomDivider from '../../../../components/CustomDivider/CustomDivider';

import type {RouterOutputs} from '../../../../utils/api';
import type {ColumnsType} from 'antd/es/table';

import Image from 'next/image';
import WorkSpaceLayout from '../../../../layout/WorkspaceLayout';
import {useWorkspaceStore} from '../../../../store/workspace.store';

type ProjectWithLead = RouterOutputs['project']['getUserProjects'][number];

const {Title, Paragraph} = Typography;

const WorkSpace = () => {
  const router= useRouter();
  const workspace = useWorkspaceStore((state) => state.currentWorkspace);

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
      dataIndex: ['projectLead', 'image'],
      render: (text, record) => {
        return (
          <Avatar size="small">
            {' '}
            {record.projectLead?.image ? (
              <Image
                src={text || '/logo.svg'}
                width={24}
                height={24}
                alt={text}
                style={{objectFit: 'contain'}}
              />
            ) : (
              text
            )}
          </Avatar>
        );
      },
    },
    {
      title: 'Project Status',
      dataIndex: 'status',
    },
  ];

  return (
    <>
        <div className="flex gap-1 items-center">
          <Avatar
            size="large"
            shape="square"
            style={{
              backgroundColor: workspace?.color,
            }}
          >
            {workspace?.name[0]}
          </Avatar>
          <div>
            <Title level={4} className="m-0">
              {workspace?.name}
            </Title>
            <Paragraph className="m-0">{workspace?.description}</Paragraph>
          </div>
        </div>
        <CustomDivider className="my-2" />
        <div className="flex items-center justify-between">
          <Title level={5} className="m-0">
            All Projects
          </Title>
          <Button
            type="primary"
            onClick={() => {
              void router.push(`/w/${workspace!.id}/projects/create`);
            }}
          >
            Create Project
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={workspace?.projects}
          size="small"
          className="mt-4"
          onRow={(record) => ({
            onClick: () => {
              void router.push(`/w/${workspace!.id}/projects/${record.id}`);
            },
          })}
          rowKey="id"
        />
    </>
  );
};

WorkSpace.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default WorkSpace;

import {useRouter} from 'next/router';
import React from 'react';
import { api} from '../../../../utils/api';
import {Typography, Avatar, Table, Button, Skeleton} from 'antd';
import CustomDivider from '../../../../components/CustomDivider/CustomDivider';

import type {RouterOutputs} from '../../../../utils/api';
import type {ColumnsType} from 'antd/es/table';

import Image from 'next/image';
import WorkSpaceLayout from '../../../../layout/WorkspaceLayout';
import {useWorkspaceStore} from '../../../../store/workspace.store';

type ProjectWithLead = RouterOutputs['project']['getUserProjects'][number];

const {Title, Paragraph} = Typography;

const WorkSpace = () => {
  const router = useRouter();
  const {workspaceId} = router.query;

  const workspaceQuery = api.workspace.getWorkspaceByShortName.useQuery({
    shortname: workspaceId as string,
  });

  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

  React.useEffect(() => {
    if (workspaceQuery.isSuccess) {
      setCurrentWorkspace(workspaceQuery.data);
    }
  }, [setCurrentWorkspace, workspaceQuery.data, workspaceQuery.isSuccess]);

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
    <div>
      <Skeleton loading={workspaceQuery.isLoading} active>
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
              void router.push(`/w/${workspaceId}/projects/create`);
            }}
          >
            Create Project
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={workspace?.projects}
          size="small"
          loading={workspaceQuery.isLoading}
          className="mt-4"
          onRow={(record) => ({
            onClick: () => {
              void router.push(`/w/${workspaceId}/projects/${record.id}`);
            },
          })}
          rowKey="id"
        />
      </Skeleton>
    </div>
  );
};

WorkSpace.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default WorkSpace;

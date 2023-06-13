import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { Button, Avatar, Skeleton, Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

import NoSSR from '../../../components/NoSSR';
import Board from '../../../layout/Board';
import { api } from '../../../utils/api';
import { useRouter } from 'next/router';
import AddUserPopUp from '../../../components/AddUserPopUp.tsx/AddUserPopUp';

import type { Issue } from '@prisma/client';

const WorkflowContainers = dynamic(
  () =>
    import('../../../components/Workflow/WorkflowBoard').then(
      (mod) => mod.WorkflowContainers
    ),
  { ssr: false }
);

const SingleProject = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const workflowQuery = api.project.getProjectWorkflows.useQuery({
    projectId: projectId as string,
  });

  const convertWorkFlowsToRecord = () => {
    const records: Record<UniqueIdentifier, Issue[]> = {};
    workflowQuery.data?.workflows.forEach((workflow) => {
      records[workflow.id] = workflow.issue;
    });
    return records;
  };

  const items = convertWorkFlowsToRecord();

  const projectQuery = api.project.getProjectById.useQuery({
    id: projectId as string,
  });

  const projectMembersQuery = api.project.getProjectMembers.useQuery({
    projectId: projectId as string,
  });

  return (
    <NoSSR>
      <div className="flex justify-between">
        <h1>{projectQuery.data?.name}</h1>
        <div className="flex items-center gap-1-2 justify-between">
          <Skeleton loading={projectMembersQuery.isLoading} active paragraph>
            <div className="flex items-center gap-1-2">
              <Segmented
                options={[
                  {
                    value: 'List',
                    icon: <BarsOutlined rev={undefined} />,
                  },
                  {
                    value: 'Kanban',
                    icon: <AppstoreOutlined rev={undefined} />,
                  },
                ]}
                onChange={(value) => console.log(value)}
              />
              <Avatar.Group size={'small'}>
                {projectMembersQuery.data?.members.map((member, idx) => {
                  return (
                    <Avatar key={idx} src={member.image}>
                      {member.name}
                    </Avatar>
                  );
                })}
              </Avatar.Group>
              <AddUserPopUp render={<Button type="dashed" size="small">+</Button>} />
            </div>
          </Skeleton>
        </div>
      </div>
      <DndContext>
        <Suspense fallback={<div>Loading...</div>}>
          <WorkflowContainers items={items} scrollable />
        </Suspense>
      </DndContext>
    </NoSSR>
  );
};

SingleProject.getLayout = (page: React.ReactElement) => {
  return <Board>{page}</Board>;
};

export default SingleProject;

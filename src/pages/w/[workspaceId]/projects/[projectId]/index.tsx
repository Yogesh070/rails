import React, {Suspense} from 'react';
import dynamic from 'next/dynamic';
import {DndContext, UniqueIdentifier} from '@dnd-kit/core';
import {Button, Avatar, Skeleton, Segmented} from 'antd';
import {AppstoreOutlined, BarsOutlined} from '@ant-design/icons';

import NoSSR from '../../../../../components/NoSSR';
import Board from '../../../../../layout/Board';
import {api} from '../../../../../utils/api';
import {useRouter} from 'next/router';
import AddUserPopUp from '../../../../../components/AddUserPopUp.tsx/AddUserPopUp';

import type {Issue, WorkFlow} from '@prisma/client';
import {useProjectStore} from '../../../../../store/project.store';

const WorkflowContainers = dynamic(
  () =>
    import('../../../../../components/Workflow/WorkflowBoard').then(
      (mod) => mod.WorkflowContainers
    ),
  {ssr: false}
);

const SingleProject = () => {
  const router = useRouter();
  const {projectId} = router.query;

  const workflowQuery = api.project.getProjectWorkflows.useQuery({
    projectId: projectId as string,
  });

  const projectQuery = api.project.getProjectById.useQuery({
    id: projectId as string,
  });

  React.useEffect(() => {
    if (projectQuery.isSuccess) {
      setProject(projectQuery.data!);
    }
  }, [projectQuery.isSuccess]);

  React.useEffect(() => {
    if (workflowQuery.isSuccess) {
      setProjectWorkflows(workflowQuery.data?.workflows ?? []);
    }
  }, [workflowQuery.isSuccess]);

  const setProject = useProjectStore((state) => state.setProject);
  const setProjectWorkflows = useProjectStore(
    (state) => state.setProjectWorkflows
  );

  const project = useProjectStore((state) => state.project);

  const convertWorkFlowsToRecord = (
    workFlows: (WorkFlow & {
      issue: Issue[];
    })[]
  ) => {
    const records: Record<UniqueIdentifier, Issue[]> = {};
    workFlows.forEach((workflow) => {
      records[workflow.id] = workflow.issue;
    });
    return records;
  };

  return (
    <NoSSR>
      <div className="flex justify-between">
        <h1>{projectQuery.data?.name}</h1>
        <div className="flex items-center gap-1-2 justify-between">
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
          <Skeleton loading={projectQuery.isLoading} active paragraph>
            <div className="flex items-center gap-1-2">
              <Avatar.Group size={'small'}>
                {project?.members.map((member, idx) => {
                  return (
                    <Avatar key={idx} src={member.image}>
                      {member.name}
                    </Avatar>
                  );
                })}
              </Avatar.Group>
              <AddUserPopUp
                render={
                  <Button type="dashed" size="small">
                    +
                  </Button>
                }
              />
            </div>
          </Skeleton>
        </div>
      </div>
      <DndContext>
        <Suspense fallback={<div>Loading...</div>}>
          <Skeleton loading={workflowQuery.isLoading} active paragraph>
            <WorkflowContainers
              items={convertWorkFlowsToRecord(
                workflowQuery.data?.workflows ?? []
              )}
              scrollable
            />
          </Skeleton>
        </Suspense>
      </DndContext>
    </NoSSR>
  );
};

SingleProject.getLayout = (page: React.ReactElement) => {
  return <Board>{page}</Board>;
};

export default SingleProject;

import React, {Suspense, useCallback} from 'react';
import dynamic from 'next/dynamic';
import type {UniqueIdentifier} from '@dnd-kit/core';
import {Button, Avatar, Skeleton, Segmented, Typography} from 'antd';
import {AppstoreOutlined, BarsOutlined} from '@ant-design/icons';

import NoSSR from '../../../../../components/NoSSR';
import ProjectLayout from '../../../../../layout/ProjectLayout';
import type {RouterOutputs} from '../../../../../utils/api';
import { api} from '../../../../../utils/api';
import {useRouter} from 'next/router';
import AddUserPopUp from '../../../../../components/AddUserPopUp/AddUserPopUp';

import type {WorkFlow} from '@prisma/client';
import {useProjectStore} from '../../../../../store/project.store';

const WorkflowContainers = dynamic(
  () =>
    import('../../../../../components/Workflow/WorkflowBoard').then(
      (mod) => mod.WorkflowContainers
    ),
  {ssr: false}
);

const {Text} = Typography;

export type IssueWithCount = RouterOutputs['project']['getProjectWorkflows']['workflows'][number]['issue'][number];

const SingleProject = () => {
  const router = useRouter();
  const {projectId} = router.query;

  const workflowQuery = api.project.getProjectWorkflows.useQuery({
    projectId: projectId as string,
  });

  const setProjectWorkflows = useProjectStore(
    (state) => state.setProjectWorkflows
  );

  const project = useProjectStore((state) => state.project);
  const workflow = useProjectStore((state) => state.workflows);

  React.useEffect(() => {
    if (workflowQuery.isSuccess) {
      setProjectWorkflows(workflowQuery.data?.workflows ?? []);
    }
  }, [setProjectWorkflows, workflowQuery.data?.workflows, workflowQuery.isSuccess]);

  const convertWorkFlowsToRecord = useCallback(
    (workFlows: (WorkFlow & {issue: IssueWithCount[]})[]) => {
      const records: Record<UniqueIdentifier, IssueWithCount[]> = {};
      workFlows.forEach((workflow) => {
        records[workflow.id] = workflow.issue.sort((a, b) => {
          return a.index - b.index;
        });
      });
      return records;
    },
    []
  );

  const [boardLayout, setBoardLayout] = React.useState(true);

  return (
    <NoSSR>
      <div className="flex items-center justify-between">
        <Text strong>{project!.name}</Text>
        <div className="flex items-center gap-1-2 justify-between">
          <Segmented
            value={boardLayout ? 'Kanban' : 'List'}
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
            onChange={(value) => {
              if (value === 'Kanban') {
                setBoardLayout(true);
              } else {
                setBoardLayout(false);
              }
            }}
          />
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
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Skeleton loading={workflowQuery.isLoading} active paragraph>
          <WorkflowContainers
            items={convertWorkFlowsToRecord(workflow)}
            scrollable={false}
            vertical={!boardLayout}
            trashable={false}
          />
        </Skeleton>
      </Suspense>
    </NoSSR>
  );
};

SingleProject.getLayout = (page: React.ReactElement) => {
  return <ProjectLayout>{page}</ProjectLayout>;
};

export default SingleProject;

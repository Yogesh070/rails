import React, {useEffect} from 'react';
import ProjectLayout from '../../../../../../layout/ProjectLayout';
import {
  Button,
  Collapse,
  List,
  Modal,
  Skeleton,
  Typography,
  message,
  theme,
} from 'antd';

import {MoreOutlined} from '@ant-design/icons';
import {Dropdown} from 'antd';
import {api} from '../../../../../../utils/api';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import IssueModal from '../../../../../../components/Issue/IssueModal';
import BacklogItem from '../../../../../../components/Backlog/BacklogItem';
import SprintModal from '../../../../../../components/Backlog/SprintModal';
import {useSprintStore} from '../../../../../../store/sprint.store';

import type {CSSProperties} from 'react';
import type {CollapseProps} from 'antd';
import type {MenuProps} from 'antd';
import type {RouterOutputs} from '../../../../../../utils/api';

type Sprint = RouterOutputs['sprint']['getSprints'][0];

const {Title, Text} = Typography;

const Backlog = () => {
  const router = useRouter();

  const workflowQuery = api.workflow.getAllProjectWorkflows.useQuery({
    projectId: router.query.projectId as string,
  });

  const {
    sprints,
    backlogIssues,
    setSprints,
    addSprint,
    removeSprint,
    addSprintIssue,
    addBacklogIssue,
    setBacklogIssues,
  } = useSprintStore();

  const sprintQuery = api.sprint.getSprints.useQuery({
    projectId: router.query.projectId as string,
  });

  useEffect(() => {
    setSprints(sprintQuery.data || []);
  }, [sprintQuery.data, setSprints]);

  useEffect(() => {
    if (workflowQuery.data) {
      const backlog = workflowQuery.data.find(
        (workflow) => workflow.title === 'Backlog'
      );
      if (backlog) {
        setBacklogIssues(backlog.issue);
      }
    }
  }, [setBacklogIssues, workflowQuery.data]);

  const {mutate: createSprint, isLoading: isCreating} =
    api.sprint.createAutoSprint.useMutation({
      onSuccess: (sprint) => {
        addSprint({
          ...sprint,
          issues: [],
        });
        message.success('Sprint created successfully');
      },
    });

  const {mutate: createSprintIssue, isLoading: isCreatingSprintIssue} =
    api.sprint.createSprintIssue.useMutation({
      onSuccess: (issue, opt) => {
        addSprintIssue(opt.sprintId, issue);
        message.success('Sprint Issue created successfully');
      },
    });

  const {mutate: deleteSprint, isLoading: isDeleting} =
    api.sprint.deleteSprint.useMutation({
      onSuccess: (sprint) => {
        message.success('Sprint delete successfully');
        removeSprint({
          ...sprint,
          issues: [],
        });
      },
      onError: () => {
        message.error('Error Deleting Sprint');
      },
    });

  const {mutate: createIssue} = api.issue.createIssue.useMutation({
    onSuccess: (issue) => {
      addBacklogIssue(issue);
      message.success('Issue created successfully');
    },
    onError: () => {
      message.error('Error Creating Issue');
    },
  });

  const {token} = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const sprintMenuOptions: MenuProps['items'] = [
    {
      label: ' Edit Sprint',
      key: 'edit',
    },
    {
      type: 'divider',
    },
    {
      label: 'Delete Sprint',
      key: 'delete',
    },
  ];

  const handleMenuClick = (event: any, sprint: Sprint) => {
    switch (event.key) {
      case 'delete':
        Modal.error({
          title: 'Delete Sprint?',
          content: `Are you sure you want to delete ${sprint.title}?`,
          okText: 'Delete',
          cancelText: 'Cancel',
          maskClosable: true,
          okType: 'danger',
          onOk() {
            deleteSprint({id: sprint.id});
          },
          onCancel() {},
          closable: true,
        });
        break;
      case 'edit':
        //TODO: OPEN MODAL TO EDIT SPRINT
        break;
      default:
        break;
    }
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (
    panelStyle
  ) =>
    sprints.map((sprint) => {
      const {id, title, startDate, endDate, issues, hasStarted} = sprint;
      return {
        key: id,
        label: (
          <div className="flex gap-1-2">
            <Text strong>{title}</Text>
            {startDate != null ? (
              <Text>
                {dayjs(startDate).format('D MMM')} -{' '}
                {dayjs(endDate).format('D MMM')}
              </Text>
             ):<></>} 
            <p>({issues.length} issues)</p>
          </div>
        ),
        children: (
          <>
            <List
              dataSource={issues}
              size="small"
              loading={sprintQuery.isLoading || isCreatingSprintIssue}
              renderItem={(item) => (
                <BacklogItem
                  item={item}
                  sprintId={id}
                  workflows={workflowQuery.data ?? []}
                  isLoadingWorkflow={workflowQuery.isLoading}
                />
              )}
            />
            <IssueModal
              onEnterPress={function (value: string): void {
                if (workflowQuery.isFetched) {
                  createSprintIssue({
                    title: value,
                    sprintId: id,
                    index: 0,
                    workflowId: workflowQuery.data?.[1]?.id as string,
                  });
                }
              }}
            />
          </>
        ),
        extra: (
          <div className="flex gap-1-2">
            <SprintModal
              issueCount={issues.length}
              buttonTitle={hasStarted ? 'Complete sprint' : 'Start sprint'}
              initialValues={{
                name: title,
                duration: '2',
              }}
              disabled={issues.length === 0}
              sprint={sprint}
            />
            <Dropdown
              menu={{
                items: sprintMenuOptions,
                onClick: (e) => {
                  e.domEvent.stopPropagation();
                  handleMenuClick(e, sprint);
                },
              }}
              trigger={['click']}
            >
              <Button
                size="small"
                icon={<MoreOutlined />}
                loading={isDeleting}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            </Dropdown>
          </div>
        ),
        style: panelStyle,
      };
    });

  return (
    <div>
      <Title level={4}>Backlog</Title>
      <Skeleton loading={sprintQuery.isLoading} active>
        <Collapse
          ghost
          bordered={false}
          items={getItems(panelStyle)}
          size="small"
          collapsible="header"
          defaultActiveKey={sprints.map((sprint) => sprint.id)}
        />
      </Skeleton>
      <Collapse
        ghost
        bordered={false}
        collapsible="header"
        defaultActiveKey={['backlog']}
        items={[
          {
            key: 'backlog',
            label: <Text strong>Backlog</Text>,
            children: (
              <>
                <List
                  dataSource={backlogIssues}
                  loading={workflowQuery.isLoading}
                  size="small"
                  renderItem={(item) => (
                    <BacklogItem
                      item={item}
                      sprintId={
                        workflowQuery.data?.find(
                          (workflow) =>
                            workflow.title.toLowerCase() === 'backlog'
                        )?.id!
                      }
                      workflows={workflowQuery.data ?? []}
                      isLoadingWorkflow={workflowQuery.isLoading}
                    />
                  )}
                />
                <IssueModal
                  onEnterPress={function (value: string): void {
                    createIssue({
                      title: value,
                      workflowId: workflowQuery.data?.find(
                        (workflow) => workflow.title.toLowerCase() === 'backlog'
                      )?.id as string,
                      index: 0,
                    });
                  }}
                />
              </>
            ),
            extra: (
              <div className="flex gap-1-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    createSprint({
                      projectId: router.query.projectId as string,
                    });
                  }}
                  loading={isCreating}
                >
                  Create sprint
                </Button>
              </div>
            ),
            style: panelStyle,
          },
        ]}
      />
    </div>
  );
};

Backlog.getLayout = function getLayout(page: React.ReactElement) {
  return <ProjectLayout>{page}</ProjectLayout>;
};

export default Backlog;

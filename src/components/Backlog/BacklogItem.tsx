import type { MenuProps } from 'antd';
import { Button, List, Select, Dropdown, message, Modal, theme } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { Issue } from '@prisma/client';
import { api, type RouterOutputs } from '../../utils/api';
import { useSprintStore } from '../../store/sprint.store';

import { QuestionCircleOutlined } from '@ant-design/icons';

interface Props {
  item: Issue;
  sprintId: string;
  workflows: RouterOutputs['workflow']['getAllProjectWorkflows'];
  isLoadingWorkflow: boolean;
}

const { useToken } = theme;

const BacklogItem = (props: Props) => {
  const items: MenuProps['items'] = [
    {
      key: 'flag',
      label: props.item.flagged ? 'Remove Flag' : 'Add Flag',
    },
    {
      key: 'delete',
      label: 'Delete',
      danger: true,
    },
  ];
  const { removeSprintIssue, deleteBacklogIssue, updateIssue } = useSprintStore();

  const { mutate: deleteSprintIssue, isLoading: isDeleting } =
    api.issue.deleteIssueById.useMutation({
      onSuccess: (issue) => {
        message.success('Issue delete successfully');
        if (
          props.workflows.find((workflow) => workflow.id === issue.workFlowId)
            ?.title === 'Backlog'
        ) {
          deleteBacklogIssue(issue);
        }
        removeSprintIssue(props.sprintId, issue);
      },
      onError: () => {
        message.error('Error Deleting Issue');
      },
    });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const { mutate: addFlag } = api.issue.addFlag.useMutation({
    onSuccess: () => {
      updateIssue({
        ...props.item,
        flagged: true,
      });
    },
    onError: () => {
      message.error('Error Flagging Issue');
    },
  });

  const { mutate: removeFlag } = api.issue.removeFlag.useMutation({
    onSuccess: () => {
      updateIssue({
        ...props.item,
        flagged: false,
      });
    },
    onError: () => {
      message.error('Error Unflagging Issue');
    },
  });

  const handleMenuClick = (event: any, id: string) => {
    switch (event.key) {
      case 'delete':
        Modal.error({
          icon: <QuestionCircleOutlined />,
          title: 'Delete Issue?',
          content:
            "You're about to permanently delete this issue, its comments and attachments, and all of its data.",
          okText: 'Delete',
          cancelText: 'Cancel',
          maskClosable: true,
          okType: 'danger',
          onOk() {
            deleteSprintIssue({ id });
          },
          onCancel() { },
          closable: true,
        });
        break;
      case 'flag':
        if (props.item.flagged) {
          removeFlag({ issueId: id });
        } else {
          addFlag({ issueId: id });
        }
        break;
      default:
        break;
    }
  };
  const { token } = useToken();

  return (
    <List.Item
      style={{
        cursor: 'move',
        backgroundColor: props.item.flagged ? token.colorWarningHover : '',
      }}
      actions={[
        <Select
          loading={props.isLoadingWorkflow}
          defaultValue={
            props.workflows.find(
              (workflow) => workflow.id === props.item.workFlowId
            )?.title
          }
          bordered={false}
          style={{ width: 120 }}
          onChange={handleChange}
          options={
            props.workflows.map((workflow) => ({
              label: workflow.title,
              value: workflow.id,
            })) || []
          }
          key={'select'}
        />,
        <Dropdown
          menu={{
            items: items,
            onClick: (e) => {
              handleMenuClick(e, props.item.id);
            },
          }}
          trigger={['click']}
          key="btn"
        >
          <Button
            type="ghost"
            icon={<MoreOutlined />}
            onClick={(event) => {
              event.stopPropagation();
            }}
            loading={isDeleting}
          />
        </Dropdown>,
      ]}
    >
      {props.item.title}
    </List.Item>
  );
};

export default BacklogItem;

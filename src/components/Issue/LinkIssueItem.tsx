import type {Issue} from '@prisma/client';
import {List, Select, Button} from 'antd';

import {CloseOutlined} from '@ant-design/icons';
import {api} from '../../utils/api';
import { useProjectStore } from '../../store/project.store';

interface LinkedItemProps {
  item: Issue;
  parentIssueId: string;
}

const LinkIssueItem = (props: LinkedItemProps) => {
  const {mutate: unlinkIssue, isLoading: isUnlinking} =
    api.issue.unlinkAnotherIssueFromIssue.useMutation();

    const workflows = useProjectStore((state) => state.workflows);
  return (
    <List.Item
      actions={[
        <Select
          defaultValue={
            workflows.find(
              (workflow) => workflow.id === props.item.workFlowId
            )?.title
          }
          bordered={false}
          style={{width: 120}}
          options={
            workflows.map((workflow) => ({
              label: workflow.title,
              value: workflow.id,
            })) || []
          }
          key={'select'}
        />,
        <Button
          size="small"
          icon={<CloseOutlined />}
          key="btn"
          onClick={() =>
            unlinkIssue({
              issueId: props.parentIssueId,
              linkedIssueId: props.item.id,
            })
          }
          loading={isUnlinking}
        />,
      ]}
    >
      {props.item.title}
    </List.Item>
  );
};

export default LinkIssueItem;

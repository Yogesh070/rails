import {Button, List, Typography} from 'antd';
import React from 'react';

import {PlusOutlined} from '@ant-design/icons';
import type {RouterOutputs} from '../../utils/api';
import LinkIssueItem from './LinkIssueItem';

type IssueDetail = RouterOutputs['issue']['getIssueById'];

interface LinkIssueProps {
  issue: IssueDetail;
  isFormVisible: boolean;
  showForm: () => void;
  hideForm: () => void;
}

const {Text} = Typography;

const LinkedIssueList = (props: LinkIssueProps) => {

  return (
    <>
      <div className="flex justify-between">
        <Text strong>Linked Issue</Text>
        <Button icon={<PlusOutlined />} onClick={props.showForm} size="small" />
      </div>
      <List
        dataSource={props.issue.linkedIssues}
        size="small"
        bordered
        renderItem={(issue) => (
          <LinkIssueItem
            key={issue.id}
            item={issue}
            parentIssueId={props.issue.id}
          />
        )}
      />
    </>
  );
};

export default LinkedIssueList;

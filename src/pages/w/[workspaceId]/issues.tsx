import React from 'react';
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';
import { Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';

import type {RouterOutputs} from '../../../utils/api';
import {api} from '../../../utils/api';
import dayjs from 'dayjs';

const {Title, Text} = Typography;

type UserAsssignedIssue =
  RouterOutputs['issue']['getUserAssignedIssues'][number];

const MyIssues = () => {
  const userAssignedIssuesQuery = api.issue.getUserAssignedIssues.useQuery({});
  const columns: ColumnsType<UserAsssignedIssue> = [
    {
      title: 'Title',
      render: (_, record) => {
        return <Text>{record.title}</Text>;
      },
    },
    {
      title: 'Status',
      render: (_, record) => {
        return <Text>{record.workFlow?.title}</Text>;
      },
    },
    {
      title: 'Due Date',
      render: (_, record) => {
        return <Text>{dayjs(record.dueDate).format('D MMM') ?? '-'}</Text>;
      },
    },
    {
      title: 'Project',
      render: (_, record) => {
        return <Text>{record.workFlow?.project.name}</Text>;
      },
    },
  ];
  return (
    <>
      <Title level={4}>My Issues</Title>
      <Table
        columns={columns}
        dataSource={userAssignedIssuesQuery?.data}
        size="small"
        rowKey="id"
        loading={userAssignedIssuesQuery.isLoading}
        
      />
    </>
  );
};
MyIssues.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default MyIssues;
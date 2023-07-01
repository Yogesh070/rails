import React from 'react';
import Board from '../../../../../../layout/Board';
import {Typography} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {useProjectStore} from '../../../../../../store/project.store';

const {Title, Paragraph} = Typography;

const Analytics = () => {
  const workflows = useProjectStore((state) => state.workflows);

  const data = workflows.map((workflow) => {
    return {
      name: workflow.title,
      issueCount: workflow.issue.length,
    };
  });

  return (
    <>
      <Title level={4} className="m-0">
        Status Chart
      </Title>
      <Paragraph>
        This chart shows the current status for the total number of items in
        your project.
      </Paragraph>
      <ResponsiveContainer width="60%" height="80%">
        <BarChart
          width={300}
          height={100}
          data={data}
          margin={{
            top: 5,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="issueCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Analytics;

Analytics.getLayout = (page: React.ReactElement) => {
  return <Board>{page}</Board>;
};

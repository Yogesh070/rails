import React from 'react'
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';

const MyIssues = () => {
  return (
    <div>MyIssues</div>
  )
}
MyIssues.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default MyIssues
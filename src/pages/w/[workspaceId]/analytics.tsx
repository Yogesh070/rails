import React from 'react'
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';

const Analytics = () => {
  return (
    <div>Analytics</div>
  )
}
Analytics.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default Analytics
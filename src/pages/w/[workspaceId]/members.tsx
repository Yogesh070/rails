import React from 'react'
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';

const Members = () => {
  return (
    <div>Members</div>
  )
}
Members.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default Members
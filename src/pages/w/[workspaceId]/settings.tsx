import React from 'react'
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';

const Settings = () => {
  return (
    <div>Settings</div>
  )
}
Settings.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default Settings
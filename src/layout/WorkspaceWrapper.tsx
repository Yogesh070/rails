import React from 'react';
import {api} from '../utils/api';
import {useRouter} from 'next/router';
import CircularProgressIndicator from '../components/CircularProgressIndicator/CircularProgressIndicator';
import {Button, Typography} from 'antd';
import {useWorkspaceStore} from '../store/workspace.store';

const {Text} = Typography;

interface WorkspaceWrapperProps {
  children: React.ReactNode;
}

const WorkspaceWrapper = (props: WorkspaceWrapperProps) => {
  const router = useRouter();
  const {workspaceId} = router.query;

  const workspaceQuery = api.workspace.getWorkspaceByShortName.useQuery({
    shortname: workspaceId as string,
  });

  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  React.useEffect(() => {
    if (workspaceQuery.isSuccess) {
      setCurrentWorkspace(workspaceQuery.data);
    }
  }, [setCurrentWorkspace, workspaceQuery.data, workspaceQuery.isSuccess]);

  if (workspaceQuery.isLoading)
    return (
      <div className="flex h-full justify-center items-center flex-col gap-1">
        <CircularProgressIndicator />
        <Text>Initializing workspace...</Text>
      </div>
    );

  if (workspaceQuery.isError) {
    return (
      <div className="flex h-full justify-center items-center flex-col gap-1">
        <Text> Something went wrong...</Text>
        <Button
          onClick={() => {
            router.push('/');
          }}
        >
          Go Home
        </Button>
      </div>
    );
  }
  return <>{props.children}</>;
};

export default WorkspaceWrapper;

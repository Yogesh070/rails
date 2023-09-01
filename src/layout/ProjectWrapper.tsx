import React from 'react';
import {api} from '../utils/api';
import {useRouter} from 'next/router';
import {useProjectStore} from '../store/project.store';
import CircularProgressIndicator from '../components/CircularProgressIndicator/CircularProgressIndicator';
import {Button, Layout, message} from 'antd';
import { useSession } from 'next-auth/react';
import { useWorkspaceStore } from '../store/workspace.store';

interface ProjectWrapperProps {
  children: React.ReactNode;
}

const ProjectWrapper = (props: ProjectWrapperProps) => {
  
  const router = useRouter();
  const {setProject,addMemberToProject} = useProjectStore();
  const currentWorkspace= useWorkspaceStore(state=>state.currentWorkspace);

  const session = useSession();
  const projectId = router.query.projectId as string;

  const projectQuery = api.project.getProjectById.useQuery(
    {
      id: projectId,
    },
    {
      onSuccess(data) {
        setProject(data);
      },
    }
  );

  const {mutate:joinProject, isLoading} = api.project.assignUserToProject.useMutation({
    onSuccess(data) {
      addMemberToProject(data);
    },
    onError() {
      message.error('Something went wrong');
    }
  });
  
  if (projectQuery.isLoading)
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <CircularProgressIndicator />
        Initializing your project...
      </Layout>
    );

  if (projectQuery.isError || session.data?.user == null) {
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        Something went wrong...
        <Button
          onClick={() => {
            router.push('/');
          }}
        >
          Go Home
        </Button>
      </Layout>
    );
  }

  if(!projectQuery.data?.members.map(member=>member.id).includes(session.data?.user?.id) && currentWorkspace?.members.map(member=>member.id).includes(session.data?.user?.id) ) {
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        You are not a member of this project.
        <Button loading={isLoading} onClick={()=>{
          joinProject({
            workspaceId: currentWorkspace?.id!,
            projectId: projectId,
            userId: session.data?.user?.id!,
          })
        }}>Join {projectQuery.data?.name}</Button>
      </Layout>
    );
  }

  return <>{props.children}</>;
};

export default ProjectWrapper;

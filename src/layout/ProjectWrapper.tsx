import React from 'react';
import {api} from '../utils/api';
import {useRouter} from 'next/router';
import {useProjectStore} from '../store/project.store';
import CircularProgressIndicator from '../components/CircularProgressIndicator/CircularProgressIndicator';
import {Layout} from 'antd';

interface ProjectWrapperProps {
  children: React.ReactNode;
}

const ProjectWrapper = (props: ProjectWrapperProps) => {
  const router = useRouter();
  const {setProject} = useProjectStore();
  const projectQuery = api.project.getProjectById.useQuery(
    {
      id: router.query.projectId as string,
    },
    {
      onSuccess(data) {
        setProject(data);
      },
    }
  );
  if (projectQuery.isLoading)
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <CircularProgressIndicator />
        Initializing your project...
      </Layout>
    );
  return <>{props.children}</>;
};

export default ProjectWrapper;

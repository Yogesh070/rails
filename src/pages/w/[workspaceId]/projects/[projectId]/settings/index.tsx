import React from 'react';
import { Button, Input, Form, Select, Badge, message, Skeleton, Typography } from 'antd';
import { api } from '../../../../../../utils/api';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AddUserPopUp from '../../../../../../components/AddUserPopUp/AddUserPopUp';
import CustomDivider from '../../../../../../components/CustomDivider/CustomDivider';
import { ProjectStatus } from '@prisma/client'

import type { FormInstance } from 'antd/lib/form/Form';
import type { User } from '@prisma/client';
import SettingsLayout from '../../../../../../layout/SettingsLayout';

type FormInitialValues = {
  name: string | undefined;
  projectLead: string | undefined;
  defaultAssignee: string | undefined | null;
};

const { Text, Title } = Typography;

const Settings = () => {

  const router = useRouter();
  const { projectId, workspaceId } = router.query;

  const projectDetails = api.project.getProjectById.useQuery({
    id: projectId as string,
  });

  const getUserOptions = (users: User[]) => {
    const options = users.map((member) => {
      return {
        value: member.id,
        label: member.name,
      }
    });
    return options;
  }

  const projectMembers = getUserOptions(projectDetails.data?.members ?? []);
  const projectLead = getUserOptions([projectDetails.data?.projectLead ?? {} as User]);
  const userOptions = [...projectMembers, ...projectLead];

  const [form] = Form.useForm();

  React.useEffect(() => {
    if (projectDetails.isSuccess) {
      form.setFieldsValue({
        name: projectDetails.data?.name,
        projectLead: projectDetails.data?.projectLeadId,
        defaultAssignee: projectDetails.data?.defaultAssigneeId ?? 'unassigned',
      })
    }
  }, [form, projectDetails]);

  const { mutate: updateProject, isLoading: isUpdating } = api.project.updateProject.useMutation({
    onSuccess: () => {
      message.success('Project updated successfully');
      projectDetails.refetch();
    },
    onError: () => {
      message.error('Error updating project');
    },
  });
  const { mutate: deleteProject, isLoading: isDeleting } = api.project.deleteProject.useMutation({
    onSuccess: () => {
      message.success('Project delete successfully');
      router.push('/projects')
    },
    onError: () => {
      message.error('Error Deleting Project');
    },
  });

  const handleSubmit = (values: FormInitialValues) => {
    updateProject({ name: values.name!, id: projectId as string, projectLeadId: values.projectLead!, defaultAssigneeId: values.defaultAssignee === 'unassigned' ? null : values.defaultAssignee! });
  };

  const handleProjectDelete = () => {
    deleteProject({
      id: projectId as string
    })
  }

  return (
    <>
      <Skeleton active loading={projectDetails.isLoading} avatar>
        <div className="flex justify-between">
          <div className="flex gap-1 ">
            <Image src="/logo.svg" width={64} height={64} alt={'dp'} priority />
            <div className='flex flex-col gap-1-2 justify-between'>
              <Title level={5} >{projectDetails.data?.name} {projectDetails.data?.status == ProjectStatus.ACTIVE ? <Badge status="success" /> :
                <Badge status="error" />}
              </Title>
              <Button type="default" size='middle'>Change Icon</Button>
            </div>
          </div>
          <AddUserPopUp />
        </div>
        <CustomDivider />
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit} >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="projectLead" label="Project Lead" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select a user"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={userOptions}
            />
          </Form.Item>
          <Form.Item name="defaultAssignee" label="Default Assignee">
            <Select
              showSearch
              placeholder="Select a default assignee"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[{
                value: 'unassigned',
                label: 'Unassigned',
              }, ...userOptions]}
            />
          </Form.Item>
          <Form.Item>
            <SubmitButton form={form} initialValues={
              {
                name: projectDetails.data?.name,
                projectLead: projectDetails.data?.projectLeadId,
                defaultAssignee: projectDetails.data?.defaultAssigneeId ?? 'unassigned',
              }
            }
              isLoading={isUpdating}
            />
          </Form.Item>
        </Form>
        <CustomDivider />
        <div className="flex items-center justify-between flex-wrap gap-1-2">
          <div>
            <Title level={5}>Danger Zone</Title>
            <Text>When deleting a project, all of the data and resources within that project will be permanently removed and cannot be recovered.
            </Text>
          </div>
          <Button type="primary" danger onClick={handleProjectDelete} loading={isDeleting}>
            Delete Project
          </Button>
        </div>
      </Skeleton>
    </>
  );
};

Settings.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SettingsLayout>{page}</SettingsLayout>
  )
}
export default Settings

const SubmitButton = ({ form, initialValues, isLoading }: { form: FormInstance, initialValues: FormInitialValues, isLoading: boolean }) => {
  const [submittable, setSubmittable] = React.useState(false);

  const values: FormInitialValues = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (values && initialValues) {
          if (values.name !== initialValues.name || values.projectLead !== initialValues.projectLead || values.defaultAssignee !== initialValues.defaultAssignee) {
            setSubmittable(true);
          } else {
            setSubmittable(false);
          }
        }
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [form, initialValues, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} loading={isLoading}>
      Submit
    </Button>
  );
};
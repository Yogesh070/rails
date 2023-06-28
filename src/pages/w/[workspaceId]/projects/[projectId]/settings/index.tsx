import React from 'react';
import Board from '../../../../../../layout/Board';
import { Button, Input, Form, Select, Badge, Breadcrumb, message } from 'antd';
import { api } from '../../../../../../utils/api';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AddUserPopUp from '../../../../../../components/AddUserPopUp.tsx/AddUserPopUp';
import CustomDivider from '../../../../../../components/CustomDivider/CustomDivider';
import Link from 'next/link';
import { ProjectStatus } from '@prisma/client'
import { HomeOutlined } from '@ant-design/icons';

import type { FormInstance } from 'antd/lib/form/Form';
import type { User } from '@prisma/client';

type FormInitialValues = {
  name: string | undefined;
  projectLead: string | undefined | null;
  defaultAssignee: string | undefined | null;
};

const Settings = () => {

  const router = useRouter();
  const { projectId } = router.query;

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
        defaultAssignee: projectDetails.data?.defaultAssigneeId,
      })
    }
  }, [projectDetails]);

  //TODO: Handle null values as initial values on input fields
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
    updateProject({ name: values.name!, id: projectId as string, projectLeadId: values.projectLead!, defaultAssigneeId: values.defaultAssignee! });
  };

  const handleProjectDelete = () => {
    deleteProject({
      id: projectId as string
    })
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link href='/w/home'><HomeOutlined rev={undefined} /></Link>,
          },
          {
            title: (
              <Link href={`/projects/${projectId}`}>
                <span>{projectDetails.data?.name}</span>
              </Link>
            ),
          },
          {
            title: 'Settings',
          },
        ]}
      />
      <div className="flex justify-between my-3">
        <div className="flex gap-1 ">
          <Image src="/logo.svg" width={64} height={64} alt={'dp'} priority />
          <div className='flex flex-col gap-1-2 justify-between'>
            <h1>{projectDetails.data?.name} {projectDetails.data?.status == ProjectStatus.ACTIVE ? <Badge status="success" /> :
              <Badge status="error" />}
            </h1>
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
              value: null,
              label: 'Unassigned',
            }, ...userOptions]}
          />
        </Form.Item>
        <Form.Item>
          <SubmitButton form={form} initialValues={
            {
              name: projectDetails.data?.name,
              projectLead: projectDetails.data?.projectLeadId,
              defaultAssignee: projectDetails.data?.defaultAssigneeId,
            }
          }
            isLoading={isUpdating}
          />
        </Form.Item>
      </Form>
      <CustomDivider className='my-4' />
      <div className="flex items-center justify-between flex-wrap gap-1-2">
        <div>
          <h1>Danger Zone</h1>
          <p>When deleting a project, all of the data and resources within that project will be permanently removed and cannot be recovered.
          </p>
        </div>
        <Button type="primary" danger onClick={handleProjectDelete} loading={isDeleting}>
          Delete Project
        </Button>
      </div>
    </>
  );
};


Settings.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Board>{page}</Board>
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
  }, [values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} loading={isLoading}>
      Submit
    </Button>
  );
};
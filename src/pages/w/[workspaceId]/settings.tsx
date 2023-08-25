import React from 'react';
import WorkSpaceLayout from '../../../layout/WorkspaceLayout';
import {Button, Input, Form, Typography, message, ColorPicker} from 'antd';
import {useRouter} from 'next/router';

import type {FormInstance} from 'antd/lib/form/Form';
import AddUserPopUp from '../../../components/AddUserPopUp/AddUserPopUp';
import CustomDivider from '../../../components/CustomDivider/CustomDivider';
import {api} from '../../../utils/api';

type FormInitialValues = {
  name: string | undefined;
  website: string | undefined | null;
  description: string | undefined | null;
  color: string | undefined;
};

const {Title, Paragraph} = Typography;
const {TextArea} = Input;

const Settings = () => {
  const router = useRouter();
  const {workspaceId} = router.query;

  const workspaceDetails = api.workspace.getWorkspaceByShortName.useQuery({
    shortname: workspaceId as string,
  });

  const [form] = Form.useForm();

  React.useEffect(() => {
    if (workspaceDetails.isSuccess) {
      form.setFieldsValue({
        name: workspaceDetails.data?.name,
        website: workspaceDetails.data?.website,
        description: workspaceDetails.data?.description,
        color: workspaceDetails.data?.color,
      });
    }
  }, [
    form,
    workspaceDetails.data?.color,
    workspaceDetails.data?.description,
    workspaceDetails.data?.name,
    workspaceDetails.data?.website,
    workspaceDetails.isSuccess,
  ]);

  //TODO: Handle null values as initial values on input fields
  const {mutate: updateWorkspace, isLoading: isUpdating} =
    api.workspace.updateWorkspace.useMutation({
      onSuccess: () => {
        message.success('Workspace updated successfully');
        workspaceDetails.refetch();
      },
      onError: () => {
        message.error('Error updating workspace');
      },
    });
  const {mutate: deleteWorkspace, isLoading: isDeleting} =
    api.workspace.deleteWorkspace.useMutation({
      onSuccess: () => {
        message.success('Workspace delete successfully');
        router.push('/w/home');
      },
      onError: () => {
        message.error('Error Deleting Workspace');
      },
    });

  const handleSubmit = (values: FormInitialValues) => {
    updateWorkspace({
      name: values.name!,
      workspaceName: workspaceId as string,
      description: values.description!,
      website: values.website!,
      color: values.color!,
    });
  };

  const handleWorkspaceDelete = () => {
    deleteWorkspace({
      id: workspaceId as string,
    });
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Title level={5} className="m-0">
            Workspace Settings
          </Title>
          <Paragraph className="m-0">
            This information will be displayed to every member of the workspace.
          </Paragraph>
        </div>
        <AddUserPopUp />
      </div>
      <CustomDivider />
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input />
        </Form.Item>
        <Form.Item name="website" label="Website">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="color" label="Color">
          <ColorPicker
           showText
           disabledAlpha
           onChange={(_, hex) => {
            form.setFieldsValue({color: hex});
          }}
            presets={[
              {
                label: 'Recommended',
                colors: [
                  '#F5222D',
                  '#FA8C16',
                  '#FADB14',
                  '#8BBB11',
                  '#52C41A',
                  '#13A8A8',
                  '#1677FF',
                  '#2F54EB',
                  '#722ED1',
                  '#EB2F96',
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <SubmitButton
            form={form}
            initialValues={{
              name: workspaceDetails.data?.name,
              website: workspaceDetails.data?.website,
              description: workspaceDetails.data?.description,
              color: workspaceDetails.data?.color,
            }}
            isLoading={isUpdating}
          />
        </Form.Item>
      </Form>
      <CustomDivider />
      <div className="flex items-center justify-between flex-wrap gap-1-2">
        <div>
          <Title level={5}>Danger Zone</Title>
          <Paragraph>
            Once you delete a worksTextace, there is no going back. Please be
            certain. Deleting workspace would lead to deleting all workspaces
            within it.
          </Paragraph>
        </div>
        <Button
          type="primary"
          danger
          onClick={handleWorkspaceDelete}
          loading={isDeleting}
        >
          Delete Workspace
        </Button>
      </div>
    </>
  );
};
Settings.getLayout = (page: React.ReactElement) => {
  return <WorkSpaceLayout>{page}</WorkSpaceLayout>;
};

export default Settings;

const SubmitButton = ({
  form,
  initialValues,
  isLoading,
}: {
  form: FormInstance;
  initialValues: FormInitialValues;
  isLoading: boolean;
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  const values: FormInitialValues = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({validateOnly: true}).then(
      () => {
        if (values && initialValues) {
          if (
            values.name !== initialValues.name ||
            values.website !== initialValues.website ||
            values.description !== initialValues.description ||
            values.color !== initialValues.color
          ) {
            setSubmittable(true);
          } else {
            setSubmittable(false);
          }
        }
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, initialValues, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      loading={isLoading}
    >
      Submit
    </Button>
  );
};

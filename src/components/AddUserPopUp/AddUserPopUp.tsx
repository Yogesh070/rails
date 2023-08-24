import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { api } from '../../utils/api';
import { useWorkspaceStore } from '../../store/workspace.store';

interface AddUserPopUpProps {
  render?: React.ReactNode;
}

const AddUserPopUp = (props: AddUserPopUpProps) => {
  const [open, setOpen] = useState(false);

  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);

  const { mutate: sendWorkspaceInvite, isLoading } = api.workspace.sendWorkspaceInvite.useMutation({
    onSuccess() {
      form.resetFields();
      setOpen(false);
      message.success('Invite sent successfully');
    },
    onError() {
      message.error('Something went wrong');
    }
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (!currentWorkspace) return;
    sendWorkspaceInvite({ workspaceId: currentWorkspace!.id, email: values.email });
  };

  return (
    <div>
      {props.render ? <div onClick={showModal}>{props.render}</div> : <Button type="primary" onClick={showModal} icon={<UserPlusIcon width={16} />} className='flex items-center gap-1-2-3'>
        Invite Members
      </Button>}
      <Modal
        title="Invite Members"
        open={open}
        onOk={handleOk}
        confirmLoading={isLoading}
        onCancel={handleCancel}
        okText="Invite"
      >
        <Form
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddUserPopUp;
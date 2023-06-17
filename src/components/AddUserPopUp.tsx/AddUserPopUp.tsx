import React, {useState} from 'react';
import {Button, Modal, Form, Input, Select} from 'antd';
import { UserPlusIcon } from '@heroicons/react/24/outline';

interface AddUserPopUpProps {
  render?: React.ReactNode;
}

const AddUserPopUp = (props:AddUserPopUpProps) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div>
     {<div onClick={showModal}>{props.render}</div> ?? <Button type="primary" onClick={showModal} icon={<UserPlusIcon width={16} />}className='flex items-center gap-1-2-3'>
        Invite Members
      </Button>}
      <Modal
            title="Invite Members"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              name="control-hooks"
              onFinish={onFinish}
              style={{maxWidth: 600}}
            >
              <Form.Item name="email" label="Email" rules={[{required: true}]}>
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{required: true}]}>
                <Select placeholder="Select a Role" allowClear>
                  <Option value="admin">admin</Option>
                  <Option value="member">member</Option>
                  <Option value="other">other</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
    </div>
  );
};

export default AddUserPopUp;

const {Option} = Select;

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};

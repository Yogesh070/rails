import {DndContext, UniqueIdentifier} from '@dnd-kit/core';
import NoSSR from '../../../components/NoSSR';
import Board from '../../../layout/Board';
import {api} from '../../../utils/api';
import {useRouter} from 'next/router';

import type {Issue} from '@prisma/client';
import dynamic from 'next/dynamic';
import React, {Suspense, useState} from 'react';
import {Button, Modal, Form, Input, Select, Avatar, Tooltip} from 'antd';

const {Option} = Select;

const WorkflowContainers = dynamic(
  () =>
    import('../../../components/Workflow/WorkflowBoard').then(
      (mod) => mod.WorkflowContainers
    ),
  {ssr: false}
);

const SingleProject = () => {
  const router = useRouter();
  const {projectId} = router.query;

  const workflowQuery = api.project.getProjectWorkflows.useQuery({
    projectId: projectId as string,
  });

  const convertWorkFlowsToRecord = () => {
    const records: Record<UniqueIdentifier, Issue[]> = {};
    workflowQuery.data?.workflows.forEach((workflow) => {
      records[workflow.id] = workflow.issue;
    });
    return records;
  };

  const items = convertWorkFlowsToRecord();

  const projectQuery = api.project.getProjectById.useQuery({
    id: projectId as string,
  });
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
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <NoSSR>
        <div className="flex justify-between">
          <h1>{projectQuery.data?.name}</h1>
          <div className="flex items-center gap-1-2 justify-between">
            <div className="flex items-center gap-1-2">
              <Avatar.Group size={'small'}>
                <Avatar src="https://joeschmoe.io/api/v1/random" />
                <a href="https://ant.design">
                  <Avatar style={{backgroundColor: '#f56a00'}}>K</Avatar>
                </a>
                <Tooltip title="Ant User" placement="top">
                  <Avatar style={{backgroundColor: '#87d068'}}>L</Avatar>
                </Tooltip>
              </Avatar.Group>
              <Button type="dashed" size="small" onClick={showModal}>
                +
              </Button>
            </div>
          </div>
          <Modal
            title="Add People"
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
        <DndContext>
          <Suspense fallback={<div>Loading...</div>}>
            <WorkflowContainers items={items} scrollable />
          </Suspense>
        </DndContext>
    </NoSSR>
  );
};

SingleProject.getLayout = (page:React.ReactElement) => {
  return <Board>{page}</Board>;
};

export default SingleProject;

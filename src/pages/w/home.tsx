import React, { useEffect, useState } from 'react';
import type { RouterOutputs } from '../../utils/api';
import { api } from '../../utils/api';
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Avatar,
  Typography,
  Empty,
  Layout,
  Skeleton,
} from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useWorkspaceStore } from '../../store/workspace.store';

const { Meta } = Card;
const { Content } = Layout;
const { Title, Text } = Typography;
type Workspace = RouterOutputs['workspace']['getWorkspaces'][number];

const { TextArea } = Input;

interface WorkSpaceFormProps {
  name: string;
  description: string | null;
}

const WorkSpace = () => {
  const workspaceQuery = api.workspace.getWorkspaces.useQuery();

  useEffect(() => {
    if (workspaceQuery.isSuccess) {
      setWorkspaces(workspaceQuery.data);
    }
  }, [workspaceQuery.isSuccess]);

  const {setWorkspaces ,workspaces ,addWorkspace} = useWorkspaceStore();

  const { mutate: createWorkspace, isLoading: isCreatingWorkspace } =
    api.workspace.createWorkspace.useMutation({
      onSuccess: (workspace) => {
        addWorkspace(workspace);
        setOpen(false);
        form.resetFields();
      },
    });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<WorkSpaceFormProps>();

  return (
    <Layout>
      <Content className="h-full min-h-screen flex flex-col m-4">
        <Skeleton active loading={workspaceQuery.isLoading}>
          {workspaces.length === 0 ? (
            <Content className="min-h-screen flex items-center justify-center">
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 60 }}
                description={
                  <span>
                    You don&apos;t have any workspaces yet. Create one to get started.
                  </span>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Create Now
                </Button>
              </Empty>
            </Content>
          ) : (
            <>
              <div className="flex justify-between">
                <Title level={4}>Your Workspaces</Title>
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Create Workspace
                </Button>
              </div>
              <div className="grid col-auto gap-1-2 justify-center">
                {workspaces.map((workspace) => {
                  return <WorkSpaceCard key={workspace.id} {...workspace} />;
                })}
              </div>
            </>
          )}
          <Modal
            title="Let's build a Workspace"
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1000}
            footer={null}
          >
            <div className="flex">
              <div className="flex-1">
                <Text>
                  Boost your productivity by making it easier for everyone to
                  access boards in one location.
                </Text>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{ description: null }}
                  requiredMark={true}
                >
                  <Form.Item label="Workspace name" name="name" required>
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item name="description" label="Workspace Description">
                    <TextArea placeholder="Description" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      loading={isCreatingWorkspace}
                      onClick={() => {
                        createWorkspace({
                          name: form.getFieldValue('name'),
                          description: form.getFieldValue('description'),
                        });
                      }}
                    >
                      Continue
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div
                className="flex-1"
                style={{
                  backgroundImage: `url('/bg.svg')`,
                  backgroundSize: 'cover',
                }}
              >
                <Image src="/logo.svg" width={500} height={200} alt="workspace" />
              </div>
            </div>
          </Modal>
        </Skeleton>
      </Content>
    </Layout>
  );
};

const WorkSpaceCard = (workspace: Workspace) => {
  const router = useRouter();
  return (
    <Card
      size="small"
      style={{ margin: 0, cursor: 'pointer' }}
      bordered={true}
      onClick={() => {
        void router.push(`${workspace.shortName}/projects`);
      }}
    >
      <Meta
        avatar={
          <Avatar
            size="small"
            shape="square"
            style={{ backgroundColor: workspace.color }}
          >
            {workspace.name[0]}
          </Avatar>
        }
        description={
          <div>
            <Text strong>{workspace.name}</Text>
            {workspace.description ? (
              <Text ellipsis style={{ width: '100%' }}>
                {workspace.description}
              </Text>
            ) : null}
          </div>
        }
      />
    </Card>
  );
};

export default WorkSpace;

import { useRouter } from 'next/router';
import { api } from '../../../../utils/api';
import { Button, Form, Input, Radio, Typography, message } from 'antd';
import { ProjectType } from '@prisma/client';

import type { Project } from '@prisma/client';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import WorkSpaceLayout from '../../../../layout/WorkspaceLayout';

import { LeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CreateProject = () => {
    const router = useRouter();
    const { workspaceId } = router.query;

    const { mutate: createProject } = api.project.createProject.useMutation({
        onSuccess: (data) => {
            void router.push(`/w/${workspaceId}/projects/${data.id}`);
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const handleSubmit = (values: Project) => {
        console.log(
            'creating project with values',
            values.name,
            values.projectType
        );

        createProject({ name: values.name, projectType: values.projectType, workspaceShortName: workspaceId as string });
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<Project>) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="mt-1">
            <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    required
                    rules={[{ required: true, message: 'Project Name is required!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="projectType"
                    required
                    rules={[{ required: true, message: 'Project Type is required!' }]}
                >
                    <Radio.Group>
                        {(Object.keys(ProjectType) as Array<keyof typeof ProjectType>).map(
                            (key, idx) => {
                                const value = ProjectType[key];
                                return (
                                    <Radio key={idx} value={value}>
                                        {value}
                                    </Radio>
                                );
                            }
                        )}
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="middle">
                        Create Project
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

CreateProject.getLayout = (page: React.ReactElement) => {
    const router = useRouter();
    return <WorkSpaceLayout>
        <div className='flex items-center gap-1'>
            <Button type="dashed" icon={<LeftOutlined />} onClick={() => router.back()}></Button>
            <Title level={5} className='m-0'>Create Project</Title >
        </div>
        {page}
    </WorkSpaceLayout>;
};

export default CreateProject;

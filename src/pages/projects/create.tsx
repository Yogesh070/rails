import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import { Button, Form, Input, Radio } from 'antd';
import { ProjectType } from '@prisma/client';

import type { Project } from '@prisma/client';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';

const CreateProject = () => {
    const router = useRouter();

    const { mutate: createProject } = api.project.createProject.useMutation({
        onSuccess: (data) => {
            void router.push(`/projects/${data?.id}`);
        },
        onError: () => {
            console.log('error');
        },
    });

    const handleSubmit = (values: Project) => {
        console.log(
            'creating project with values',
            values.name,
            values.projectType
        );

        createProject({ name: values.name, projectType: values.projectType });
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<Project>) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="m-4">
            <h1>Create Project</h1>

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

export default CreateProject;

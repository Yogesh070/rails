import { useRouter } from 'next/router';
import { api } from '../../../../utils/api';
import { Button, Col, Form, Input, Radio, Row, Typography, message } from 'antd';
import { ProjectType } from '@prisma/client';

import type { Project } from '@prisma/client';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import WorkSpaceLayout from '../../../../layout/WorkspaceLayout';

import { LeftOutlined } from '@ant-design/icons';
import Image from 'next/image';

interface ProjectTemplate {
    name: string,
    type: ProjectType,
    description: string
}

const { Title, Text, Paragraph } = Typography;

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

    const projectTemplates: ProjectTemplate[] = [
        {
            name: "Kanban",
            type: ProjectType.KANBAN,
            description: "Kanban all about helping teams visualize their work, limit work currently in progress, and maximize efficiency. "
        },
        {
            name: "Scrum",
            type: ProjectType.SCRUM,
            description: "Sprint toward your project goals with a board, backlog, and timeline.It includes boards, backlogs, roadmaps, reports — and more!"
        }
    ];

    return (
        <>
            <Text >Explore what's possible when you collaborate with your team. Edit project details anytime in project settings.</Text>
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
                        label="Project Type"
                        name="projectType"
                        required
                        rules={[{ required: true, message: 'Project Type is required!' }]}
                    >
                        <Radio.Group className='flex flex-wrap gap-1-2 items-center'>
                            {projectTemplates.map(
                                (template, idx) => {
                                    return (
                                        <Radio key={idx} value={template.type} className='h-100'>
                                            <TemplateCard {...template} />
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
        </>
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


const TemplateCard = (props: ProjectTemplate) => {
    return (
        <div className='flex gap-1-2 flex-1 w-100 h-100  max-w-sm shadow-md'>
            <Col span={6}> <Image src={`/project_type/${props.name}.webp`} alt='type' className='p-3' fill style={{ objectFit: "contain" }} /></Col>
            <Col span={18} className='px-2 py-2'>
                <Text strong>{props.name}</Text>
                <div>
                    <Paragraph className='text-small line-h-normal m-0'>{props.description}</Paragraph>
                </div>
            </Col>
        </div>
    )
}
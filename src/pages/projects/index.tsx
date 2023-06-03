import { useRouter } from 'next/router';
import { RouterOutputs, api } from '../../utils/api';
import { Button, Table, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import Image from 'next/image';

type ProjectWithLead = RouterOutputs['project']['getUserProjects'][number];

const Projects = () => {

    const router = useRouter();
    const projectsQuery = api.project.getUserProjects.useQuery();

    const columns: ColumnsType<ProjectWithLead> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Project Type',
            dataIndex: 'projectType',
        },
        {
            title: 'Project Lead',
            dataIndex: ["projectLead", "image"],
            render: (text, record) => {
                return <Avatar size="small"> {record.projectLead?.image ? <Image src={text || '/logo.svg'} width={24} height={24} alt={text} style={{ objectFit: "contain" }} /> : text}</Avatar>
            }
        },
        {
            title: 'Project Status',
            dataIndex: 'status',
        },
    ];

    const data: ProjectWithLead[] = projectsQuery.data || [];

    return (
        <div className='p-4 m-4'>
            <div className="flex justify-between">
                <h2>All Projects</h2>
                <Button type="primary" size='middle' onClick={() => {
                    void router.push(`/projects/create`);
                }}>Create Project</Button>
            </div>
            <Table columns={columns} dataSource={data} size="small" loading={projectsQuery.isLoading}
                className='mt-4'
                onRow={(record) => ({
                    onClick: () => {
                        void router.push(`/projects/${record.id}`);
                    },
                })}
                rowKey="id"
            />
        </div>
    )
}

export default Projects
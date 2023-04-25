import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Project } from '@prisma/client';

const Projects = () => {

    const router = useRouter();
    const projectsQuery = api.project.getUserProjects.useQuery();

    const columns: ColumnsType<Project> = [
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
            dataIndex: ["projectLead", "name"],
        },
        {
            title: 'Project Status',
            dataIndex: 'status',
        },
    ];

    const data: Project[] = projectsQuery.data || [];

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
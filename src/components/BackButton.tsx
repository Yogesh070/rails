import { Button, Typography } from 'antd'
import router from 'next/router'

import { LeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
    title: string
}

const BackButton = (props:Props) => {
    return (
        <div className='flex items-center gap-1'>
            <Button type="dashed" icon={<LeftOutlined />} onClick={() => router.back()}></Button>
            <Title level={5} className='m-0'>{props.title}</Title >
        </div>
    )
}

export default BackButton
import {LoadingOutlined} from '@ant-design/icons';
import type {SpinProps} from 'antd';
import {Spin} from 'antd';

const loadingIcon = <LoadingOutlined style={{fontSize: 24}} spin />;

const CircularProgressIndicator = (props: SpinProps) => {
  return <Spin indicator={loadingIcon} {...props} />;
};

export default CircularProgressIndicator;

import {ExclamationCircleIcon} from '@heroicons/react/24/outline';
import {theme} from 'antd';
import React from 'react';

const {useToken} = theme;

const ErrorIcon: React.FC = () => {
  const {token: themeToken} = useToken();
  return (
    <ExclamationCircleIcon
      height={24}
      width={24}
      color={themeToken.colorPrimary}
    />
  );
};

export default ErrorIcon;

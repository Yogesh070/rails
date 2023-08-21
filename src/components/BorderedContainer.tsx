import {theme} from 'antd';
import React from 'react';

const {useToken} = theme;

const BorderedContainer = (props:React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {token} = useToken();
  return <div {...props} style={{backgroundColor: token.colorBgElevated,borderRadius:token.borderRadius,border:`1px solid ${token.colorBorder}`}} >{props.children}</div>;
};

export default BorderedContainer;

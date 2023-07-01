import {Button, Card, Dropdown} from 'antd';
import type {ReactNode} from 'react';

import {CloseOutlined} from '@ant-design/icons';

interface Props {
  children: ReactNode;
  renderer: ReactNode;
  title: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const ButtonMenu = (props: Props) => {
  return (
    <Dropdown
      open={props.open}
      onOpenChange={(open) => {
        if (props.onOpenChange) {
          props.onOpenChange(open);
        }
      }}
      dropdownRender={(_) => (
        <Card
          title={props.title}
          extra={
            <Button
              type="ghost"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => {
                if (props.onOpenChange) {
                  props.onOpenChange(false);
                }
              }}
            />
          }
          size="small"
          className="shadow-md"
        >
          {props.children}
        </Card>
      )}
      trigger={['click']}
    >
      {props.renderer}
    </Dropdown>
  );
};

export default ButtonMenu;

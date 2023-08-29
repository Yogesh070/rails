import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Select, Space, Button, Tag} from 'antd';

import {useProjectStore} from '../../../store/project.store';
import CustomDivider from '../../CustomDivider/CustomDivider';
import {useRouter} from 'next/router';

import type {CustomTagProps} from 'rc-select/lib/BaseSelect';
import type { SelectProps} from 'antd';

const {Option} = Select;

const LabelSelect = (props:SelectProps ) => {
  
  const router = useRouter();

  const project = useProjectStore((state) => state.project);

  const tagRender = (props: CustomTagProps) => {
    const {label, value, closable, onClose} = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{marginRight: 3}}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Select
      {...props}
      mode="multiple"
      tagRender={tagRender}
      style={{width: '100%'}}
      optionLabelProp="label"
      dropdownRender={(menu) => (
        <>
          {menu}
          <CustomDivider className="my-2" />
          <div className="flex">
            <Button
              style={{width: '100%'}}
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push(
                  `/w/${router.query.workspaceId}/projects/${router.query.projectId}/settings/labels`
                )
              }
            >
              Add Label
            </Button>
          </div>
        </>
      )}
    >
      {project!.labels.map((item) => (
        <Option value={item.color} label={item.title} key={item.id}>
          <Space>
            <div
              style={{
                height: '12px',
                width: '12px',
                backgroundColor: item.color,
                borderRadius: '20px',
              }}
            />
            {item.title}
          </Space>
          <p className="font-small">{item.description}</p>
        </Option>
      ))}
    </Select>
  );
};

export default LabelSelect;

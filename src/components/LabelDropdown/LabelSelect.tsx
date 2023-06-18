import React from 'react';

import {useState, useRef} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import { Input, Select, Space, Button} from 'antd';

import type {InputRef} from 'antd';
import {api} from '../../utils/api';
import {useProjectStore} from '../../store/project.store';
import type {Label} from '@prisma/client';
import CustomDivider from '../CustomDivider/CustomDivider';

const LabelSelect = () => {
  const [items, setItems] = useState<Label[]>([]);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    createLable({
      title: name,
      color: '#a123ff',
      projectId: project?.id as string,
    });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const project = useProjectStore((state) => state.project);

  const labelQuery = api.project.getProjectLabels.useQuery({
    projectId: project?.id as string,
  });

  const {mutate: createLable, isLoading: isCreating} =
    api.project.createProjectLabels.useMutation({
      onSuccess: (data) => {
        setItems([...items, data]);
        setName('');
      },
    });

    React.useEffect(()=>{
      if(labelQuery.isSuccess){
        setItems(labelQuery.data)
      }
    },[labelQuery.isSuccess])

  return (
    <Select
      mode="multiple"
      bordered={false}
      style={{width: 300}}
      defaultActiveFirstOption={true}
      placeholder="None"
      dropdownRender={(menu) => (
        <>
          {menu}
          <CustomDivider className='mb-2'/>
          <Space style={{padding: '0 8px 4px'}}>
            <Input
              placeholder="Label"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined rev={undefined} />}
              onClick={addItem}
              loading={isCreating}
            >
              Add
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({label: item.title, value: item.title}))}
    />
  );
};

export default LabelSelect;

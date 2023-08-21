import {Tag, Form, Input, Button, ColorPicker} from 'antd';
import type {FormInstance} from 'antd/es/form';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import {useProjectStore} from '../../store/project.store';
import {api} from '../../utils/api';

import {ReloadOutlined} from '@ant-design/icons';
import type {Label} from '@prisma/client';

type FieldType = {
  title: string;
  description?: string;
  color: string;
};

interface Props {
  form: FormInstance;
  forEdit?: boolean;
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  layout?: 'vertical' | 'horizontal';
  onFinish?: (value: Label) => void;
}

const LabelForm = (props: Props) => {
  const router = useRouter();
  const {projectId} = router.query;
  const {addLabel, editLabel} = useProjectStore();

  useEffect(() => {
    if (props.forEdit) {
      props.form.setFieldsValue({
        title: props.form.getFieldValue('title'),
        description: props.form.getFieldValue('description'),
        color: props.form.getFieldValue('color'),
      });
    }
  }, [props.forEdit, props.form]);

  const {mutate: createLabel, isLoading: isCreating} =
    api.project.createProjectLabels.useMutation({
      onSuccess: (data) => {
        addLabel(data);
        props.form.resetFields();
        props.onFinish?.(data);
      },
    });

  const {mutate: editLabelAPI, isLoading: isEditing} =
    api.project.updateProjectLabel.useMutation({
      onSuccess: (data) => {
        editLabel(data);
        props.onFinish?.(data);
      },
    });

  const handleSubmit = (values: FieldType) => {
    if (props.forEdit) {
      editLabelAPI({
        id: props.form.getFieldValue('id'),
        title: values.title,
        color: values.color,
        description: values.description,
      });
      return;
    }
    createLabel({
      projectId: projectId as string,
      title: values.title,
      color: values.color,
      description: values.description,
    });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; ++i) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const color: string = Form.useWatch('color', props.form);
  const titleValue: string = Form.useWatch('name', props.form);
  const getNameValue = () => {
    if (titleValue === undefined || titleValue.length === 0)
      return 'Label preview';

    return titleValue ?? 'Label preview';
  };

  return (
    <>
      <Tag color={color} className="mb-3">
        {getNameValue()}
      </Tag>
      <Form
        form={props.form}
        name={props.forEdit ? 'edit-label' : 'create-label'}
        layout="vertical"
        autoComplete="off"
        className={`flex ${
          props.layout === 'vertical' ? 'flex-col' : 'items-end gap-1'
        } jusify-between `}
        onFinish={handleSubmit}
        initialValues={{
          color: getRandomColor(),
        }}
      >
        <Form.Item<FieldType>
          name="title"
          label="Title"
          rules={[{required: true}, {min: 4}]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name="description" label="Description">
          <Input />
        </Form.Item>
        <div className="flex gap-1-2 items-center">
          <Form.Item<FieldType> name="color" label="Color" required>
            <ColorPicker
              showText
              disabledAlpha
              value={color}
              onChange={(_, hex) => {
                props.form.setFieldsValue({color: hex});
              }}
              presets={[
                {
                  label: 'Recommended',
                  colors: [
                    '#F5222D',
                    '#FA8C16',
                    '#FADB14',
                    '#8BBB11',
                    '#52C41A',
                    '#13A8A8',
                    '#1677FF',
                    '#2F54EB',
                    '#722ED1',
                    '#EB2F96',
                  ],
                },
              ]}
            />
          </Form.Item>
          <Button
            type="primary"
            style={{backgroundColor: color}}
            icon={<ReloadOutlined color={color} />}
            onClick={() => {
              props.form.setFieldsValue({color: getRandomColor()});
            }}
          />
        </div>

        <Form.Item className="flex-1 flex justify-end">
          <div className="flex gap-1-2">
            <Button type="default" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={props.form.submit}
              loading={isCreating || isEditing}
            >
              {props.forEdit ? 'Edit Label' : ' Create Label'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default LabelForm;

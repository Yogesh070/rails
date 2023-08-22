import React from 'react';

import {Button, Form, Modal, Table, Tag, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';

import type {RouterOutputs} from '../../../../../../../utils/api';
import {api} from '../../../../../../../utils/api';
import SettingsLayout from '../../../../../../../layout/SettingsLayout';

import {useProjectStore} from '../../../../../../../store/project.store';
import LabelForm from '../../../../../../../components/Label/LabelForm';
import BorderedContainer from '../../../../../../../components/BorderedContainer';

const {Title, Text} = Typography;

type Label = RouterOutputs['project']['getProjectLabels'][number];

const Labels = () => {
  const [form] = Form.useForm();

  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEdit = (val: Label) => {
    setIsFormVisible(false);
    setIsModalOpen(true);
    form.setFieldsValue({
      id: val.id,
      title: val.title,
      description: val.description,
      color: val.color,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {deleteLabel, project} = useProjectStore();

  const {mutate: deleteLabelAPI, isLoading: isDeleting} =
    api.project.deleteProjectLabel.useMutation({
      onSuccess: (label) => {
        deleteLabel(label.id);
      },
    });

  const columns: ColumnsType<Label> = [
    {
      title: 'Label',
      render: (_, record) => {
        return <Tag color={record.color}>{record.title}</Tag>;
      },
    },
    {
      title: 'Description',
      render: (_, record) => {
        return <Text>{record.description}</Text>;
      },
    },
    {
      title: 'Open Issue Count',
      render: (_, record) => {
        return <Text>{record.issues.length ?? '-'}</Text>;
      },
    },
    {
      title: 'Action',
      render: (_, record) => {
        return (
          <div className="flex gap-1-2">
            <Button onClick={() => handleEdit(record)} size="small">
              Edit
            </Button>
            <Button
              onClick={() =>
                Modal.error({
                  title: 'Delete Label?',
                  content: `Are you sure you want to delete ${record.title}?`,
                  okText: isDeleting ? 'Deleting...' : 'Delete',
                  cancelText: 'Cancel',
                  maskClosable: true,
                  okType: 'danger',
                  onOk() {
                    deleteLabelAPI({id: record.id});
                  },
                  closable: true,
                })
              }
              danger
              size="small"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <Title level={4}>Labels</Title>
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            form.resetFields();
          }}
        >
          New Label
        </Button>
      </div>
      {isFormVisible && (
        <BorderedContainer className="p-2">
          <LabelForm
            form={form}
            onCancel={() => {
              setIsFormVisible(!isFormVisible);
            }}
          />
        </BorderedContainer>
      )}
      <Table
        columns={columns}
        dataSource={project!.labels}
        size="small"
        rowKey="id"
      />
      <Modal
        title="Edit Label"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <LabelForm
          form={form}
          forEdit
          layout="vertical"
          onCancel={handleCancel}
          onFinish={() => {
            handleCancel();
          }}
        />
      </Modal>
    </>
  );
};

export default Labels;

Labels.getLayout = function getLayout(page: React.ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

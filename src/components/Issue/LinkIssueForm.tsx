import React from 'react';
import {api} from '../../utils/api';
import {Form, Select, Space, Button} from 'antd';
import type {Issue} from '@prisma/client';
import CircularProgressIndicator from '../CircularProgressIndicator/CircularProgressIndicator';

interface LinkIssueFormProps {
  issue: Issue;
  hideForm: () => void;
}

type FormInitialValues = {
  type: string;
  issue?: string;
};

const LinkIssueForm = (props: LinkIssueFormProps) => {
  const options = [
    {value: 'isBlockedBy', label: 'is blocked by'},
    {value: 'blocks', label: 'blocks'},
    {value: 'duplicates', label: 'duplicates'},
    {value: 'relatesTo', label: 'relates to'},
  ];

  const linkIssusQuery = api.issue.getUnlinkedIssues.useQuery({
    issueId: props.issue.id,
  });

  const issueOptionList =
    linkIssusQuery.data?.map((issue) => {
      return {
        value: issue.id,
        label: issue.title,
      };
    });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const [submittable, setSubmittable] = React.useState(false);

  const [form] = Form.useForm();
  const values: FormInitialValues = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({validateOnly: true}).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  const {mutate: linkAnotherIssueToIssue, isLoading} =
    api.issue.linkAnotherIssueToIssue.useMutation({
      onSuccess: (data) => {
        props.hideForm();
        form.resetFields();
      }
    });

  if (linkIssusQuery.isLoading) {
    return <CircularProgressIndicator />;
  }
  return (
    <Form
      form={form}
      name="linkIssue"
      layout="horizontal"
      autoComplete="off"
      initialValues={{
        type: 'isBlockedBy',
      }}
    >
      <div className="flex gap-1-2">
        <Form.Item name="type" rules={[{required: true}]}>
          <Select onChange={handleChange} options={options} />
        </Form.Item>
        <Form.Item name="issue" rules={[{required: true}]} className="flex-1">
          <Select
            showSearch
            placeholder="Search for issues"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={issueOptionList}
          />
        </Form.Item>
      </div>
      <div className="flex justify-end">
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!submittable}
            loading={isLoading}
            onClick={() => {
              linkAnotherIssueToIssue({
                issueId: props.issue.id,
                linkedIssueId: values.issue!,
              });
            }}
          >
            Link
          </Button>
          <Button htmlType="reset" onClick={props.hideForm}>
            Cancel
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default LinkIssueForm;

import React from 'react';
import type {ModalProps} from 'antd';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import type {RouterOutputs} from '../../utils/api';
import {api} from '../../utils/api';
import {useProjectStore} from '../../store/project.store';
import {useSprintStore} from '../../store/sprint.store';

const {Text} = Typography;
const {Option} = Select;

type Sprint = RouterOutputs['sprint']['getSprints'][0];

interface Props {
  buttonTitle?: string;
  initialValues: FormValues;
  disabled?: boolean;
  issueCount?: number;
  render?: React.ReactNode;
  sprint: Sprint;
}

interface FormValues {
  name: string;
  duration: string;
  startDateTime?: dayjs.Dayjs;
  endDateTime?: dayjs.Dayjs;
  goal?: string;
}

const SprintModal = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const {startSprint: updateSprintInStore} = useSprintStore();

  const defaultDurationOptions = [
    {value: 1, label: '1 week'},
    {value: 2, label: '2 weeks'},
    {value: 3, label: '3 weeks'},
    {value: 4, label: '4 weeks'},
    {value: 'custom', label: 'Custom'},
  ];

  const [form] = Form.useForm<FormValues>();

  const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const duration = Form.useWatch('duration', form);

  const {mutate: startSprint, isLoading: isStartingSprint} =
    api.sprint.startSprint.useMutation({
      onSuccess(sprint) {
        message.success('Sprint started successfully');
        setIsModalOpen(false);
        updateSprintInStore(sprint);
      },
    });

  const checkValidEndDate = (_: any, value: Date) => {
    if (value > form.getFieldValue('startDateTime')) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('end date must be after start date!'));
  };

  if (props.sprint.hasStarted) {
    return (
      <>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {props.buttonTitle}
        </Button>
        <CompleteSprintModal
          modalProps={{
            title: 'Complete Sprint',
            open: isModalOpen,
            onCancel: () => {
              setIsModalOpen(false);
            },
          }}
          sprint={props.sprint}
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setIsModalOpen(true);
        }}
        disabled={props.disabled}
      >
        {props.buttonTitle}
      </Button>
      <Modal
        title="Start Sprint"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        bodyStyle={{paddingTop: 8, paddingBottom: 8}}
        onOk={() => {
          form.submit();
        }}
        okText="Start"
        confirmLoading={isStartingSprint}
      >
        <Text>{props.issueCount} issues will be included in this sprint.</Text>
        <Form
          layout="vertical"
          initialValues={{
            name: props.initialValues.name,
            startDateTime: dayjs(currentDate, 'YYYY-MM-DD HH:mm:ss'),
            duration: 2,
            endDateTime: dayjs(currentDate, 'YYYY-MM-DD HH:mm:ss').add(
              2,
              'week'
            ),
          }}
          onFinish={(values) => {
            if (props.sprint.hasStarted) {
              message.error('Sprint has already started');
            }
            startSprint({
              id: props.sprint.id,
              title: values.name,
              startDate: values.startDateTime?.toDate()!,
              endDate: values.endDateTime?.toDate()!,
              goal: values.goal ?? null,
            });
          }}
          form={form}
        >
          <Form.Item
            className="mb-2"
            name="name"
            label="Name"
            rules={[{required: true, message: 'Please input your name'}]}
          >
            <Input placeholder="Sprint name" />
          </Form.Item>
          <Form.Item className="mb-2" name="duration" label="Duration">
            <Select
              placeholder="Duration"
              onChange={(value) => {
                if (value !== 'custom') {
                  form.setFieldsValue({
                    endDateTime: dayjs(
                      form.getFieldValue('startDateTime'),
                      'YYYY-MM-DD HH:mm:ss'
                    ).add(value, 'week'),
                  });
                }
              }}
            >
              {defaultDurationOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="mb-2"
            name="startDateTime"
            label="Start Date"
            rules={[{required: true, message: 'Please select a starting date'}]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm A"
              onChange={(value) => {
                if (duration !== 'custom') {
                  form.setFieldsValue({
                    endDateTime: value?.add(parseInt(duration), 'week'),
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            className="mb-2"
            name="endDateTime"
            label="End Date"
            rules={[
              {required: true, message: 'Please select a ending date'},
              {validator: checkValidEndDate},
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm A"
              disabled={duration !== 'custom'}
            />
          </Form.Item>
          <Form.Item className="mb-2" label="Sprint goal" name="goal">
            <Input.TextArea allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default SprintModal;

interface CompletedSprintModalProps {
  modalProps: ModalProps;
  sprint: Sprint;
}

const CompleteSprintModal = (props: CompletedSprintModalProps) => {
  const {mutate: completeSprint, isLoading: compeletingSprint} =
    api.sprint.completeSprint.useMutation();

  //TODO: CONNECT TO NEW SPRINT VIA API

  // const {mutate: moveIssueToAnotherSprint, isLoading: isMoving} =
  //   api.sprint.moveMultipleIssueToSprint.useMutation();

  const [form] = Form.useForm<FormValues>();

  const {workflows} = useProjectStore();
  const {sprints} = useSprintStore();

  const getIssueStatusCount = () => {
    const issueStatus = {
      completedIssueCount: 0,
      openIssueCount: 0,
    };

    props.sprint.issues.forEach((issue) => {
      if (
        issue.workFlowId ===
        workflows.find((workflow) => workflow.title === 'Done')?.id
      ) {
        issueStatus.completedIssueCount += 1;
      } else {
        issueStatus.openIssueCount += 1;
      }
    });
    return issueStatus;
  };

  const {completedIssueCount, openIssueCount} = getIssueStatusCount();

  return (
    <Modal
      {...props.modalProps}
      onOk={() => {
        completeSprint({
          id: props.sprint.id,
        });
      }}
      confirmLoading={compeletingSprint}
    >
      <Text>
        This sprint contains:
        <ul>
          <li>{completedIssueCount} completed issues</li>
          <li>{openIssueCount} open issues</li>
        </ul>
      </Text>
      {openIssueCount === 0 ? (
        <Text>Thats all of them - well done!</Text>
      ) : (
        <Form
          layout="vertical"
          initialValues={{}}
          onFinish={(values) => {
            if (props.sprint.hasStarted) {
              message.error('Sprint has already started');
            }
          }}
          form={form}
        >
          <Form.Item className="mb-2" name="sprint" label="Move open issues to">
            <Select placeholder="sprint">
              {sprints
                .filter((s) => !s.hasStarted)
                .map((sprint) => (
                  <Option key={sprint.id} value={sprint.id}>
                    {sprint.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

import type {InputRef} from 'antd';
import {
  Button,
  Layout,
  Drawer,
  theme,
  Select,
  Typography,
  Input,
  DatePicker,
  Checkbox,
  Tag,
} from 'antd';

import type {Issue, User} from '@prisma/client';
import CommentSection from '../Comment/Comment';
import {api} from '../../utils/api';
import Checklist from '../Checklist/Checklist';
import {useProjectStore} from '../../store/project.store';
import {useCallback, useState} from 'react';
import LabelSelect from '../Label/LabelDropdown/LabelSelect';
import dayjs from 'dayjs';

import React from 'react';
import ButtonMenu from '../ButtonMenu/ButtonMenu';

import {
  CheckSquareOutlined,
  CheckCircleOutlined,
  ApartmentOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import LinkedIssueList from '../Issue/LinkIssueList';
import LinkIssueForm from '../Issue/LinkIssueForm';
import type { IssueWithCount } from '../../pages/w/[workspaceId]/projects/[projectId]';
import Attachment from '../Attachment';
import AttachmentList from '../Attachment/AttachmentList';
interface DetailsModalProps {
  open: boolean;
  item: Issue;
  onCancel: () => void;
}

const {Sider, Content} = Layout;
const {Title, Paragraph, Text} = Typography;
const {TextArea} = Input;

const ItemDetailsModal: React.FC<DetailsModalProps> = (
  props: DetailsModalProps
) => {
  const {
    token: {colorBgElevated},
  } = theme.useToken();

  const {mutate: createCheckList, isLoading: isCreatingChecklist} =
    api.issue.createChecklist.useMutation({
      onSuccess: () => {
        checkListQuery.refetch();
      },
    });

  const checkListQuery = api.issue.getChecklistsInIssue.useQuery({
    issueId: props.item.id,
  },);

  const issueQuery = api.issue.getIssueById.useQuery({
    id: props.item.id,
  });

  const getUserOptions = (users: User[]) => {
    const options = users.map((member) => {
      return {
        value: member.id,
        label: member.name,
      };
    });
    return options;
  };
  const projectMembers = useProjectStore((state) => state.project?.members);
  const userOptions = getUserOptions(projectMembers ?? []);

  const {mutate: updateIssueTitle} = api.issue.updateIssueTitle.useMutation({
    onSuccess: (issue) => {
      updateIssue(props.item.workFlowId,props.item.id,issue);
    }
  });
  const {mutate: updateDescription} =
    api.issue.updateIssueDescription.useMutation({
      onSuccess: (issue) => {
        updateIssue(props.item.workFlowId,props.item.id,issue);
      }
    });

  const [issueTitle, setIssueTitle] = useState(props.item.title);
  const [issueDescription, setIssueDescription] = useState(
    props.item.description
  );

  const [selectedDueDate, setSelectedDueDate] = useState(
    props.item.dueDate ? dayjs(props.item.dueDate) : null
  );

  const inputRef = React.useRef<InputRef>(null);

  const [checkListTitle, setCheckListTitle] = useState('');

  const [checkListOpen, setChecklistOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {mutate: setDueDate, isLoading: isSettingDueDate} =
    api.issue.setDueDate.useMutation({
      onSuccess: (issue) => {
        setIsDatePickerOpen(false);
        updateIssue(props.item.workFlowId,props.item.id,issue);
      },
    });

  const {mutate: removeDueDate} = api.issue.removeDueDate.useMutation({
    onSuccess: () => {
      setSelectedDueDate(null);
      setIsDatePickerOpen(false);
      updateIssue(props.item.workFlowId,props.item.id,issue);
    },
  });

  const handleCheckListAdd = () => {
    if (checkListTitle.length > 0) {
      createCheckList({
        issueId: props.item.id,
        title: checkListTitle,
      });
      setChecklistOpen(false);
      setCheckListTitle('CheckList');
    } else {
      inputRef.current?.focus();
    }
  };

  //TODO: HANDLE DUE DATE CHECKBOX INTEGRATION
  const [isDueDateChecked, setIsDueDateChecked] = useState(false);

  //TODO:&& HANDLE OVERDUE STATE ON UI

  const updateIssue = useProjectStore((state) => state.updateIssue);

  const {mutate: addFlag, isLoading: addingFlag} =
    api.issue.addFlag.useMutation({
      onSuccess(issue) {
        updateIssue(props.item.workFlowId,props.item.id,issue);
    },
    });

  const {mutate: removeFlag, isLoading: removingFlag} =
    api.issue.removeFlag.useMutation({
      onSuccess(issue) {
          updateIssue(props.item.workFlowId,props.item.id,issue);
      },
    });

  const [isLinkedIssueFormVisible, setIsLinkedIssueFormVisible] = useState(false);

  const workflows= useProjectStore((state) => state.workflows);

  const getIssueById=useCallback( (issueId: string):IssueWithCount=> {
    let issue:IssueWithCount = {} as IssueWithCount;
    workflows.forEach((workflow) => {
      workflow.issues.forEach((issueItem) => {
        if(issueItem.id === issueId) {
          issue = issueItem;
        }
      })
    })
    return issue;
  }
  , [workflows]);

  const issue = getIssueById(props.item.id);


  //LABLE FUNCTIONALITY

  const {updateIssueLabels} = useProjectStore((state) => state);
  const {mutate:addLabelToIssue,isLoading:isAddingLabelToIssue} = api.issue.addLabelToIssue.useMutation({
    onSuccess: (data) => {
      updateIssueLabels(props.item.workFlowId,props.item.id,data.labels);
    },
  });

  const {mutate:removeLabelFromIssue,isLoading:isRemovingLabelFromIssue} = api.issue.removeLabelFromIssue.useMutation({
    onSuccess: (data) => {
      updateIssueLabels(props.item.workFlowId,props.item.id,data.labels);
    },
  });

  return (
    <>
      <Drawer
        placement="right"
        title={
          <Paragraph
            editable={{
              onChange: (val) => {
                setIssueTitle(val);
                updateIssueTitle({issueId: props.item.id, title: val});
              },
              triggerType: ['text'],
            }}
            className="m-0"
          >
            {issue.title}
          </Paragraph>
        }
        width={800}
        open={props.open}
        onClose={props.onCancel}
        bodyStyle={{paddingTop: 8}}
      >
        <Layout
          className="gap-1"
          hasSider
          style={{backgroundColor: colorBgElevated}}
        >
          <Content style={{backgroundColor: colorBgElevated}}>
             {issue.flagged ? (
             <Tag icon={<FlagOutlined />} color="warning">
                  Flagged
                </Tag>
               ) : (
                <></>
              )} 
            <div className="flex flex-col gap-1-2">
              <div>
                <Text>Labels</Text>
                <LabelSelect
                loading={isAddingLabelToIssue || isRemovingLabelFromIssue}
                defaultValue={issue.labels.map((label) => label.id)}
                onSelect={(val)=>{
                  addLabelToIssue({
                    issueId: props.item.id,
                    labelId: val
                  })
                }}
                onDeselect={(val)=>{
                  removeLabelFromIssue({
                    issueId: props.item.id,
                    labelId: val
                  })
                }
                }
                />
              </div>
              {issue.dueDate!=null ? (
                <>
                  <Text strong>Due Date</Text>
                  <div className="flex gap-1-2">
                    <Checkbox
                      checked={isDueDateChecked}
                      onChange={(e) => {
                        setIsDueDateChecked(e.target.checked);
                      }}
                    />
                    <Button onClick={() => setIsDatePickerOpen(true)}>
                      {dayjs(issue.dueDate).format('MMM DD')} at{' '}
                      {dayjs(issue.dueDate).format('hh:mm A')}
                      {isDueDateChecked ? (
                        <Tag
                          icon={<CheckCircleOutlined />}
                          color={'success'}
                          className="ml-2"
                        >
                          Complete
                        </Tag>
                      ) : (
                        <></>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
              <Text strong>Description</Text>
              <TextArea
                rows={4}
                placeholder="Add a more detailed description..."
                defaultValue={issueDescription ?? ''}
                onChange={(e) => {
                  setIssueDescription(e.target.value);
                }}
                onBlur={() => {
                  updateDescription({
                    issueId: props.item.id,
                    description: issueDescription,
                  });
                }}
              />
              {
                !issueQuery.isLoading && issueQuery.data!.linkedIssues.length > 0 &&
                <LinkedIssueList issue={issueQuery.data!} isFormVisible={isLinkedIssueFormVisible} hideForm={()=>setIsLinkedIssueFormVisible(false)} showForm={()=>setIsLinkedIssueFormVisible(true)}/>
              }
               {isLinkedIssueFormVisible && (
                <LinkIssueForm
                  issue={props.item}
                  hideForm={() => setIsLinkedIssueFormVisible(false)}
                />
              )}
              <AttachmentList issueId={props.item.id} workflowId={props.item.workFlowId}/>

              {checkListQuery.data?.map((checklist, idx) => {
                return <Checklist key={idx} {...checklist} />;
              })}
              <Text strong>Activity</Text>
              <CommentSection
                issueId={props.item.id}
                members={projectMembers}
                isLoadingMembers={false}
              />
            </div>
          </Content>
          <Sider style={{backgroundColor: colorBgElevated}}>
            <div className="flex flex-col gap-1-2">
              <Title level={5}>Details</Title>
              <div className="flex flex-wrap items-center  justify-between">
                <Text>Assignee</Text>
                <Select
                  bordered={false}
                  defaultActiveFirstOption={true}
                  defaultValue={userOptions[0]}
                  showSearch
                  placeholder="Unassignee"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: undefined,
                      label: 'Unassigned',
                    },
                    ...userOptions,
                  ]}
                />
              </div>
              <Text strong>Actions</Text>
              <DatePicker
                format={'MMM DD, YYYY hh:mm A'}
                open={isDatePickerOpen}
                placeholder="Dates"
                value={selectedDueDate}
                onChange={(date) => {
                  setSelectedDueDate(date);
                }}
                onOpenChange={(open) => {
                  setIsDatePickerOpen(open);
                }}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: dayjs('00:00:00', 'HH:mm'),
                }}
                onOk={(date) => {
                  setDueDate({
                    issueId: props.item.id,
                    dueDate: date.toDate(),
                  });
                }}
                renderExtraFooter={() => {
                  if (issue.dueDate)
                    return (
                      <div className="flex flex-end p-2 w-full">
                        <Button
                          type="default"
                          onClick={() => {
                            removeDueDate({
                              issueId: props.item.id,
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                }}
              />
              <ButtonMenu
                open={checkListOpen}
                title="Add Checklist"
                renderer={
                  <Button icon={<CheckSquareOutlined />}>Checklist</Button>
                }
                onOpenChange={(open) => {
                  setChecklistOpen(open);
                  if (open) {
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }
                }}
              >
                <Text>Title</Text>
                <Input
                  placeholder="Title"
                  defaultValue="Checklist"
                  className="mb-2 mt-1"
                  autoFocus={true}
                  ref={inputRef}
                  value={checkListTitle}
                  onChange={(e) => {
                    setCheckListTitle(e.target.value);
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => handleCheckListAdd()}
                  loading={isCreatingChecklist}
                >
                  Add
                </Button>
              </ButtonMenu>
              <Attachment workflowId={props.item.workFlowId} issueId={props.item.id}/>
              <Button
                type="default"
                icon={<ApartmentOutlined />}
                onClick={() => setIsLinkedIssueFormVisible(true)}
              >
                Link Child Issue
              </Button>
              <Button
                type="default"
                icon={<FlagOutlined />}
                onClick={() => {
                  if (issue.flagged) {
                    removeFlag({
                      issueId: props.item.id,
                    });
                  } else {
                    addFlag({
                      issueId: props.item.id,
                    });
                  }
                }}
                loading={addingFlag || removingFlag}
              >
                {issue.flagged ? 'Remove Flag' : 'Add Flag'}
              </Button>
            </div>
          </Sider>
        </Layout>
      </Drawer>
    </>
  );
};

export default ItemDetailsModal;

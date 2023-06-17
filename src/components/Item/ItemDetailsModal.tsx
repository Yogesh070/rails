import {Avatar, Button, Layout, Drawer, theme, Select, Typography, Input} from 'antd';
import {PaperClipIcon} from '@heroicons/react/24/outline';

import type {Issue, User} from '@prisma/client';
import CommentSection from '../Comment/Comment';
import {api} from '../../utils/api';
import Checklist from '../Checklist/Checklist';
import {useProjectStore} from '../../store/project.store';
import {useState} from 'react';

interface DetailsModalProps {
  open: boolean;
  title: string;
  item: Issue;
  onCancel: () => void;
}

const {Sider, Content} = Layout;
const { Title ,Paragraph ,Text} = Typography;
const {TextArea} = Input;

const ItemDetailsModal: React.FC<DetailsModalProps> = (
  props: DetailsModalProps
) => {
  const {
    token: {colorBgElevated},
  } = theme.useToken();

  const {mutate: createCheckList, isLoading: isCreatingChecklist} =
    api.issue.createChecklist.useMutation();

  const checkListQuery = api.issue.getChecklistsInIssue.useQuery({
    issueId: props.item.id,
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
  const projectMembers = useProjectStore((state) => state.members);
  const userOptions = getUserOptions(useProjectStore((state) => state.members));

  const {mutate: updateIssueTitle} = api.issue.updateIssueTitle.useMutation();
  const {mutate: updateDescription} = api.issue.updateIssueDescription.useMutation();

  const [issueTitle, setIssueTitle] = useState(props.item.title);
  const [issueDescription, setIssueDescription] = useState(props.item.description);

  return (
    <>
      <Drawer
        placement="right"
        title={
          <Paragraph
            editable={{
              onChange: (val) => {
                setIssueTitle(val);
                updateIssueTitle({issueId: props.item.id, title: issueTitle});
              },
              triggerType: ['text'],
            }}
            className="m-0"
          >
            {issueTitle}
          </Paragraph>
        }
        width={900}
        open={props.open}
        onClose={props.onCancel}
      >
        <Layout
          className="gap-1"
          hasSider
          style={{backgroundColor: colorBgElevated}}
        >
          <Content style={{backgroundColor: colorBgElevated}}>
            <div className="flex flex-col gap-1-2">
              <div className="flex gap-1-2">
                <div>
                  <Text> Assignees </Text>
                  <Avatar.Group size={'small'} className="my-2" maxCount={3}>
                    {projectMembers.map((member, idx) => {
                      return (
                        <Avatar key={idx} src={member.image}>
                          {member.name}
                        </Avatar>
                      );
                    })}
                  </Avatar.Group>
                </div>
                <div>
                  <Text>Labels</Text>
                  <Button type="primary" size="small" className="mr-1">
                    Primary
                  </Button>
                </div>
              </div>
              <div className="flex gap-1-2-3">
                <Button
                  type="primary"
                  icon={<PaperClipIcon height={14} />}
                  onClick={() => {}}
                  className="flex items-center gap-1-2-3"
                  size="small"
                >
                  Attach
                </Button>
                <Button
                  type="primary"
                  icon={<PaperClipIcon height={14} />}
                  onClick={() => {}}
                  className="flex items-center gap-1-2-3"
                  size="small"
                >
                  Link Child Issue
                </Button>
              </div>
              <TextArea 
                rows={4} 
                placeholder='Add a more detailed description...'
                defaultValue={issueDescription ?? ''}
                onChange={(e)=>{
                  setIssueDescription(e.target.value);
                }}
                onBlur={()=>{
                  updateDescription({issueId: props.item.id, description: issueDescription});
                }}
              />
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
          <Sider style={{backgroundColor: colorBgElevated}} width={250}>
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
                      value: null,
                      label: 'Unassigned',
                    },
                    ...userOptions,
                  ]}
                />
              </div>
            </div>
          </Sider>
        </Layout>
      </Drawer>
    </>
  );
};

export default ItemDetailsModal;
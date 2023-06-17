import {Avatar, Button, Input, Layout, Drawer, theme, Select} from 'antd';
import {PaperClipIcon} from '@heroicons/react/24/outline';

import type {Issue, User} from '@prisma/client';
import CommentSection from '../Comment/Comment';
import {api} from '../../utils/api';
import Checklist from '../Checklist/Checklist';
import {useProjectStore} from '../../store/project.store';

interface DetailsModalProps {
  open: boolean;
  title: string;
  item: Issue;
  onCancel: () => void;
}

const {Sider, Content} = Layout;
const ItemDetailsModal: React.FC<DetailsModalProps> = (
  props: DetailsModalProps
) => {
  const {TextArea} = Input;

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
  return (
    <>
      <Drawer
        placement="right"
        title={<Input bordered={false} defaultValue={props.title} />}
        width={800}
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
                  <p>Members</p>
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
                  <p>Labels</p>
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
              <TextArea rows={4} />
              {checkListQuery.data?.map((checklist, idx) => {
                return <Checklist key={idx} {...checklist} />;
              })}
              <h4>Activity</h4>
              <CommentSection
                issueId={props.item.id}
                members={projectMembers}
                isLoadingMembers={false}
              />
            </div>
          </Content>
          <Sider style={{backgroundColor: colorBgElevated}}>
            <div className="flex flex-col gap-1-2">
              <h5>Details</h5>
              <div className="flex flex-wrap items-center  justify-between">
                <p>Assignee</p>
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
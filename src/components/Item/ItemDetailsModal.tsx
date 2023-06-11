import Comment from '../Comment/Comment';
import { Avatar, Button, Input, Layout, Drawer, theme } from 'antd';
import { PaperClipIcon } from '@heroicons/react/24/outline';

import type { Issue } from '@prisma/client';

interface DetailsModalProps {
  open: boolean;
  title: string;
  item: Issue;
  onCancel: () => void;
}

const { Sider, Content } = Layout;
const ItemDetailsModal: React.FC<DetailsModalProps> = (
  props: DetailsModalProps
) => {
  const { TextArea } = Input;
  const OPTIONS = ['Members', 'CheckList', 'Dates', 'Attachment'];

  const { token: { colorBgElevated } } = theme.useToken();
  return (
    <>
      <Drawer placement="right" title={<Input bordered={false} defaultValue={props.title} />} width={800} open={props.open} onClose={props.onCancel}>
        <Layout className="gap-1" hasSider style={{ backgroundColor: colorBgElevated }} >
          <Content style={{ backgroundColor: colorBgElevated }} >
            <div className="flex flex-col gap-1-2">
              <div className="flex gap-1-2-3">
                <div>
                  <p>Members</p>
                  <Avatar.Group size={'small'} className="my-2">
                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
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
                  onClick={() => { }}
                  className="flex items-center gap-1-2-3"
                  size="small"
                >
                  Attach
                </Button>
                <Button
                  type="primary"
                  icon={<PaperClipIcon height={14} />}
                  onClick={() => { }}
                  className="flex items-center gap-1-2-3"
                  size="small"
                >
                  Link Child Issue
                </Button>
              </div>
              <TextArea rows={4} />
              <h4>Activity</h4>
              <Comment />
            </div>
          </Content>
          <Sider style={{ backgroundColor: colorBgElevated }}>
            <div className="flex flex-col gap-1-2">
              <h5>Add to Card</h5>
              {OPTIONS.map((item, idx) => {
                return <Button key={idx}>{item}</Button>;
              })}
            </div>
          </Sider>
        </Layout>
      </Drawer>
    </>
  );
};

export default ItemDetailsModal;
import React from 'react';
import {useProjectStore} from '../../store/project.store';
import {Button, Card, Image, Typography} from 'antd';
import Meta from 'antd/es/card/Meta';
import dayjs from 'dayjs';
import {api} from '../../utils/api';

interface AttachmentListProps {
  issueId: string;
  workflowId: string;
}

const {Text} = Typography;

const AttachmentList = (props: AttachmentListProps) => {
  const workflows = useProjectStore((state) => state.workflows);
  const removeAttachment = useProjectStore(
    (state) => state.deleteAttachmentFromIssue
  );

  const {mutate: deleteAttachement, isLoading: isDeleting} =
    api.issue.removeAttachmentFromIssue.useMutation({
      onSuccess: (data) => {
        removeAttachment(props.workflowId, props.issueId, data.id);
      },
    });

  return (
    <div>
      <Text strong>Attachments</Text>
      {workflows
        .find((w) => w.id === props.workflowId)
        ?.issues.find((i) => i.id === props.issueId)
        ?.attachments.map((attachment, index) => {
          return (
            <Card key={index} bodyStyle={{padding: '8px'}}>
              <Meta
                avatar={
                  <Image
                    src={attachment.url}
                    alt={attachment.displayName ?? attachment.id}
                    width={60}
                  />
                }
                title={<Text strong>{attachment.displayName}</Text>}
                description={
                  <div className="flex gap-1-2-3 items-center">
                    <Text className="font-small">
                      Added on {dayjs(attachment.createdAt).format('MMM DD')}
                    </Text>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        deleteAttachement({attachmentId: attachment.id});
                      }}
                      loading={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                }
              />
            </Card>
          );
        })}
    </div>
  );
};

export default AttachmentList;

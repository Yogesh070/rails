import React from 'react';
import {  Avatar, Button, List, message } from 'antd';
import { RouterOutputs, api } from '../../utils/api';

import type { User } from '@prisma/client';
import CommentEditor from './CommentEditor';

type CommentWithUser = RouterOutputs['issue']['getCommentsByIssueId'][number];

type CommmentSectionProps = {
  issueId: string;
  members: User[] | undefined;
  isLoadingMembers: boolean;
};

const CommentSection = (props: CommmentSectionProps) => {
  const [comments, setComments] = React.useState<CommentWithUser[]>([]);

  const commentsQuery = api.issue.getCommentsByIssueId.useQuery({
    issueId: props.issueId,
  });
  const { mutate: addComment, isLoading: isCommenting } =
    api.issue.addComment.useMutation({
      onSuccess: (data) => {
        setComments([...comments, data]);
      },
      onError: () => {
        message.error('Error posting comment');
      },
    });

  React.useEffect(() => {
    setComments(commentsQuery.data ?? []);
  }, []);

  const memberOptions = props.members?.map((member) => ({
    value: member.name,
    label: member.name,
    id: member.id,
  }));

  return (
    <>
      <CommentEditor
        onComment={(value: string) => {
          addComment({
            issueId: props.issueId,
            comment: {
              content: value,
            },
          });
        }}
        mentionOptions={memberOptions ?? []}
        isCommenting={isCommenting}
        isLoadingMembers={props.isLoadingMembers}
      />
      <>
        {
          <CommentList
            comments={comments}
            onDelete={(val) => {
              setComments(comments.filter((comment) => comment.id !== val));
            }}
          />
        }
      </>
    </>
  );
};

export default CommentSection;

const CommentList = ({
  comments,
  onDelete,
}: {
  comments: CommentWithUser[];
  onDelete: (commentId: string) => void;
}) => {
  return (
    <List
      size="small"
      dataSource={comments}
      className="mt-2"
      grid={{ column: 1 }}
      renderItem={(comment) => (
        <Comment
          comment={comment}
          onDelete={(val) => {
            onDelete(val);
          }}
        />
      )}
    />
  );
};

const Comment = ({
  comment,
  onDelete,
}: {
  comment: CommentWithUser;
  onDelete: (commentId: string) => void;
}) => {
  const { mutate: deleteComment, isLoading: isDeleting } =
    api.issue.deleteComment.useMutation({
      onSuccess: (data) => {
        onDelete(data.id);
      },
      onError: () => {
        message.error('Error deleting comment');
      },
    });
  //TODO: Add edit comment and reply to comment functionality
  return (
    <List.Item
      className="px-0"
      actions={[
        // <Button type="ghost" size="small">
        //   Edit
        // </Button>,
        <Button
          type="link"
          size="small"
          danger
          loading={isDeleting}
          className="px-0"
          onClick={() => {
            deleteComment({ commentId: comment.id });
          }}
        >
          Delete
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={comment.createdBy.image} alt={comment.createdBy.id} />}
        title={comment.createdBy.name}
        description={comment.message}
      />
    </List.Item>
  );
};

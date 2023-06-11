import {Mentions, Avatar, Button, Form} from 'antd';
import {useSession} from 'next-auth/react';
import React from 'react';

import type {MentionsOptionProps} from 'antd/es/mentions';
import type {FormInstance} from 'antd/lib/form/Form';

interface CommentProps {
  mentionOptions: MentionsOptionProps[];
  onComment: (value: string) => void;
  isCommenting: boolean;
  isLoadingMembers: boolean;
}

const CommentEditor = (props: CommentProps) => {
  const session = useSession();
  const onSelect = (option: MentionsOptionProps) => {
    //TODO: Add mention to comment. Send notification to mentioned user
  };

  const handleCommentSubmit = (values: any) => {
    formRef.current?.resetFields();
    props.onComment(values.comment);
    setIsOnFocus(false);
  };

  const formRef = React.useRef<FormInstance>(null);
  const [isOnFocus, setIsOnFocus] = React.useState(false);

  return (
    <>
      <Form
        name="comment-editor"
        ref={formRef}
        onFinish={handleCommentSubmit}
        autoComplete="off"
      >
        <div className="flex gap-1-2">
          <Avatar src={session.data?.user?.image}>
            {session.data?.user?.name}
          </Avatar>
          <div className="grid gap-1-2 flex-1">
            <Form.Item noStyle name="comment">
              <Mentions
                style={{width: '100%'}}
                onSelect={onSelect}
                autoSize
                onFocus={() => {
                  setIsOnFocus(true);
                }}
                options={props.mentionOptions}
                loading={props.isLoadingMembers}
              />
            </Form.Item>
            <Form.Item hidden={!isOnFocus} noStyle>
              <div className="flex gap-1-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  loading={props.isCommenting}
                >
                  Comment
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    setIsOnFocus(false);
                  }}
                  size="middle"
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default CommentEditor;

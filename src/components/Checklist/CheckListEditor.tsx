import React from 'react';
import {ClockIcon, UserPlusIcon} from '@heroicons/react/24/outline';
import {Button, Input, Form} from 'antd';

import {api} from '../../utils/api';

import type {FormInstance} from 'antd/lib/form/Form';
import type {CheckListItem} from '@prisma/client';
import type {TextAreaRef} from 'antd/es/input/TextArea';

const CheckListEditor = (props: {
  id: string;
  setChecklistItems: React.Dispatch<React.SetStateAction<CheckListItem[]>>;
  checklistItems: CheckListItem[];
}) => {
  const {TextArea} = Input;
  const {mutate: createCheckListItem, isLoading: isCreatingChecklistItem} =
    api.issue.createChecklistItem.useMutation();

  const [isOnFocus, setIsOnFocus] = React.useState(false);

  const formRef = React.useRef<FormInstance>(null);

  const inputRef = React.useRef<TextAreaRef>(null);

  const handleChecklistItemSubmit = (values: any) => {
    createCheckListItem(
      {
        checklistId: props.id,
        title: values.title,
      },
      {
        onSuccess: (data) => {
          props.setChecklistItems([...props.checklistItems, data]);
          formRef.current?.resetFields();
        },
      }
    );
  };

  return (
    <>
      <Form
        name={`checklist-item-editor-${props.id}`}
        ref={formRef}
        onFinish={handleChecklistItemSubmit}
        autoComplete="off"
      >
        <Form.Item hidden={!isOnFocus} noStyle name="title">
          <div>
            <TextArea
              placeholder="Add an item"
              autoSize
              onFocus={() => {
                setIsOnFocus(true);
              }}
              onBlur={(e) => {
                setIsOnFocus(false);
              }}
              autoFocus={isOnFocus}
              ref={inputRef}
              onPressEnter={(e) => {
                formRef.current?.submit();
              }}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="flex gap-1-2-3">
                {/* //TODO: Button to add checklist item */}
                {/* <Button
                    loading={isCreatingChecklistItem}
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      inputRef.current?.focus();
                      formRef.current?.submit();
                    }
                    }
                  >
                    Add
                  </Button> */}
                <Button
                  type="ghost"
                  onClick={() => {
                    setIsOnFocus(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="flex gap-1-2">
                <Button
                  type="ghost"
                  className="flex items-center p-0"
                  icon={<UserPlusIcon width={16} />}
                >
                  Assign
                </Button>
                <Button
                  type="ghost"
                  className="flex items-center p-0"
                  icon={<ClockIcon width={16} />}
                >
                  Due Date
                </Button>
              </div>
            </div>
          </div>
        </Form.Item>
      </Form>
      {!isOnFocus ? (
        <Button
          onClick={() => {
            setIsOnFocus(true);
            inputRef.current?.focus();
          }}
        >
          Add an Item
        </Button>
      ) : null}
    </>
  );
};

export default CheckListEditor;

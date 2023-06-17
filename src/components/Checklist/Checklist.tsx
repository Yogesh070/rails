import React from 'react';
import {CheckCircleIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Button, Progress, Popconfirm, Checkbox, Skeleton} from 'antd';

import {QuestionCircleOutlined} from '@ant-design/icons';
import CheckListEditor from './CheckListEditor';
import {api} from '../../utils/api';

import type {CheckList, CheckListItem} from '@prisma/client';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';

const Checklist = (props: CheckList) => {
  const checkListItemsQuery = api.issue.getChecklistItemsInChecklist.useQuery({
    checklistId: props.id,
  });

  const [checklistItems, setChecklistItems] = React.useState<CheckListItem[]>(
    []
  );

  const {mutate: deleteCheckListItem, isLoading: isDeleting} =
    api.issue.deleteChecklistItem.useMutation();

  const {mutate: deleteCheckList, isLoading: isDeletingCheckList} =
    api.issue.deleteChecklist.useMutation();

  const [percent, setPercent] = React.useState<number>(0);

  const calculateChecklistProgress = React.useCallback(() => {
    const total = checklistItems.length;
    const checked = checklistItems.filter((item) => item.checked).length;
    return parseInt(((checked / total) * 100).toFixed(0));
  }, [checklistItems]);

  const {mutate: updateChecklistItem} =
    api.issue.changeChecklistItemStatus.useMutation({
      onSuccess: (data) => {
        setChecklistItems(
          checklistItems.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            return item;
          })
        );
      },
    });

  const handleCheckboxChange = (e: CheckboxChangeEvent, id: string) => {
    const {checked} = e.target;
    updateChecklistItem({
      checklistItemId: id,
      checked,
    });
  };

  React.useEffect(() => {
    if (checkListItemsQuery.isSuccess) {
      setChecklistItems(checkListItemsQuery.data);
    }
  }, [checkListItemsQuery.isSuccess]);

  React.useEffect(() => {
    setPercent(calculateChecklistProgress());
  }, [checklistItems]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1-2 items-center">
          <CheckCircleIcon height={24} />
          <p>{props.title}</p>
        </div>
        <div className="flex gap-1-2">
          {/* //TODO : HANDLE HIDE TOGGLE CHECKED ITEM */}
          {/* <Button type="default">Hide Checked Item</Button> */}
          <Popconfirm
            title="Delete Checklist?"
            description="Deleting a checklist is permanent and there is no way to get it back."
            icon={<QuestionCircleOutlined rev={undefined} />}
            onConfirm={() => {
              deleteCheckList({checklistId: props.id});
            }}
          >
            <Button type="default" loading={isDeletingCheckList}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
      <Progress percent={percent} />
      <Skeleton active loading={checkListItemsQuery.isLoading}>
        {checklistItems.map((item, idx) => {
          return (
            <div className="flex justify-between items-center" key={idx}>
              <Checkbox
                className="flex-1"
                defaultChecked={item.checked}
                onChange={(e) => {
                  handleCheckboxChange(e, item.id);
                }}
              >
                <p className={item.checked ? 'line-through': '' } >{item.title}</p>
              </Checkbox>
              <Button
                type="ghost"
                className="p-0 flex items-center justify-center"
                icon={<TrashIcon height={16} />}
                loading={isDeleting}
                onClick={() => {
                  deleteCheckListItem(
                    {checklistItemId: item.id},
                    {
                      onSuccess: () => {
                        setChecklistItems(
                          checklistItems.filter(
                            (checklistItem) => checklistItem.id !== item.id
                          )
                        );
                      },
                    }
                  );
                }}
              />
            </div>
          );
        })}
      </Skeleton>
      <CheckListEditor
        id={props.id}
        setChecklistItems={setChecklistItems}
        checklistItems={checklistItems}
      />
    </div>
  );
};

export default Checklist;

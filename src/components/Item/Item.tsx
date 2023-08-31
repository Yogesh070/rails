import React, {Suspense, useCallback, useEffect, useState} from 'react';
import classNames from 'classnames';

import {Button, Typography, theme} from 'antd';

import {
  EllipsisHorizontalIcon,
  ChatBubbleBottomCenterIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import styles from './Item.module.scss';
import dynamic from 'next/dynamic';
import Handle from '../Handle/Handle';
import Remove from '../Remove/Remove';
import LabelIndicator from '../Label/LabelIndicator/LabelIndicator';
import type { IssueWithCount } from '../../pages/w/[workspaceId]/projects/[projectId]';
import { useProjectStore } from '../../store/project.store';

const ItemDetailsModal = dynamic(() => import('./ItemDetailsModal'), {
  ssr: true,
});

const {useToken} = theme;
const {Text} = Typography;

export interface Props {
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  item: IssueWithCount;
}

const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        item,
        ...props
      },
      ref
    ) => {
      const [isModalOpen, setIsModalOpen] = useState(false);

      const showModal = () => {
        setIsModalOpen(true);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      const {token} = useToken();

      const workflows= useProjectStore((state) => state.workflows);

      const getIssueById=useCallback((issueId: string):IssueWithCount=> {
        let issue:IssueWithCount = item;
        workflows.forEach((workflow) => {
          workflow.issue.forEach((issueItem) => {
            if(issueItem.id === issueId) {
              issue = issueItem;
            }
          })
        })
        return issue;
      }
      ,[item, workflows]);
    
      const issue = getIssueById(item.id);

      return (
        <li
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(', '),
              '--translate-x': transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              '--translate-y': transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              '--scale-x': transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              '--scale-y': transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              '--index': index,
              backgroundColor: item.flagged ? token.colorWarningHover : token.colorBgElevated,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled
            )}
            style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
            onClick={showModal}
          >
            <>
              <div className="flex justify-between">
                <div className="flex items-center gap-1-2-3">
                  {issue.labels.map((label) => (
                    <LabelIndicator key={label.id} color={label.color} />
                  ))}
                </div>
                <span className={styles.Actions}>
                  {onRemove ? (
                    <Remove className={styles.Remove} onClick={onRemove} />
                  ) : null}
                  {handle ? <Handle {...handleProps} {...listeners} /> : null}
                </span>
                <Button
                  icon={<EllipsisHorizontalIcon height={20} color="#8C8C8C" />}
                  size="small"
                  type="text"
                />
              </div>
              <Text className="m-0"> {issue.title}</Text>
              <div className="flex flex-end gap-1-2-3 py-1">
                {
                  item._count.comments > 0 ? (
                    <div className="flex items-center font-small gap-1-2-3">
                        <ChatBubbleBottomCenterIcon height={14} color="#8C8C8C" />
                        <Text className='font-small'>{item._count.comments}</Text>
                    </div>
                  ) : null
                }
                {
                  item._count.linkedIssues > 0 ? (
                    <PaperClipIcon height={14} color="#8C8C8C" />
                  ) : null
                }
              </div>
            </>
          </div>
          <Suspense fallback={<Text>Loading...</Text>}>
            <ItemDetailsModal
              open={isModalOpen}
              item={item}
              onCancel={handleCancel}
            />
          </Suspense>
        </li>
      );
    }
  )
);

export default Item;

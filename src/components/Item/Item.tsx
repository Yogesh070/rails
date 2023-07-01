import React, { Suspense, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Button } from 'antd';
import CustomDivider from '../CustomDivider/CustomDivider';
import LabelIndicator from '../LabelIndicator/LabelIndicator';

import {
  EllipsisHorizontalIcon,
  ChatBubbleBottomCenterIcon,
  FlagIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

import type { Issue } from '@prisma/client';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import styles from './Item.module.scss';
import dynamic from 'next/dynamic';

const ItemDetailsModal = dynamic(() => import('./ItemDetailsModal'), {
  ssr: true,
});

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
  item: Issue;
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
            onClick={() => {
              //TODO: Open Modal to show details
              showModal();
            }}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-1-2-3">
                <LabelIndicator color="red" />
                <LabelIndicator color="green" />
                <LabelIndicator color="purple" />
              </div>

              <Button
                icon={<EllipsisHorizontalIcon height={20} color="#8C8C8C" />}
                size="small"
                type="text"
              />
            </div>
            <p className="m-0"> {item.title}</p>
            <CustomDivider className="mb-1" />
            <div className="flex flex-end gap-1-2-3 py-1">
              <PaperClipIcon height={14} color="#8C8C8C" />
              <FlagIcon height={14} color="#8C8C8C" />
              <ChatBubbleBottomCenterIcon height={14} color="#8C8C8C" />
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
              <ItemDetailsModal
              open={isModalOpen}
              title={item.title}
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

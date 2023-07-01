import React, {forwardRef, useRef, useState} from 'react';
import classNames from 'classnames';

import styles from './Container.module.scss';
import Handle from '../Handle/Handle';
import Remove from '../Remove/Remove';
import {Button, Input, Modal} from 'antd';
import type {InputRef} from 'antd/lib/input/Input';
import {PlusIcon} from '@heroicons/react/24/outline';
import {api} from '../../utils/api';
import {useSession} from 'next-auth/react';
import { useProjectStore } from '../../store/project.store';

export interface ContainerProps {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
  hasAdd?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      hasAdd = true,
      ...props
    }: ContainerProps,
    ref
  ){
    const inputRef = useRef<InputRef>(null);
    const addIssueToWorkflow = useProjectStore((state) => state.addIssueToWorkflow);
    const {mutate: createIssue} = api.issue.createIssue.useMutation({
      onSuccess: (data) => {
        addIssueToWorkflow(data.workFlowId, data);
      },
      onError: () => {
        console.log('error');
      },
    });
    const handleAdd = () => {
      setModal1Open(true);
      // TODO: When modal is open,set focus on input
      // inputRef.current!.focus();
    };

    const session = useSession();

    const handleEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
      createIssue({
        title: e.currentTarget.value,
        workflowId: label!,
        createdById: session.data?.user?.id!,
        index: 0,
      });
      setModal1Open(false);
    };

    const [modal1Open, setModal1Open] = useState(false);
    return (
      <div
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
            height: '100%',
          } as React.CSSProperties
        }
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className={styles.Header}>
            <p>{label}</p>
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul className="flex-1">{children}</ul>}
        {hasAdd && (
          <>
          {/* TODO: Reduce the padding in the modal body and optimize the modal */}
            <Modal
              bodyStyle={{width: '100%', padding: 0,bottom:'10px',position:'absolute'}}
              open={modal1Open}
              onCancel={() => setModal1Open(false)}
              footer={null}
              mask={false}
              closable={false}
              width={'100%'}
              wrapClassName="bottom-0 p-0"
              style={{verticalAlign: 'bottom', padding: 0}}
              centered
            >
              <Input
                className="w-full"
                placeholder="Start typing to create a new issue"
                ref={inputRef}
                allowClear
                onPressEnter={handleEnterClick}
                autoFocus={modal1Open}
              />
            </Modal>
            <Button
              type="dashed"
              className="w-100 flex justify-center items-center gap-1-2 m-0"
              icon={<PlusIcon height={16} width={16} />}
              onClick={handleAdd}
            >
              Add New
            </Button>
          </>
        )}
      </div>
    );
  }
);

export default Container;

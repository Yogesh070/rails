import React, { forwardRef } from 'react';
import classNames from 'classnames';

import styles from './Container.module.scss';
import Handle from '../Handle/Handle';
import Remove from '../Remove/Remove';
import { Button, theme, Typography } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { api } from '../../utils/api';
import { useProjectStore } from '../../store/project.store';
import IssueModal from '../Issue/IssueModal';

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

const { useToken } = theme;
const { Text } = Typography;

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
  ) {
    const addIssueToWorkflow = useProjectStore((state) => state.addIssueToWorkflow);
    const { mutate: createIssue } = api.issue.createIssue.useMutation({
      onSuccess: (data) => {
        addIssueToWorkflow(data.workFlowId, data);
      },
      onError: () => {
        console.log('error');
      },
    });

    const handleEnterClick = (value: string) => {
      createIssue({
        title: value,
        workflowId: label!,
        index: 0,
      });
    };

    const { token } = useToken();

    return (
      <div
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
            height: '100%',
            backgroundColor: token.colorBorderSecondary,
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
          <div className={styles.Header} style={{ backgroundColor: token.colorBgElevated }}>
            <Text>{label}</Text>
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul className="flex-1">{children}</ul>}
        {hasAdd && (
          <IssueModal onEnterPress={handleEnterClick} renderer={
            <Button
              type="dashed"
              className="w-100 flex justify-center items-center gap-1-2 m-0"
              icon={<PlusIcon height={16} width={16} />}

            >
              Add New
            </Button>
          } />
        )}
      </div>
    );
  }
);

export default Container;

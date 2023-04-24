import React, { forwardRef } from 'react';
import classNames from 'classnames';

import styles from './Container.module.scss';
import Handle from '../Handle/Handle';
import Remove from '../Remove/Remove';

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
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
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
      ...props
    }: ContainerProps,
    ref
  ) => {
    return (
      <div>

        <div
          {...props}
          ref={ref}
          style={
            {
              ...style,
              '--columns': columns,
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
          {placeholder ? children : <ul>{children}</ul>}
        </div>
      </div>
    );
  }
);

export default Container;

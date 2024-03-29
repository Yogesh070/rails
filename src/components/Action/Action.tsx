import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import classNames from 'classnames';

import styles from './Action.module.scss';

export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
}

const Action = forwardRef<HTMLButtonElement, ActionProps>(
  function Action({ active, className, cursor, style, ...props }, ref){
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(styles.Action, className)}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    );
  }
);

export default Action;
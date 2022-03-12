import * as React from 'react';

import classnames from 'utils/classnames';

type Props = {
  children: string;
  className?: string;
  type?: 'button' | 'submit';
};

export function Button({ children, className, type = 'button' }: Props) {
  return (
    <button
      className={classnames('btn btn-primary w-100', className)}
      type={type}
    >
      {children}
    </button>
  );
}

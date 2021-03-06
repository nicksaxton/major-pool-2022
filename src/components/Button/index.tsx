import * as React from 'react';

import classnames from 'utils/classnames';

type Props = {
  children: string;
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'lg';
  type?: 'button' | 'submit';
  variant?: 'danger' | 'outline-danger' | 'primary';
};

export function Button({
  children,
  className,
  onClick,
  size,
  type = 'button',
  variant = 'primary',
}: Props) {
  return (
    <button
      className={classnames(
        `btn btn-${variant} d-block`,
        { [`btn-${size ?? ''}`]: !!size },
        className
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

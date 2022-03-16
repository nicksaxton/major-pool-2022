import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

export function UnauthenticatedLayout({ children }: Props) {
  return (
    <div className="flex-grow-1 d-flex align-items-center">
      <div className="row flex-grow-1 justify-content-center">
        <div className="col-lg-4">{children}</div>
      </div>
    </div>
  );
}

import * as React from 'react';
import { Field, FieldProps } from 'formik';

import classnames from 'utils/classnames';

type Props = {
  label?: string;
  name: string;
  type?: 'email' | 'password' | 'text';
};

export function TextField({ label, name, type = 'text' }: Props) {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className="mb-3">
          {label && (
            <label className="form-label" htmlFor={name}>
              {label}
            </label>
          )}
          <input
            {...field}
            className={classnames('form-control', {
              'is-invalid': Boolean(meta.touched && meta.error),
            })}
            id={name}
            type={type}
          />
          <div className="invalid-feedback">{meta.error}</div>
        </div>
      )}
    </Field>
  );
}

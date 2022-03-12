import * as React from 'react';
import { Field, FieldProps } from 'formik';

type Props = {
  label?: string;
  name: string;
  type?: 'email' | 'password' | 'text';
};

export function TextField({ label, name, type = 'text' }: Props) {
  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <div className="mb-3">
          {label && (
            <label className="form-label" htmlFor={name}>
              {label}
            </label>
          )}
          <input {...field} className="form-control" id={name} type={type} />
        </div>
      )}
    </Field>
  );
}

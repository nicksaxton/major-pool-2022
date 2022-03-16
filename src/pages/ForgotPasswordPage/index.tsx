import * as React from 'react';
import { Formik } from 'formik';

import { Button } from 'components/Button';
import { TextField } from 'components/TextField';
import { UnauthenticatedLayout } from 'layouts/UnauthenticatedLayout';

import * as helpers from './helpers';

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = React.useState('');

  return (
    <UnauthenticatedLayout>
      <div className="mb-4 text-center">
        <h1>Forgot your password?</h1>
        <p className="text-muted">
          Enter your email address to get sent a password reset link.
        </p>
      </div>

      {successMessage ? (
        <div className="alert alert-success">{successMessage}</div>
      ) : (
        <Formik
          initialValues={{ email: '' }}
          onSubmit={({ email }) => {
            void helpers.onSubmit(email, () =>
              setSuccessMessage(
                'Please check your inbox for an email containing a link to reset your password.'
              )
            );
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField label="Email" name="email" type="email" />

              <Button className="mb-4" type="submit">
                Submit
              </Button>
            </form>
          )}
        </Formik>
      )}
    </UnauthenticatedLayout>
  );
}

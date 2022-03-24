import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import { Button } from 'components/Button';
import { TextField } from 'components/TextField';
import { UnauthenticatedLayout } from 'layouts/UnauthenticatedLayout';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from 'utils/firebase';

type FormValues = {
  password: string;
  passwordConfirm: string;
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Please enter a password.')
    .min(8, 'Please enter a password that is at least 8 characters in length.'),
  passwordConfirm: yup.string().test({
    message: 'The passwords must match.',
    name: 'password-match',
    test: (value, context) => {
      return value === (context.parent as FormValues).password;
    },
  }),
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('oobCode');

  const [authenticating, setAuthenticating] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (authCode) {
      setAuthenticating(true);

      verifyPasswordResetCode(auth, authCode)
        .catch(() => {
          setErrorMessage('Invalid authentication code for password reset.');
        })
        .finally(() => {
          setAuthenticating(false);
        });
    } else {
      setErrorMessage('Invalid authentication code for password reset.');
    }
  }, [authCode]);

  if (authenticating) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return errorMessage ? (
    <div className="alert alert-danger">{errorMessage}</div>
  ) : (
    <UnauthenticatedLayout>
      <div className="mb-4 text-center">
        <h1>Reset your password</h1>
        <p className="text-muted">Choose a new password below.</p>
      </div>

      <Formik
        initialValues={{ password: '', passwordConfirm: '' }}
        onSubmit={({ password }) => {
          confirmPasswordReset(auth, authCode as string, password)
            .then(() => {
              navigate('/login', {
                replace: true,
                state: { passwordReset: true },
              });
            })
            .catch(() => setErrorMessage('Error resetting password.'));
        }}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextField label="New Password" name="password" type="password" />
            <TextField
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
            />

            <Button className="mb-4" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </UnauthenticatedLayout>
  );
}

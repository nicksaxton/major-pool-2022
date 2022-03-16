import * as React from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from 'components/Button';
import { TextField } from 'components/TextField';
import { UnauthenticatedLayout } from 'layouts/UnauthenticatedLayout';
import { useAuth } from 'contexts/auth';

import * as helpers from './helpers';

export type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter an email address.')
    .email('Please enter a valid email address.'),
  firstName: yup.string().required('Please enter your first name.'),
  lastName: yup.string().required('Please enter your last name.'),
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

export default function CreateAccountPage() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <UnauthenticatedLayout>
      <div className="mb-4 text-center">
        <h1>Create an account</h1>
      </div>

      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          passwordConfirm: '',
        }}
        onSubmit={async (values) => {
          await helpers.handleCreateAccount(
            values,
            dispatch,
            () => {
              navigate('/', { replace: true });
            },
            setErrorMessage
          );
        }}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextField label="First Name" name="firstName" />
            <TextField label="Last Name" name="lastName" />

            <TextField label="Email" name="email" type="email" />

            <TextField label="Password" name="password" type="password" />
            <TextField
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
            />

            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}

            <Button className="mb-4" type="submit">
              Create Account
            </Button>
          </form>
        )}
      </Formik>
    </UnauthenticatedLayout>
  );
}

import * as React from 'react';
import { Formik } from 'formik';
import { Link, Location, useLocation, useNavigate } from 'react-router-dom';

import { TextField } from 'components/TextField';
import { Button } from 'components/Button';
import { UnauthenticatedLayout } from 'layouts/UnauthenticatedLayout';
import { useAuth } from 'contexts/auth';

import * as helpers from './helpers';

function LoginPage() {
  const [error, setError] = React.useState('');

  const { dispatch, state } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as {
    from?: Location;
    passwordReset?: boolean;
  } | null;
  const from = locationState?.from?.pathname ?? '/';
  const passwordReset = locationState?.passwordReset;

  React.useLayoutEffect(() => {
    if (state.authenticated) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, state.authenticated]);

  return (
    <UnauthenticatedLayout>
      {error && (
        <div className="alert alert-danger" role="alert">
          <small>{error}</small>
        </div>
      )}

      {passwordReset && (
        <div className="alert alert-success">
          You've successfully reset your password.
        </div>
      )}

      <div className="mb-4 text-center">
        <h1>Login</h1>
        <p className="text-muted">
          Login to your account to create and manage entries.
        </p>
      </div>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={({ email, password }) =>
          helpers.handleSignIn(
            email,
            password,
            dispatch,
            () => navigate(from, { replace: true }),
            setError
          )
        }
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" />
            <TextField label="Password" name="password" type="password" />

            <div className="mb-3 text-end w-100">
              <Link to="/forgot-password">
                <small>Forgot password?</small>
              </Link>
            </div>

            <Button className="mb-4" type="submit">
              Login
            </Button>

            <div className="mb-3 text-end w-100">
              <small>
                {`Don't have an account? `}
                <Link to="/create-account">Create an account.</Link>
              </small>
            </div>
          </form>
        )}
      </Formik>
    </UnauthenticatedLayout>
  );
}

export default LoginPage;

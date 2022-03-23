import { useAuth } from 'contexts/auth';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const {
    state: { authenticated, verifying },
  } = useAuth();

  return (
    <div className="p-4">
      <h2 className="mb-4">Welcome to the 2022 edition of The Major Pool!</h2>

      {!verifying && authenticated ? (
        <div className="mb-4">
          <Link className="btn btn-primary" to="/create-entry">
            Create Entry
          </Link>
        </div>
      ) : (
        <div className="mb-4">
          <Link to="/login">Log in</Link> or{' '}
          <Link to="/create-account">create an account</Link> to create an
          entry.
        </div>
      )}

      <div>
        <Link to="/2021">View 2021 Results</Link>
      </div>

      <hr />

      <div>Entries will be viewable once The Masters begins on April 7.</div>
    </div>
  );
}

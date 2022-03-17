import * as React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="p-4">
      <h2 className="mb-4">Welcome to the 2022 edition of The Major Pool!</h2>
      <div className="mb-4">
        <Link className="btn btn-primary" to="/create-entry">
          Create Entry
        </Link>
      </div>
      <div>
        <Link to="/2022">View 2021 Results</Link>
      </div>
    </div>
  );
}

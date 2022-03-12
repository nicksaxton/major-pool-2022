import * as React from 'react';
import { Link } from 'react-router-dom';

import classnames from 'utils/classnames';

export function Navbar() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Major Pool 2022
        </Link>

        <button
          aria-controls="navbarSupportedContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-bs-target="#navbarSupportedContent"
          data-bs-toggle="collapse"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={classnames('collapse navbar-collapse', {
            show: expanded,
          })}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

import * as React from 'react';
import { Link } from 'react-router-dom';

import classnames from 'utils/classnames';

type Props = {
  authenticated: boolean;
  onSignOut: () => void;
};

export function Navbar({ authenticated, onSignOut }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light mb-2 border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
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
              {authenticated ? (
                <li className="nav-item">
                  <div
                    className="nav-link"
                    onClick={onSignOut}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                  >
                    Sign out
                  </div>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

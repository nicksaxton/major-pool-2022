import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { useGolfers } from 'contexts/golfers';

export default function PreviousResultsPage() {
  const golfersById = useGolfers();

  return (
    <>
      <h3 className="my-4">Major Pool 2021 Results</h3>

      <ul className="nav nav-pills">
        <li className="nav-item">
          <NavLink className="nav-link" end to="">
            Overall
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="masters">
            The Masters
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="pga">
            PGA Championship
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="us">
            U.S. Open
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="open">
            The Open Championship
          </NavLink>
        </li>
      </ul>

      <Outlet context={golfersById} />
    </>
  );
}

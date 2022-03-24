import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Golfer } from 'types';

export default function PreviousResultsPage() {
  const [loadingGolfers, setLoadingGolfers] = React.useState(true);
  const [golferMap, setGolferMap] = React.useState<Record<number, Golfer>>([]);
  React.useEffect(() => {
    fetch('https://major-pool-api.vercel.app/api/scrape-golfers')
      .then((resp) => resp.json())
      .then((data) => {
        const golfersData = data as Golfer[];
        setGolferMap(
          golfersData.reduce<Record<number, Golfer>>((map, golfer) => {
            map[golfer.id] = golfer;
            return map;
          }, {})
        );
      })
      .catch(() => console.error('Problem fetching golfers'))
      .finally(() => setLoadingGolfers(false));
  }, []);

  if (loadingGolfers) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <Outlet context={golferMap} />
    </>
  );
}

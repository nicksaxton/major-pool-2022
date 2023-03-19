import * as React from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { db } from 'utils/firebase';
import { useAuth } from 'contexts/auth';
import { Entry } from 'types';
import { MyPicks } from 'components/MyPicks';
import { useGolfers } from 'contexts/golfers';
import { useLocked } from 'hooks/useLocked';
import { Button } from 'components/Button';

export default function HomePage() {
  const {
    state: { authenticated, verifying, user },
  } = useAuth();
  const { locked } = useLocked();

  const [userEntries, setUserEntries] = React.useState<Entry[]>([]);

  const golfersById = useGolfers();

  React.useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'entries_2023'),
        where('userId', '==', user.uid)
      );

      getDocs(q)
        .then((result) => {
          if (!result.empty) {
            const entries: Entry[] = [];

            result.forEach((doc) => {
              entries.push({ ...doc.data(), id: doc.id } as Entry);
            });

            setUserEntries(entries);
          }
        })
        .catch(() => console.error('Problem getting user entries'));
    }
  }, [user]);

  if (verifying) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 py-2 container">
      {locked ? (
        <>
          <h1 className="mb-4">Leaderboard</h1>

          <ul className="nav nav-pills">
            <li className="nav-item">
              <NavLink className="nav-link" to="">
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

          <div className="mb-4">
            <Outlet context={golfersById} />
          </div>
        </>
      ) : (
        <>
          <h1>Welcome to the Major Pool 2023!</h1>
          {authenticated ? (
            <div>
              <Link to="create-entry">
                <Button>Create an entry</Button>
              </Link>
            </div>
          ) : (
            <p>
              <Link to="/login">Sign in</Link> or{' '}
              <Link to="/create-account">create an account</Link> to make your
              picks.
            </p>
          )}
          <hr />
        </>
      )}

      {authenticated && userEntries.length > 0 && (
        <>
          <h1>Picks</h1>
          <MyPicks
            entries={userEntries}
            golfersById={golfersById}
            locked={locked}
          />
        </>
      )}

      <div>
        <p>Previous year results:</p>
        <ul>
          <li>
            <Link to="/2022">2022</Link>
          </li>
          <li>
            <Link to="/2021">2021</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

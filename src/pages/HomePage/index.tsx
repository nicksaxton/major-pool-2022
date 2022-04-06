import * as React from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { Link } from 'react-router-dom';

import { db } from 'utils/firebase';
import { useAuth } from 'contexts/auth';
import { Entry, Golfer } from 'types';
import { hasMastersStarted } from 'utils/hasMastersStarted';
import { ResultsTable } from 'components/ResultsTable';
import { useGolfers } from 'hooks/useGolfers';

export default function HomePage() {
  const {
    state: { authenticated, verifying, user },
  } = useAuth();

  const [userEntries, setUserEntries] = React.useState<Entry[]>([]);

  const mastersStarted = hasMastersStarted();

  const { golfersById, loading: loadingGolfers } = useGolfers();

  React.useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'entries_2022'),
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

  if (verifying || (mastersStarted && loadingGolfers)) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Welcome to the 2022 edition of The Major Pool!</h2>

      {authenticated ? (
        mastersStarted ? null : (
          <div className="mb-4">
            <Link className="btn btn-primary" to="/create-entry">
              Create Entry
            </Link>
          </div>
        )
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

      {authenticated && !mastersStarted && (
        <>
          <h4>Your entries</h4>

          {userEntries.length === 0 ? (
            <p>
              You haven&apos;t created any entries yet. Click the button above
              to create one.
            </p>
          ) : (
            <div className="row">
              <div className="col">
                {userEntries.map((entry) => (
                  <div className="d-flex align-items-center" key={entry.name}>
                    <div>{entry.name}</div>
                    <div className="ms-auto">
                      <Link
                        className="btn btn-primary"
                        to={`/edit-entry/${entry.id}`}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr />
        </>
      )}

      {mastersStarted ? (
        <div>
          <h4>The Masters</h4>

          <ResultsTable
            entriesCollection="entries_2022"
            golfers={golfersById as Record<number, Golfer>}
            tournament="masters"
            tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19540/leaderboard"
          />
        </div>
      ) : (
        <div>Entries will be viewable once The Masters begins on April 7.</div>
      )}
    </div>
  );
}

import * as React from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { Link } from 'react-router-dom';

import { db } from 'utils/firebase';
import { useAuth } from 'contexts/auth';
import { Entry, Golfer } from 'types';
import { hasMastersStarted } from 'utils/hasMastersStarted';
import { ResultsTable } from 'components/ResultsTable';
import { useGolfers } from 'hooks/useGolfers';
import { MyPicks } from 'components/MyPicks';

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
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 p-4">
      <div className="mb-5">
        <h4>PGA Championship</h4>

        <ResultsTable
          entriesCollection="entries_2022"
          golfers={golfersById as Record<number, Golfer>}
          tournament="pga"
          tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19546/leaderboard"
        />
      </div>

      <div className="mb-5">
        <h4>The Masters</h4>

        <ResultsTable
          entriesCollection="entries_2022"
          golfers={golfersById as Record<number, Golfer>}
          tournament="masters"
          tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19540/leaderboard"
        />
      </div>

      {authenticated &&
        userEntries.length > 0 &&
        !loadingGolfers &&
        golfersById && (
          <MyPicks entries={userEntries} golfersById={golfersById} />
        )}

      <div>
        <p>Previous year results:</p>
        <ul>
          <li>
            <Link to="/2021">2021</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

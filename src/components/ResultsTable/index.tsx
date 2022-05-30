import * as React from 'react';
import { useOutletContext } from 'react-router-dom';

import { Golfer, GolferScore } from 'types';
import { useEntries } from 'hooks/useEntries';
import { useScores } from 'hooks/useScores';
import { useUsers } from 'hooks/useUsers';

import { ResultRow } from './ResultRow';

type Props = {
  entriesCollection: string;
  golfers?: Record<number, Golfer>;
  tournament: 'masters' | 'pga' | 'open' | 'us';
  tournamentScoresUrl: string;
};

export function ResultsTable({
  entriesCollection,
  golfers,
  tournament,
  tournamentScoresUrl,
}: Props) {
  const golfersById: Record<number, Golfer> = useOutletContext();

  const { entriesByUserId, loadingEntries } = useEntries(entriesCollection);
  const { cutScore, loadingScores, scoresByGolferId } =
    useScores(tournamentScoresUrl);
  const { loadingUsers, usersById } = useUsers();

  const results = React.useMemo(() => {
    return Object.values(entriesByUserId)
      .map((entry) => {
        return {
          name: entry.name,
          overallScore: entry[tournament].reduce((total, golferId) => {
            const golfer = scoresByGolferId[golferId] as
              | GolferScore
              | undefined;

            if (golfer) {
              if (golfer.status) {
                return total + cutScore + 1;
              }

              return total + golfer.overallPar;
            }

            return total + cutScore + 1;
          }, 0),
          picks: entry[tournament],
          userId: entry.userId,
        };
      })
      .sort((a, b) => a.overallScore - b.overallScore);
  }, [cutScore, entriesByUserId, scoresByGolferId, tournament]);

  if (loadingEntries || loadingScores || loadingUsers) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-grow-1"
        style={{ minHeight: '500px' }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <table className="table mt-4">
      <thead>
        <tr>
          <th className="text-center">Position</th>
          <th>Entry Name</th>
          <th className="text-center">Total Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <ResultRow
            cutScore={cutScore}
            golfersById={golfers ?? golfersById}
            index={index}
            key={result.name}
            result={result}
            scoresByGolferId={scoresByGolferId}
            tied={
              index > 0 &&
              results[index - 1].overallScore === result.overallScore
            }
            usersById={usersById}
          />
        ))}
      </tbody>
    </table>
  );
}

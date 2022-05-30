import * as React from 'react';

import { formatScore } from 'utils/formatScore';
import { GolferScore } from 'types';
import { useEntries } from 'hooks/useEntries';
import { useScores } from 'hooks/useScores';
import { useUsers } from 'hooks/useUsers';

type TournamentUrls = {
  masters: string;
  pga: string;
  open: string;
  us: string;
};

function calculateScoreForTournament(
  picks: number[],
  tournamentScoresByGolferId: Record<number, GolferScore>,
  tournamentCutScore: number
) {
  return picks.reduce((total, golferId) => {
    const golfer = tournamentScoresByGolferId[golferId] as
      | GolferScore
      | undefined;

    if (golfer) {
      if (golfer.status) {
        return total + tournamentCutScore + 1;
      }

      return total + golfer.overallPar;
    }

    return total + tournamentCutScore + 1;
  }, 0);
}

type Props = {
  entriesCollection: string;
  tournamentUrls: TournamentUrls;
};

export function OverallResultsTable({
  entriesCollection,
  tournamentUrls,
}: Props) {
  const { entriesByUserId, loadingEntries } = useEntries(entriesCollection);
  const {
    cutScore: mastersCutScore,
    loadingScores: loadingMastersScores,
    scoresByGolferId: mastersScoresByGolferId,
  } = useScores(tournamentUrls.masters);
  const {
    cutScore: pgaCutScore,
    loadingScores: loadingPgaScores,
    scoresByGolferId: pgaScoresByGolferId,
  } = useScores(tournamentUrls.pga);
  const {
    cutScore: openCutScore,
    loadingScores: loadingOpenScores,
    scoresByGolferId: openScoresByGolferId,
  } = useScores(tournamentUrls.open);
  const {
    cutScore: usCutScore,
    loadingScores: loadingUsScores,
    scoresByGolferId: usScoresByGolferId,
  } = useScores(tournamentUrls.us);
  const { loadingUsers, usersById } = useUsers();

  const results = React.useMemo(() => {
    return Object.values(entriesByUserId)
      .map((entry) => {
        const mastersScore = calculateScoreForTournament(
          entry.masters,
          mastersScoresByGolferId,
          mastersCutScore
        );
        const openScore =
          Object.keys(openScoresByGolferId).length > 0
            ? calculateScoreForTournament(
                entry.open,
                openScoresByGolferId,
                openCutScore
              )
            : 0;
        const pgaScore = calculateScoreForTournament(
          entry.pga,
          pgaScoresByGolferId,
          pgaCutScore
        );
        const usScore =
          Object.keys(usScoresByGolferId).length > 0
            ? calculateScoreForTournament(
                entry.us,
                usScoresByGolferId,
                usCutScore
              )
            : 0;

        return {
          name: entry.name,
          overallScore: mastersScore + openScore + pgaScore + usScore,
          userId: entry.userId,
        };
      })
      .sort((a, b) => a.overallScore - b.overallScore);
  }, [
    entriesByUserId,
    mastersCutScore,
    mastersScoresByGolferId,
    openCutScore,
    openScoresByGolferId,
    pgaCutScore,
    pgaScoresByGolferId,
    usCutScore,
    usScoresByGolferId,
  ]);

  if (
    loadingEntries ||
    loadingMastersScores ||
    loadingPgaScores ||
    loadingOpenScores ||
    loadingUsScores ||
    loadingUsers
  ) {
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
        {results.map((result, index) => {
          const user = usersById[result.userId];

          return (
            <tr key={result.name}>
              <td className="text-center">
                {index > 0 &&
                results[index - 1].overallScore === result.overallScore
                  ? '-'
                  : index + 1}
              </td>
              <td>
                {result.name} ({user.name})
              </td>
              <td className="text-center">
                {formatScore(result.overallScore)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

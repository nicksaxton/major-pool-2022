import { collection, getDocs } from 'firebase/firestore/lite';
import * as React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Golfer, GolferScore } from 'types';
import { db } from 'utils/firebase';
import { ResultRow } from './ResultRow';

type Entry = {
  name: string;
  userId: string;
  masters: number[];
  pga: number[];
  open: number[];
  us: number[];
};

type ScoresResponse = {
  result: {
    golfers: GolferScore[];
  };
};

type Props = {
  entriesCollection: string;
  tournament: 'masters' | 'pga' | 'open' | 'us';
  tournamentScoresUrl: string;
};

export function ResultsTable({
  entriesCollection,
  tournament,
  tournamentScoresUrl,
}: Props) {
  const [cutScore, setCutScore] = React.useState(0);
  const [entriesMap, setEntriesMap] = React.useState<Record<string, Entry>>({});
  const [loadingData, setLoadingData] = React.useState(true);
  const [scoresMap, setScoresMap] = React.useState<Record<number, GolferScore>>(
    {}
  );
  const [usersMap, setUsersMap] = React.useState<Record<string, string>>({});

  const golfersById: Record<number, Golfer> = useOutletContext();

  React.useEffect(() => {
    setLoadingData(true);

    Promise.all([
      getDocs(collection(db, entriesCollection)),
      getDocs(collection(db, 'users')),
      fetch(`/cors?url=${tournamentScoresUrl}`),
    ])
      .then(([entriesResult, usersResult, scoresResponse]) => {
        if (!entriesResult.empty) {
          const entryMap: Record<string, Entry> = {};
          entriesResult.docs.forEach((doc) => {
            entryMap[doc.id] = doc.data() as Entry;
          });
          setEntriesMap(entryMap);
        }

        if (!usersResult.empty) {
          const userNamesById: Record<string, string> = {};
          usersResult.docs.forEach((doc) => {
            const data = doc.data() as { firstName: string; lastName: string };
            userNamesById[doc.id] = `${data.firstName} ${data.lastName}`;
          });
          setUsersMap(userNamesById);
        }

        if (scoresResponse.ok) {
          scoresResponse
            .json()
            .then((data: ScoresResponse) => {
              const golferMap: Record<number, GolferScore> = {};
              let currentCutScore: number = 0;

              data.result.golfers.forEach((golfer) => {
                if (!golfer.status) {
                  currentCutScore = Number(golfer.overallPar);
                }

                golferMap[golfer.golferId] = {
                  firstName: golfer.firstName,
                  golferId: golfer.golferId,
                  lastName: golfer.lastName,
                  overallPar: golfer.overallPar,
                  status: golfer.status,
                };
              });

              setCutScore(currentCutScore);
              setScoresMap(golferMap);
            })
            .catch(() => console.error('Error loading scores'));
        }
      })
      .catch(() => console.error('Error loading scoring data'))
      .finally(() => setLoadingData(false));
  }, [entriesCollection, tournamentScoresUrl]);

  const results = React.useMemo(() => {
    return Object.values(entriesMap)
      .map((entry) => {
        return {
          name: entry.name,
          overallScore: entry[tournament].reduce((total, pick) => {
            const golfer = scoresMap[pick] as GolferScore | undefined;

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
  }, [cutScore, entriesMap, scoresMap, tournament]);

  if (loadingData) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
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
            golfersById={golfersById}
            index={index}
            key={result.name}
            result={result}
            scoreMap={scoresMap}
            tied={
              index > 0 &&
              results[index - 1].overallScore === result.overallScore
            }
            userNamesById={usersMap}
          />
        ))}
      </tbody>
    </table>
  );
}

import * as React from 'react';

import { GolferScore } from 'types';

type ScoresResponse = {
  result: {
    golfers: GolferScore[];
  };
};

type ReturnType = {
  cutScore: number;
  loadingScores: boolean;
  scoresByGolferId: Record<number, GolferScore>;
};

export function useScores(url: string): ReturnType {
  const [cutScore, setCutScore] = React.useState(0);
  const [loadingScores, setLoadingScores] = React.useState(true);
  const [scoresByGolferId, setScoresByGolferId] = React.useState<
    Record<number, GolferScore>
  >({});

  React.useEffect(() => {
    setLoadingScores(true);

    fetch(`${process.env.REACT_APP_API_URL ?? ''}/cors?url=${url}`)
      .then((resp) => resp.json())
      .then((data: ScoresResponse) => {
        const scores: Record<number, GolferScore> = {};
        let currentCutScore: number = 0;

        data.result.golfers.forEach((golfer) => {
          if (!golfer.status) {
            currentCutScore = Number(golfer.overallPar);
          }

          scores[golfer.golferId] = {
            firstName: golfer.firstName,
            golferId: golfer.golferId,
            lastName: golfer.lastName,
            overallPar: golfer.overallPar,
            status: golfer.status,
          };
        });

        setCutScore(currentCutScore);
        setScoresByGolferId(scores);
      })
      .catch(() => console.error('Problem getting scores from', url))
      .finally(() => setLoadingScores(false));
  }, [url]);

  return { cutScore, loadingScores, scoresByGolferId };
}

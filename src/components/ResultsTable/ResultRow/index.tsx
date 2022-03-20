import * as React from 'react';

import { Golfer, GolferScore, Result } from 'types';
import classnames from 'utils/classnames';

import styles from './ResultRow.module.scss';

function formatScore(score: number): string {
  return score === 0 ? 'E' : score > 0 ? `+${score}` : `${score}`;
}

type Props = {
  cutScore: number;
  golfersById: Record<number, Golfer>;
  index: number;
  result: Result;
  scoreMap: Record<number, GolferScore>;
  tied: boolean;
  userNamesById: Record<string, string>;
};

export function ResultRow({
  cutScore,
  golfersById,
  index,
  result,
  scoreMap,
  tied,
  userNamesById,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const userName = userNamesById[result.userId];

  return (
    <React.Fragment key={result.name}>
      <tr
        className={classnames(styles.ResultRow, {
          [styles.Expanded]: expanded,
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="text-center">{tied ? '-' : index + 1}</td>
        <td>
          {result.name} <span className="text-muted">({userName})</span>
        </td>
        <td className="text-center">{formatScore(result.overallScore)}</td>
      </tr>
      <tr>
        <td colSpan={3}>
          <div className="row p-4">
            {result.picks.map((pick) => {
              const golfer = golfersById[pick];
              const score = scoreMap[pick] as GolferScore | undefined;

              return (
                <div
                  className="d-flex align-items-center justify-content-center col-6 col-md-3 mb-2"
                  key={`${result.userId}_${pick}`}
                >
                  <img
                    style={{
                      borderRadius: '9999px',
                      height: '32px',
                      marginRight: '10px',
                      width: '32px',
                    }}
                    src={golfer.photo}
                    alt={golfer.name}
                  />
                  {golfer.name}
                  <div className="ms-2">
                    {formatScore(score ? score.overallPar : cutScore + 1)}
                  </div>
                </div>
              );
            })}
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
}

import * as React from 'react';

import { Golfer, GolferScore, Result, User } from 'types';
import classnames from 'utils/classnames';
import { formatScore } from 'utils/formatScore';

import styles from './ResultRow.module.scss';

type Props = {
  cutScore: number;
  golfersById: Record<number, Golfer>;
  index: number;
  result: Result;
  scoresByGolferId: Record<number, GolferScore>;
  tied: boolean;
  usersById: Record<string, User>;
};

export function ResultRow({
  cutScore,
  golfersById,
  index,
  result,
  scoresByGolferId,
  tied,
  usersById,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const userName = usersById[result.userId].name;

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
            {result.picks.map((golferId) => {
              const golfer = golfersById[golferId];
              const score = scoresByGolferId[golferId] as
                | GolferScore
                | undefined;

              return (
                <div
                  className="d-flex align-items-center justify-content-end col-12 mb-2 px-5"
                  key={`${result.userId}_${golferId}`}
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
                  <div
                    className={classnames('ms-2', {
                      'text-danger': score?.status !== '',
                    })}
                  >
                    {formatScore(
                      score?.status === '' ? score.overallPar : cutScore + 1
                    )}{' '}
                    {score
                      ? score.status === ''
                        ? ''
                        : `(${score.status})`
                      : `(DNP)`}
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

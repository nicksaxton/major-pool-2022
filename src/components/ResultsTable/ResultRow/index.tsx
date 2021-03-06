import * as React from 'react';

import { Golfer, GolferScore, Result, User } from 'types';
import classnames from 'utils/classnames';
import { formatScore } from 'utils/formatScore';

import styles from './ResultRow.module.scss';

type Props = {
  cutScore: number;
  golfersById: Record<number, Golfer>;
  position: number;
  result: Result;
  scoresByGolferId: Record<number, GolferScore>;
  tied: boolean;
  usersById: Record<string, User>;
};

export function ResultRow({
  cutScore,
  golfersById,
  position,
  result,
  scoresByGolferId,
  tied,
  usersById,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const userName = usersById[result.userId].name;

  const picksSortedByScore = React.useMemo(() => {
    return result.picks.sort((a, b) => {
      const aScore = scoresByGolferId[a];
      const bScore = scoresByGolferId[b];

      const aTotal =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        aScore && aScore.status === '' ? aScore.overallPar : cutScore + 1;
      const bTotal =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        bScore && bScore.status === '' ? bScore.overallPar : cutScore + 1;

      return aTotal - bTotal;
    });
  }, [cutScore, result.picks, scoresByGolferId]);

  return (
    <React.Fragment key={result.name}>
      <tr
        className={classnames('bg-opacity-25', styles.ResultRow, {
          [styles.Expanded]: expanded,
          'bg-success': position === 1,
          'bg-primary': position === 2,
          'bg-warning': position === 3,
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="text-center">
          {tied ? 'T' : ''}
          {position}
        </td>
        <td>
          {result.name} <span className="text-muted">({userName})</span>
        </td>
        <td className="text-center">{formatScore(result.overallScore)}</td>
      </tr>
      <tr
        className={classnames('bg-opacity-25', {
          'bg-success': position === 1,
          'bg-primary': position === 2,
          'bg-warning': position === 3,
        })}
      >
        <td colSpan={3}>
          <div className="row justify-content-center p-lg-4 me-lg-4">
            <div className="col-12 col-lg-8">
              <table className="table border border-dark rounded">
                <tbody>
                  {picksSortedByScore.map((golferId) => {
                    const golfer = golfersById[golferId];
                    const score = scoresByGolferId[golferId] as
                      | GolferScore
                      | undefined;

                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (!golfer) {
                      return null;
                    }

                    return (
                      <tr
                        className="align-middle"
                        key={`${result.userId}_${golferId}`}
                      >
                        <td className="ps-4">
                          <img
                            className="d-none d-md-inline-block"
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
                        </td>
                        <td
                          className={classnames('text-end text-nowrap pe-3', {
                            'text-danger': score?.status !== '',
                          })}
                        >
                          {formatScore(
                            score?.status === ''
                              ? score.overallPar
                              : cutScore + 1
                          )}{' '}
                          {score
                            ? score.status === ''
                              ? ''
                              : `(${score.status})`
                            : `(DNP)`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
}

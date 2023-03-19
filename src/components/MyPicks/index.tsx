import { Button } from 'components/Button';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Entry, Golfer } from 'types';

type Props = {
  entries: Entry[];
  golfersById: Record<number, Golfer>;
  locked: boolean;
};

export function MyPicks({ entries, golfersById, locked }: Props) {
  return (
    <>
      {entries.map((entry) => (
        <div className="mt-4 overflow-hidden" key={entry.id}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">{entry.name}</h4>
            {locked ? null : (
              <Link to={`edit-entry/${entry.id}`}>
                <Button>Edit Entry</Button>
              </Link>
            )}
          </div>
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>The Masters</th>
                <th>PGA Championship</th>
                <th>U.S. Open</th>
                <th>The Open Championship</th>
              </tr>
            </thead>
            <tbody>
              {entry.masters.map((_, index) => (
                <tr key={`${entry.name}_${index}`}>
                  <td>
                    <img
                      className="d-none d-md-inline-block"
                      style={{
                        borderRadius: '9999px',
                        height: '32px',
                        marginRight: '10px',
                        width: '32px',
                      }}
                      src={golfersById[entry.masters[index]].photo}
                      alt=""
                    />{' '}
                    {golfersById[entry.masters[index]].name}
                  </td>
                  <td>
                    <img
                      className="d-none d-md-inline-block"
                      style={{
                        borderRadius: '9999px',
                        height: '32px',
                        marginRight: '10px',
                        width: '32px',
                      }}
                      src={golfersById[entry.pga[index]].photo}
                      alt=""
                    />{' '}
                    {golfersById[entry.pga[index]].name}
                  </td>
                  <td>
                    <img
                      className="d-none d-md-inline-block"
                      style={{
                        borderRadius: '9999px',
                        height: '32px',
                        marginRight: '10px',
                        width: '32px',
                      }}
                      src={golfersById[entry.us[index]].photo}
                      alt=""
                    />{' '}
                    {golfersById[entry.us[index]].name}
                  </td>
                  <td>
                    <img
                      className="d-none d-md-inline-block"
                      style={{
                        borderRadius: '9999px',
                        height: '32px',
                        marginRight: '10px',
                        width: '32px',
                      }}
                      src={golfersById[entry.open[index]].photo}
                      alt=""
                    />{' '}
                    {golfersById[entry.open[index]].name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

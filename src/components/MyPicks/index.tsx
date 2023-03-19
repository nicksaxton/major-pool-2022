import * as React from 'react';

import { Entry, Golfer } from 'types';

type Props = {
  entries: Entry[];
  golfersById: Record<number, Golfer>;
};

export function MyPicks({ entries, golfersById }: Props) {
  return (
    <>
      {entries.map((entry) => (
        <div className="mt-4 overflow-hidden" key={entry.id}>
          <h4>{entry.name}</h4>
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

import * as React from 'react';

import { Golfer } from 'types';

type GolfersById = {
  [id: number]: Golfer;
};

export function useGolfers() {
  const [loading, setLoading] = React.useState(true);
  const [golfersById, setGolfersById] = React.useState<GolfersById | null>(
    null
  );

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL ?? ''}/api/scrape-golfers`)
      .then((resp) => resp.json())
      .then((data) => {
        const golfersData = data as Golfer[];

        setGolfersById(
          golfersData.reduce<Record<number, Golfer>>((map, golfer) => {
            map[golfer.id] = golfer;
            return map;
          }, {})
        );
      })
      .catch((error) => console.error('Problem fetching golfers', error))
      .finally(() => setLoading(false));
  }, []);

  return { golfersById, loading };
}

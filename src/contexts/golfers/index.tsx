import * as React from 'react';

import { Golfer } from 'types';

const STORAGE_KEY = 'MP2022_GOLFERS';

type GolfersById = { [id: number]: Golfer };

const GolfersContext = React.createContext<GolfersById | undefined>(undefined);

type GolfersProviderProps = {
  children: React.ReactNode;
};

function GolfersProvider({ children }: GolfersProviderProps) {
  const [golfers, setGolfers] = React.useState<Golfer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cachedGolfers = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? '[]'
    ) as Golfer[];

    if (cachedGolfers.length > 0) {
      setGolfers(cachedGolfers);
    } else {
      fetch(`${process.env.REACT_APP_API_URL ?? ''}/api/scrape-golfers`)
        .then((resp) => resp.json())
        .then((golfersData: Golfer[]) => {
          setGolfers(golfersData);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(golfersData));
        })
        .catch((error) => {
          console.error('Failed to fetch golfers', error);
        });
    }

    setLoading(false);
  }, []);

  const golfersById = React.useMemo<GolfersById>(() => {
    return golfers.reduce<Record<number, Golfer>>((map, golfer) => {
      map[golfer.id] = golfer;
      return map;
    }, {});
  }, [golfers]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <GolfersContext.Provider value={golfersById}>
      {children}
    </GolfersContext.Provider>
  );
}

function useGolfers() {
  const context = React.useContext(GolfersContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an GolfersProvider');
  }

  return context;
}

export { GolfersProvider, useGolfers };

export type Golfer = {
  id: number;
  name: string;
  photo: string;
  ranking: number;
};

export type GolferScore = {
  firstName: string;
  golferId: number;
  lastName: string;
  overallPar: number;
  status: string;
};

export type Result = {
  name: string;
  overallScore: number;
  picks: number[];
  userId: string;
};

export type User = {
  name: string;
};

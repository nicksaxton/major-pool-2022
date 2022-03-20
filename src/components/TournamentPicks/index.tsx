import { Field } from 'formik';
import * as React from 'react';
import { Golfer } from 'types';

import classnames from 'utils/classnames';

import styles from './TournamentPicks.module.scss';

type Picks = {
  masters: string[];
  open: string[];
  pga: string[];
  us: string[];
};

type Props = {
  course: string;
  dates: string;
  golfers: Golfer[];
  logo: string;
  name: string;
  picks: Picks;
  tournament: keyof Picks;
};

export function TournamentPicks({
  course,
  dates,
  golfers,
  logo,
  name,
  picks,
  tournament,
}: Props) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const availableGolfers = React.useMemo(() => {
    return golfers
      .filter(
        (golfer) =>
          (!searchTerm ||
            golfer.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !picks.masters.includes(String(golfer.id)) &&
          !picks.open.includes(String(golfer.id)) &&
          !picks.pga.includes(String(golfer.id)) &&
          !picks.us.includes(String(golfer.id))
      )
      .slice(0, 10);
  }, [golfers, picks, searchTerm]);

  const selectedGolfers = React.useMemo(() => {
    return golfers.filter((golfer) =>
      picks[tournament].includes(String(golfer.id))
    );
  }, [golfers, picks, tournament]);

  let tournamentStyle = '';
  switch (tournament) {
    case 'masters':
      tournamentStyle = styles.Masters;
      break;

    case 'open':
      tournamentStyle = styles.OpenChampionship;
      break;

    case 'pga':
      tournamentStyle = styles.PGA;
      break;

    case 'us':
      tournamentStyle = styles.USOpen;
      break;

    default:
      break;
  }

  return (
    <div className={classnames(styles.TournamentPicks, tournamentStyle)}>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h4>{name}</h4>
        <h6>{course}</h6>
        <h6>{dates}</h6>
        <div className={styles.TournamentLogoWrapper}>
          <img
            className={styles.TournamentLogo}
            src={logo}
            alt={`${name} logo`}
          />
        </div>

        <div className={styles.GolfersContainer}>
          {selectedGolfers.length > 0 && (
            <ul className="list-group w-100 mb-2">
              {selectedGolfers.map((golfer) => (
                <li className="list-group-item" key={golfer.name}>
                  <div className="form-check d-flex align-items-center">
                    <Field
                      className="form-check-input me-4"
                      id={`masters_${golfer.id}`}
                      name={`picks[${tournament}]`}
                      type="checkbox"
                      value={String(golfer.id)}
                    />
                    <label htmlFor={`masters_${golfer.id}`}>
                      <img
                        className={styles.GolferPhoto}
                        src={golfer.photo}
                        alt={golfer.name}
                      />
                      {golfer.name}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <input
            className="form-control mb-1"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            type="text"
            value={searchTerm}
          />

          {availableGolfers.length > 0 && (
            <ul
              className={classnames(
                'list-group w-100',
                styles.AvailableGolfers
              )}
            >
              {availableGolfers.map((golfer) => (
                <li
                  className={classnames('list-group-item', styles.Golfer)}
                  key={golfer.name}
                >
                  <div className="form-check d-flex align-items-center">
                    <Field
                      className="form-check-input me-4"
                      disabled={picks[tournament].length === 3}
                      id={`masters_${golfer.id}`}
                      name={`picks[${tournament}]`}
                      type="checkbox"
                      value={String(golfer.id)}
                    />
                    <label htmlFor={`masters_${golfer.id}`}>
                      <img
                        className={styles.GolferPhoto}
                        src={golfer.photo}
                        alt={golfer.name}
                      />
                      {golfer.name}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
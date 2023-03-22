import { Field, FieldProps } from 'formik';
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
      .slice(0, 20);
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
        <h4 className="text-center">{name}</h4>
        <h6 className="text-center">{course}</h6>
        <h6 className="text-center">{dates}</h6>
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
                <li
                  className="list-group-item"
                  key={`${golfer.name}_${golfer.id}`}
                >
                  <div className="form-check d-flex align-items-center">
                    <Field name={`picks[${tournament}]`}>
                      {({ field }: FieldProps) => (
                        <input
                          {...field}
                          checked={!!field.value}
                          id={`${tournament}_${golfer.id}`}
                          type="checkbox"
                          onChange={(e) => {
                            setSearchTerm('');

                            field.onChange(e);
                          }}
                          className="form-check-input me-4"
                          value={String(golfer.id)}
                        />
                      )}
                    </Field>
                    <label
                      className="d-flex align-items-center"
                      htmlFor={`${tournament}_${golfer.id}`}
                    >
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
                  key={`${golfer.name}_${golfer.id}`}
                >
                  <div className="form-check d-flex align-items-center">
                    <Field name={`picks[${tournament}]`}>
                      {({ field }: FieldProps) => (
                        <input
                          {...field}
                          disabled={picks[tournament].length === 4}
                          id={`masters_${golfer.id}`}
                          type="checkbox"
                          className="form-check-input me-4"
                          value={String(golfer.id)}
                          onChange={(e) => {
                            setSearchTerm('');

                            field.onChange(e);
                          }}
                        />
                      )}
                    </Field>
                    <label
                      className="d-flex align-items-center"
                      htmlFor={`masters_${golfer.id}`}
                    >
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

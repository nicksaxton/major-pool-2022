import * as React from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from 'components/Button';
import { db } from 'utils/firebase';
import { Entry } from 'types';
import { TextField } from 'components/TextField';
import { TournamentPicks } from 'components/TournamentPicks';
import { useAuth } from 'contexts/auth';

import MastersLogo from 'images/masters-logo.svg';
import OpenChampionshipLogo from 'images/the-open-logo.png';
import PGALogo from 'images/pga-logo.png';
import USOpenLogo from 'images/us-open-logo.png';
import { useGolfers } from 'contexts/golfers';

const tournamentPicksSchema = yup
  .array(yup.number())
  .min(4, 'You must select exactly four golfers per tournament.')
  .max(4, 'You must select exactly four golfers per tournament.');

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter a name for your entry.')
    .min(5, 'Entry name must be at least five characters.')
    .max(50, 'Entry name must be less than 50 characters.'),
  picks: yup.object().shape({
    masters: tournamentPicksSchema,
    open: tournamentPicksSchema,
    pga: tournamentPicksSchema,
    us: tournamentPicksSchema,
  }),
});

export default function EditEntryPage() {
  const navigate = useNavigate();

  const golfersById = useGolfers();
  const golfers = React.useMemo(() => {
    return Object.values(golfersById).sort((a, b) => a.ranking - b.ranking);
  }, [golfersById]);

  const {
    state: { authenticated },
  } = useAuth();
  // Load entry
  const { entryId } = useParams();
  const [loadingEntry, setLoadingEntry] = React.useState(true);
  const [entry, setEntry] = React.useState<Entry | null>(null);

  React.useEffect(() => {
    getDoc(doc(db, 'entries_2023', entryId as string))
      .then((result) => {
        setEntry(result.data() as Entry);
      })
      .catch(() => console.error('Problem getting entry data'))
      .finally(() => setLoadingEntry(false));
  }, [entryId]);

  if (!authenticated) {
    navigate('/', { replace: true });
  }

  if (loadingEntry) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!entry) {
    return <p>Problem loading your entry data.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Edit your entry</h2>

      <Formik
        initialValues={{
          name: entry.name,
          picks: {
            masters: entry.masters.map((pick) => String(pick)),
            open: entry.open.map((pick) => String(pick)),
            pga: entry.pga.map((pick) => String(pick)),
            us: entry.us.map((pick) => String(pick)),
          },
        }}
        onSubmit={async (values) => {
          try {
            await updateDoc(doc(db, 'entries_2023', entryId as string), {
              name: values.name,
              masters: values.picks.masters.map((pick) => Number(pick)),
              open: values.picks.open.map((pick) => Number(pick)),
              pga: values.picks.pga.map((pick) => Number(pick)),
              us: values.picks.us.map((pick) => Number(pick)),
            });

            navigate('/', { replace: true, state: { success: true } });
          } catch (error: unknown) {
            console.error('Problem creating entry', error);
          }
        }}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, errors, submitCount, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <TextField label="Entry Name" name="name" />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p>Please select four golfers per tournament.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Augusta National Golf Club"
                  dates="April 6 - 9"
                  golfers={golfers}
                  logo={MastersLogo}
                  name="The Masters"
                  picks={values.picks}
                  tournament="masters"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Oak Hill Country Club"
                  dates="May 18 - 21"
                  golfers={golfers}
                  logo={PGALogo}
                  name="PGA Championship"
                  picks={values.picks}
                  tournament="pga"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Los Angeles Country Club"
                  dates="June 15 - 18"
                  golfers={golfers}
                  logo={USOpenLogo}
                  name="U.S. Open"
                  picks={values.picks}
                  tournament="us"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Royal Liverpool"
                  dates="July 20 - 23"
                  golfers={golfers}
                  logo={OpenChampionshipLogo}
                  name="The Open Championship"
                  picks={values.picks}
                  tournament="open"
                />
              </div>
            </div>

            {(errors.picks?.masters ||
              errors.picks?.open ||
              errors.picks?.pga ||
              errors.picks?.us) &&
              submitCount > 0 && (
                <div className="alert alert-danger">
                  You must select exactly four golfers per tournament.
                </div>
              )}

            <div className="row justify-content-end">
              <div className="col-sm-3">
                <Button type="submit">Save Entry</Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

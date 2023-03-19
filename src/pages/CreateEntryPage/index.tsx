import * as React from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Button } from 'components/Button';
import { db } from 'utils/firebase';
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

export default function CreateEntryPage() {
  const navigate = useNavigate();

  const golfersById = useGolfers();
  const golfers = React.useMemo(() => {
    return Object.values(golfersById).sort((a, b) => a.ranking - b.ranking);
  }, [golfersById]);

  const {
    state: { authenticated, user },
  } = useAuth();
  const [userInfo, setUserInfo] = React.useState<{ name: string } | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [numberOfEntries, setNumberOfEntries] = React.useState(0);
  React.useEffect(() => {
    const userId = user?.uid;

    if (userId) {
      getDoc(doc(db, 'users', userId))
        .then((result) => {
          if (result.exists()) {
            const data = result.data();
            setUserInfo({ name: `${data.firstName} ${data.lastName}` });
          }
        })
        .catch(() => console.error('Error loading user data'))
        .finally(() => setLoadingUser(false));

      const entriesQuery = query(
        collection(db, 'entries_2023'),
        where('userId', '==', userId)
      );

      getDocs(entriesQuery)
        .then((result) => {
          setNumberOfEntries(result.size);
        })
        .catch(() => console.error('Problem finding existing entry count'));
    }
  }, [user?.uid]);

  if (!authenticated) {
    navigate('/', { replace: true });
  }

  if (loadingUser) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Create your entry</h2>

      <Formik
        initialValues={{
          name: `${userInfo?.name} ${numberOfEntries + 1}`,
          picks: {
            masters: [] as string[],
            open: [] as string[],
            pga: [] as string[],
            us: [] as string[],
          },
        }}
        onSubmit={async (values) => {
          try {
            await addDoc(collection(db, 'entries_2023'), {
              name: values.name,
              masters: values.picks.masters.map((pick) => Number(pick)),
              open: values.picks.open.map((pick) => Number(pick)),
              pga: values.picks.pga.map((pick) => Number(pick)),
              us: values.picks.us.map((pick) => Number(pick)),
              userId: user?.uid,
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
                <Button type="submit">Create Entry</Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

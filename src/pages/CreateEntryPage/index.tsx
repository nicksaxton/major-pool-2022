import * as React from 'react';
import { Formik } from 'formik';

import { Golfer } from 'types';
import { TextField } from 'components/TextField';
import { TournamentPicks } from 'components/TournamentPicks';

import MastersLogo from 'images/masters-logo.svg';
import OpenChampionshipLogo from 'images/the-open-logo.png';
import PGALogo from 'images/pga-logo.png';
import USOpenLogo from 'images/us-open-logo.jpg';
import { useAuth } from 'contexts/auth';
import { useNavigate } from 'react-router-dom';
import { db } from 'utils/firebase';
import { doc, getDoc } from 'firebase/firestore/lite';

export default function CreateEntryPage() {
  const navigate = useNavigate();

  const [golfers, setGolfers] = React.useState<Golfer[]>([]);
  const [loadingGolfers, setLoadingGolfers] = React.useState(true);

  React.useEffect(() => {
    fetch('/scrape-golfers')
      .then((resp) => resp.json())
      .then((data) => {
        const golfersData = data as Golfer[];
        setGolfers(golfersData.sort((a, b) => a.ranking - b.ranking));
      })
      .catch(() => console.error('Problem fetching golfers'))
      .finally(() => setLoadingGolfers(false));
  }, []);

  const {
    state: { authenticated, user },
  } = useAuth();
  const [userInfo, setUserInfo] = React.useState<{ name: string } | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
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
    }
  }, [user?.uid]);

  if (!authenticated) {
    navigate('/', { replace: true });
  }

  if (loadingGolfers || loadingUser) {
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
          name: `${userInfo?.name} 1`,
          picks: {
            masters: [] as string[],
            open: [] as string[],
            pga: [] as string[],
            us: [] as string[],
          },
        }}
        onSubmit={() => {}}
      >
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <TextField label="Entry Name" name="name" />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Augusta National Golf Club"
                  dates="April 7 - 10"
                  golfers={golfers}
                  logo={MastersLogo}
                  name="The Masters"
                  picks={values.picks}
                  tournament="masters"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="Southern Hills CC"
                  dates="May 19 - 22"
                  golfers={golfers}
                  logo={PGALogo}
                  name="PGA Championship"
                  picks={values.picks}
                  tournament="pga"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="The Country Club"
                  dates="June 16 - 19"
                  golfers={golfers}
                  logo={USOpenLogo}
                  name="U.S. Open"
                  picks={values.picks}
                  tournament="us"
                />
              </div>

              <div className="col-sm-6 mb-4">
                <TournamentPicks
                  course="St. Andrews"
                  dates="July 14 - 17"
                  golfers={golfers}
                  logo={OpenChampionshipLogo}
                  name="The Open Championship"
                  picks={values.picks}
                  tournament="open"
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

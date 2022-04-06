import * as React from 'react';
import { doc, deleteDoc } from 'firebase/firestore/lite';

import { useAuth } from 'contexts/auth';
import { useUsers } from 'hooks/useUsers';
import { Navigate } from 'react-router-dom';
import { useEntries } from 'hooks/useEntries';
import { Button } from 'components/Button';
import { db } from 'utils/firebase';

import styles from './AdminPage.module.scss';

export default function AdminPage() {
  const {
    state: { user, verifying },
  } = useAuth();
  const { loadingUsers, usersById } = useUsers();

  const isAdmin = React.useMemo(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return usersById[user.uid]?.admin ?? false;
    }

    return false;
  }, [user, usersById]);

  const { entriesByUserId, loadingEntries } = useEntries('entries_2022');

  const sortedEntries = Object.values(entriesByUserId).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (!verifying && !loadingUsers && !isAdmin) {
    return <Navigate replace to="/" />;
  }

  if (loadingEntries || loadingUsers) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-grow-1">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  async function deleteEntry(entryName: string, entryId: string) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(`Are you sure you want to delete entry: ${entryName}?`)
    ) {
      try {
        console.log(entryId);
        await deleteDoc(doc(db, 'entries_2022', entryId));
        window.location.reload();
      } catch (error: unknown) {
        console.error(error);

        // eslint-disable-next-line no-alert
        window.alert('Problem deleting entry.');
      }
    }
  }

  return (
    <div className="row">
      <div className="col-12 my-4">
        <h1>Admin Panel</h1>
      </div>
      <div className="col-lg-6">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Entry</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.name}>
                <td>
                  {entry.name} ({usersById[entry.userId].name})
                </td>
                <td className="text-end">
                  <Button
                    className={styles.DeleteButton}
                    onClick={() => deleteEntry(entry.name, entry.entryId)}
                    variant="danger"
                  >
                    Delete Entry
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

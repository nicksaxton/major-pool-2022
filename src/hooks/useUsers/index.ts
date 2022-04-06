import * as React from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';

import { db } from 'utils/firebase';
import { User } from 'types';

export function useUsers() {
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [usersById, setUsersById] = React.useState<Record<string, User>>({});

  React.useEffect(() => {
    setLoadingUsers(true);

    getDocs(collection(db, 'users'))
      .then((snapshot) => {
        if (!snapshot.empty) {
          const users: Record<string, User> = {};

          snapshot.docs.forEach((doc) => {
            const data = doc.data() as {
              admin: boolean;
              firstName: string;
              lastName: string;
            };
            users[doc.id] = {
              admin: data.admin,
              name: `${data.firstName} ${data.lastName}`,
            };
          });

          setUsersById(users);
        }
      })
      .catch(() => console.error('Problem getting users'))
      .finally(() => setLoadingUsers(false));
  }, []);

  return { loadingUsers, usersById };
}

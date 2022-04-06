import * as React from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';

import { db } from 'utils/firebase';

type Entry = {
  entryId: string;
  name: string;
  userId: string;
  masters: number[];
  pga: number[];
  open: number[];
  us: number[];
};

export function useEntries(entriesCollection: string) {
  const [loadingEntries, setLoadingEntries] = React.useState(true);
  const [entriesByUserId, setEntriesByUserId] = React.useState<
    Record<string, Entry>
  >({});

  React.useEffect(() => {
    setLoadingEntries(true);

    getDocs(collection(db, entriesCollection))
      .then((snapshot) => {
        if (!snapshot.empty) {
          const entries: Record<string, Entry> = {};

          snapshot.docs.forEach((doc) => {
            entries[doc.id] = { entryId: doc.id, ...doc.data() } as Entry;
          });

          setEntriesByUserId(entries);
        }
      })
      .catch(() =>
        console.error('Problem getting entries from', entriesCollection)
      )
      .finally(() => setLoadingEntries(false));
  }, [entriesCollection]);

  return { entriesByUserId, loadingEntries };
}

import { useEffect, useState } from 'react';

export function useLocked() {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL ?? ''}/api/locked`)
      .then((response) => response.json())
      .then((isLocked: boolean) => {
        setLocked(isLocked);
      })
      .catch((error) => console.error(error));
  }, []);

  return { locked };
}

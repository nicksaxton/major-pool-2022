import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from 'utils/firebase';
import { Dispatch } from 'contexts/auth';

export async function handleSignIn(
  email: string,
  password: string,
  dispatch: Dispatch,
  onSuccess: () => void,
  setError: (error: string) => void
) {
  dispatch({ type: 'login_start' });

  try {
    await signInWithEmailAndPassword(auth, email, password);
    onSuccess();
  } catch (error: unknown) {
    setError('Invalid email or password. Please try again.');
  }
}

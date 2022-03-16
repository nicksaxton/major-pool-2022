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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    dispatch({ payload: userCredential.user, type: 'login_success' });

    onSuccess();
  } catch (error: unknown) {
    setError('Invalid email or password. Please try again.');
  }
}

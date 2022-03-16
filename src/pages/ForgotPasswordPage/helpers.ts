import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from 'utils/firebase';

export async function onSubmit(email: string, callback: () => void) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error(error);
  } finally {
    callback();
  }
}

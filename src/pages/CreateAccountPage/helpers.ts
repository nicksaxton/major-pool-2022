import { doc, setDoc } from 'firebase/firestore/lite';
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth';

import { auth, db } from 'utils/firebase';
import { Dispatch } from 'contexts/auth';
import { FormValues } from '.';

export async function handleCreateAccount(
  values: FormValues,
  dispatch: Dispatch,
  onSuccess: () => void,
  setErrorMessage: (errorMessage: string) => void
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      admin: false,
      firstName: values.firstName,
      lastName: values.lastName,
    });

    onSuccess();
  } catch (error: unknown) {
    const authError = error as AuthError;

    if (authError.code === 'auth/email-already-in-use') {
      setErrorMessage(
        `${values.email} is already in use. Try the "Forgot password?" link on the login page.`
      );
    } else {
      setErrorMessage(
        'Something went wrong. Send an email to nick.saxton@gmail.com to let Nick know.'
      );
    }
  }
}

import * as React from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from 'utils/firebase';

type Action =
  | { type: 'login_start' }
  | { payload: User; type: 'login_success' }
  | { type: 'sign_out' };
export type Dispatch = (action: Action) => void;
type State = { authenticated: boolean; user?: User; verifying: boolean };

const AuthContext = React.createContext<
  { dispatch: Dispatch; state: State } | undefined
>(undefined);

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case 'login_start':
      return {
        authenticated: true,
        verifying: false,
      };

    case 'login_success':
      return {
        authenticated: true,
        user: action.payload,
        verifying: false,
      };

    case 'sign_out':
      return {
        authenticated: false,
        user: undefined,
        verifying: false,
      };

    default:
      throw new Error('Unhandled action type');
  }
}

type AuthProviderProps = {
  children: React.ReactNode;
};

const initialState: State = {
  authenticated: false,
  user: undefined,
  verifying: false,
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const value = { dispatch, state };

  React.useEffect(() => {
    dispatch({ type: 'login_start' });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ payload: user, type: 'login_success' });
      } else {
        dispatch({ type: 'sign_out' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };

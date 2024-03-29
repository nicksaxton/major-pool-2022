import React from 'react';
import { signOut } from 'firebase/auth';
import { Outlet } from 'react-router-dom';

import { auth } from 'utils/firebase';
import { Navbar } from 'components/Navbar';
import { useAuth } from 'contexts/auth';

function App() {
  const {
    state: { authenticated, verifying },
  } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar
        authenticated={!verifying && authenticated}
        onSignOut={() => signOut(auth)}
      />
      <div className="container d-flex flex-column flex-grow-1">
        <Outlet />
      </div>
      <footer className="container">
        <p className="text-center text-muted border-top py-2 mb-0">
          <small>&copy; 2023 Nick Saxton</small>
        </p>
      </footer>
    </div>
  );
}
export default App;

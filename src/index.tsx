import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'custom.scss';

import App from 'App';
import { AuthProvider } from 'contexts/auth';
import CreateAccountPage from 'pages/CreateAccountPage';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import reportWebVitals from 'reportWebVitals';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import PreviousResultsPage from 'pages/PreviousResultsPage';
import { ResultsTable } from 'components/ResultsTable';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProvider>
              <App />
            </AuthProvider>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccountPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="2021" element={<PreviousResultsPage />}>
            <Route index element={<div>Overall</div>} />
            <Route
              path="masters"
              element={
                <ResultsTable
                  entriesCollection="entries"
                  tournament="masters"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19208/leaderboard"
                />
              }
            />
            <Route
              path="pga"
              element={
                <ResultsTable
                  entriesCollection="entries"
                  tournament="pga"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19190/leaderboard"
                />
              }
            />
            <Route
              path="us"
              element={
                <ResultsTable
                  entriesCollection="entries"
                  tournament="us"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19207/leaderboard"
                />
              }
            />
            <Route
              path="open"
              element={
                <ResultsTable
                  entriesCollection="entries"
                  tournament="open"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19198/leaderboard"
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
reportWebVitals();

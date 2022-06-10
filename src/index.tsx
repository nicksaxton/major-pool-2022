import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'custom.scss';

import reportWebVitals from 'reportWebVitals';

import App from 'App';

import { AuthProvider } from 'contexts/auth';
import { GolfersProvider } from 'contexts/golfers';
import { OverallResultsTable } from 'components/OverallResultsTable';
import { ResultsTable } from 'components/ResultsTable';

import AdminPage from 'pages/AdminPage';
import CreateAccountPage from 'pages/CreateAccountPage';
import CreateEntryPage from 'pages/CreateEntryPage';
import EditEntryPage from 'pages/EditEntryPage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import PreviousResultsPage from 'pages/PreviousResultsPage';
import ResetPasswordPage from 'pages/ResetPasswordPage';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GolfersProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </GolfersProvider>
          }
        >
          <Route path="/" element={<HomePage />}>
            <Route
              path=""
              element={
                <OverallResultsTable
                  entriesCollection="entries_2022"
                  tournamentUrls={{
                    masters:
                      'https://www.golfchannel.com/api/v2/events/19540/leaderboard',
                    pga: 'https://www.golfchannel.com/api/v2/events/19546/leaderboard',
                    us: '',
                    open: '',
                  }}
                />
              }
            />

            <Route
              path="masters"
              element={
                <ResultsTable
                  entriesCollection="entries_2022"
                  tournament="masters"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19540/leaderboard"
                />
              }
            />
            <Route
              path="pga"
              element={
                <ResultsTable
                  entriesCollection="entries_2022"
                  tournament="pga"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19546/leaderboard"
                />
              }
            />
            <Route
              path="us"
              element={
                <ResultsTable
                  entriesCollection="entries_2022"
                  tournament="us"
                  tournamentScoresUrl="https://www.golfchannel.com/api/v2/events/19550/leaderboard"
                />
              }
            />
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccountPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          <Route path="admin" element={<AdminPage />} />

          <Route path="create-entry" element={<CreateEntryPage />} />
          <Route path="edit-entry/:entryId" element={<EditEntryPage />} />

          <Route path="2021" element={<PreviousResultsPage />}>
            <Route
              index
              element={
                <OverallResultsTable
                  entriesCollection="entries"
                  tournamentUrls={{
                    masters:
                      'https://www.golfchannel.com/api/v2/events/19208/leaderboard',
                    pga: 'https://www.golfchannel.com/api/v2/events/19190/leaderboard',
                    us: 'https://www.golfchannel.com/api/v2/events/19207/leaderboard',
                    open: 'https://www.golfchannel.com/api/v2/events/19198/leaderboard',
                  }}
                />
              }
            />
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

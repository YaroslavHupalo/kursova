import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IssueBook from './pages/IssueBook';
import ActiveIssues from './pages/ActiveIssues';
import OverdueIssues from './pages/OverdueIssues';
import History from './pages/History';
import Statistics from './pages/Statistics';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="issue-book" element={<IssueBook />} />
            <Route path="active-issues" element={<ActiveIssues />} />
            <Route path="overdue" element={<OverdueIssues />} />
            <Route path="history" element={<History />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

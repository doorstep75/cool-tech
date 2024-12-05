// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import AuthContextProvider from './contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
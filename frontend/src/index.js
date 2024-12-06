// Import Bootstrap CSS for consistent styling across components
import 'bootstrap/dist/css/bootstrap.min.css';

// Import custom global styles
import './styles/styles.css';

// Import React and ReactDOM for rendering components
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18's new rendering API

// Import BrowserRouter for routing functionality
import { BrowserRouter as Router } from 'react-router-dom';

// Import the main application component
import App from './App';

// Import the AuthContextProvider to manage user authentication globally
import AuthContextProvider from './contexts/AuthContext';

// Import the ErrorBoundary component to handle uncaught errors gracefully
import ErrorBoundary from './ErrorBoundary';

// Select the root DOM element where the React application will mount
const container = document.getElementById('root');

// Create a React root using React 18's `createRoot` method
const root = ReactDOM.createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    {/* Wrap the application in an ErrorBoundary for global error handling */}
    <ErrorBoundary>
      {/* Enable routing for the application */}
      <Router>
        {/* Provide the authentication context to all components */}
        <AuthContextProvider>
          {/* Render the main application */}
          <App />
        </AuthContextProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
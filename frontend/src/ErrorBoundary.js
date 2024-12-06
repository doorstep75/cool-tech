// ErrorBoundary: A React component for handling runtime errors gracefully
import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors in child components
 * and display a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // Tracks if an error has occurred
  }

  /**
   * Updates state to trigger fallback UI when an error occurs.
   * @param {Error} error - The error that was thrown.
   * @returns {Object} Updated state with hasError set to true.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Logs error details for debugging or reporting purposes.
   * @param {Error} error - The error that was thrown.
   * @param {Object} errorInfo - Additional information about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error is detected
      return <h1>Something went wrong.</h1>;
    }

    // Render child components if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
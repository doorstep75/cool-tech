// PrivateRoute: A route that requires user authentication
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * A route that restricts access to authenticated users only.
 * 
 * @param {React.Component} component - The component to render if the user is authenticated.
 * @param {...Object} rest - Remaining props passed to the Route component.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext); // Access user data from context

  return (
    <Route
      {...rest}
      render={(props) =>
        // Render the component if the user is authenticated; otherwise, redirect to login
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
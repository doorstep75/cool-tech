// Role-based routing component
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * A route that restricts access based on user roles.
 * 
 * @param {React.Component} component - The component to render if access is granted.
 * @param {Array<string>} roles - Allowed user roles for this route.
 * @param {...Object} rest - Remaining props passed to the Route component.
 */
const RoleBasedRoute = ({ component: Component, roles, ...rest }) => {
  const { user } = useContext(AuthContext); // Access user data from context

  return (
    <Route
      {...rest}
      render={(props) =>
        // Render the component if the user's role is allowed; otherwise, redirect
        user && roles.includes(user.role) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};

export default RoleBasedRoute;
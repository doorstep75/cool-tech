// src/App.js
import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Shared/PrivateRoute';
import RoleBasedRoute from './components/Shared/RoleBasedRoute';
import NormalUserDashboard from './components/Dashboard/NormalUserDashboard';
import ManagementUserDashboard from './components/Dashboard/ManagementUserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CredentialList from './components/Credentials/CredentialList'; // Added for credentials
import AddCredential from './components/Credentials/AddCredential';
import UpdateCredential from './components/Credentials/UpdateCredential';
import UserList from './components/Users/UserList';
import ManageUser from './components/Users/ManageUser';
import TestAPI from './components/TestAPI';

function App() {
  const { user } = useContext(AuthContext);

  const renderDashboard = () => {
    if (user?.role === 'normal') {
      return <NormalUserDashboard />;
    } else if (user?.role === 'management') {
      return <ManagementUserDashboard />;
    } else if (user?.role === 'admin') {
      return <AdminDashboard />;
    }
    return null;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={renderDashboard} />
        <PrivateRoute path="/add-credential" component={AddCredential} />
        <PrivateRoute
          path="/update-credential/:id"
          component={UpdateCredential}
        />
        <PrivateRoute path="/credentials" component={CredentialList} />
        <RoleBasedRoute
          path="/manage-users"
          roles={['admin']}
          component={UserList}
        />
        <RoleBasedRoute
          path="/manage-user/:id"
          roles={['admin']}
          component={ManageUser}
        />
        <PrivateRoute path="/test-api" component={TestAPI} />
        {/* Add other routes as needed */}
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
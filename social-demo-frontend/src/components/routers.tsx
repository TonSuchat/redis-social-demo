import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./layout";
import Home from "./home";
import Dashboard from "./dashboard";
import Login from "./login";
import Register from "./register";
import Timeline from "./timeline";
import Profile from "./profile";

import { checkIsAuthen } from "../auth";

type PrivateRouteType = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteType> = ({
  component,
  path,
  exact,
}) => {
  return checkIsAuthen()
    ? (
      <Route
        render={(props) =>
          <Layout {...props}>
            <Route path={path} exact={exact} component={component} />
          </Layout>}
      />
    )
    : (
      <Redirect to="/login" />
    );
};

const AppRouters = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <PrivateRoute path="/dashboard" exact={true} component={Dashboard} />
      <PrivateRoute path="/timeline" exact={true} component={Timeline} />
      <PrivateRoute path="/profile/:id" exact={true} component={Profile} />
    </Switch>
  );
};

export default AppRouters;

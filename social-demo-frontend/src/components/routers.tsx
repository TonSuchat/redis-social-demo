import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "./home";
import Index from "./dashboard";
import Login from "./login";
import Register from "./register";
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
  return checkIsAuthen() ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

const AppRouters = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <PrivateRoute path="/dashboard" exact={true} component={Index} />
    </Switch>
  );
};

export default AppRouters;

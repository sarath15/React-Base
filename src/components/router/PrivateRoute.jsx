import React from "react";
import { Route, Redirect } from "react-router-dom";
import toastr from 'toastr';
import Authorization from '../../utility/authorization';

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */
const PrivateRoute = ({ component: Component,path, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        if(Authorization.hasPrevileage(path)){
           return <Component path={path} {...props} />
        } else {
           toastr.error("Unauthorized access"); 
           return <Redirect to={{ pathname: "/" }} />;   
        }
    }}
  />
);

//PrivateRoute.propTypes = matchPropTypes;

export default PrivateRoute;

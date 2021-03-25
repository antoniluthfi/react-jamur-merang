import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const GuestRoute = ({ component:Component, ...rest }) => {
    const token = localStorage.getItem('app-token');

    return (
        <Route {...rest} render={
            props => {
                if(!token || token === '') {
                    return <Component {...props} />
                } else {
                    return <Redirect to="/dashboard-administrator" />
                }
            }
        } />
    )
}

export default GuestRoute;
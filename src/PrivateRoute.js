import React from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = (props) => {
    const {isLoggedIn} = useSelector(state => state.Auth)
    if (isLoggedIn) return <Route {...props} />
    return <Redirect to='/' />
};

export default PrivateRoute;

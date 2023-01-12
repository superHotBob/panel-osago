// move to the hoc folder if need to reuse this
import {useSelector} from "react-redux";
import {selectAuthIsLoggedIn} from "../redux/authReducer";
import React, {useEffect} from "react";

const withWidgetAuth = Component => props => {
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)

    useEffect(() => {
        if (!isLoggedIn && window.location.pathname !== '/') window.location.href = '/'
    }, [isLoggedIn])

    if (isLoggedIn) return <Component {...props} />
    return null
}

export default withWidgetAuth

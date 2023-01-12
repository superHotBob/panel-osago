import React from 'react';
import {useSelector} from "react-redux";
import {selectAuthIsLoggedIn, selectAuthUser} from "../redux/authReducer";

export const useFilledData = () => {
    const userData = useSelector(selectAuthUser);
    const isLoggedIn = useSelector(selectAuthIsLoggedIn);
    if(!userData) {
        return null
    }

    const isNeededData = !userData?.firstName && !userData?.lastName && !userData?.patronymic && !userData?.bornOn
    return isLoggedIn && isNeededData;
}

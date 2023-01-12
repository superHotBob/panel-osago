import React, {useEffect, useState} from 'react';
import './header-profile-button.scss'
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";
import {HeaderContextMenuItem} from "../header-context-menu-item/HeaderContextMenuItem";
import AuthContainer from "../../../auth/AuthContainer";
import {useDispatch, useSelector} from "react-redux";
import {selectAuthIsLoggedIn, selectAuthUser, updateProfileAction} from "../../../../redux/authReducer";
import {IconName, IconSprite} from "../../../icon-sprite/IconSprite";
import {HeaderBadge} from "../header-badge/HeaderBadge";
import api from '../../../../api';
import { AddTrack, CustomEventName } from "../../../../modules/tracking";
import {useFilledData} from "../../../../hooks/useFilledData";

export const HeaderProfileButton = ({onLogout, showLogin}) => {
    const [loginPopupShown, setLoginPopupShown] = useState(false);
    const [registrationPopupShown, setRegistrationPopupShown] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const isLoggedIn = useSelector(selectAuthIsLoggedIn);
    const user = useSelector(selectAuthUser);
    const dispatch = useDispatch();
    const isNeedRedirect = useFilledData();

    const handleLoginOrRegistrationPopupClose = () => {
        setLoginPopupShown(false);
        setRegistrationPopupShown(false);
        setRegistrationData(null);
    }

    const handleLoginClick = () => {
        setLoginPopupShown(true);
        AddTrack(CustomEventName.SIGN_IN);
    }

    const handleRegistrationClick = () => {
        AddTrack(CustomEventName.SIGN_UP);
        setRegistrationPopupShown(true);
    }

    const onRegister = (phoneNumber, name, email, lastName, patronymic, position, bornOn) => {
        if (bornOn) {
            setRegistrationData({
                firstName: name,
                email: email,
                position,
                patronymic,
                lastName,
                bornOn
            })
        }
    }

    const clickProfile = () => AddTrack(CustomEventName.PROFILE);
    const clickMyVehicles = () => AddTrack(CustomEventName.MY_VEHICLES);
    const clickSubscriptions = () => AddTrack(CustomEventName.SUBSCRIPTONS);
    const clickMyHistory = () => AddTrack(CustomEventName.MY_HISTORY);

    const handlePhoneConfirmed = async () => {
        if (registrationData) {
            dispatch(updateProfileAction(registrationData))
        }
        handleLoginOrRegistrationPopupClose();
    }

    useEffect(() => {
        if(showLogin){
            handleLoginClick();
        }
    }, [showLogin])

    useEffect(() => {
        if(window.location.search.includes('showRegistration')) {
            setRegistrationPopupShown(true);
        }
    },[])

    const renderNavigation = () => {
        if(isNeedRedirect) {
            return (
                <>
                    <HeaderContextMenuItem text="Профиль" onClick={handleRegistrationClick} />
                    <HeaderContextMenuItem text="Мои автомобили" onClick={handleRegistrationClick} />
                    <HeaderContextMenuItem text="Подписки и платежи" onClick={handleRegistrationClick} />
                    <HeaderContextMenuItem text="История запросов" onClick={handleRegistrationClick} />
                    <HeaderContextMenuItem text="Выход" onClick={onLogout} />
                </>
            )
        }
        return (
            <>
                <HeaderContextMenuItem text="Профиль" href="/profile" onClick={clickProfile} />
                <HeaderContextMenuItem text="Мои автомобили" href="/my_vehicles" onClick={clickMyVehicles} />
                <HeaderContextMenuItem text="Подписки и платежи" href="/subscriptions" onClick={clickSubscriptions} />
                <HeaderContextMenuItem text="История запросов" href="/my_history" onClick={clickMyHistory} />
                <HeaderContextMenuItem text="Выход" onClick={onLogout} />
            </>
        )

    }

    return (
        <>
            <div className="header-profile-button__button" onClick={!isLoggedIn ? handleLoginClick : () => null}>
                {!isLoggedIn &&
                <Typography type={TypographyType.BODY}
                            color={TypographyColor.MUST_100}>
                    ВОЙТИ
                </Typography>}
                {isLoggedIn &&
                <div className="header-profile-button__user-info">
                    <IconSprite name={IconName.USER} className="mustins-mr-12 header-profile-button__user-icon"/>
                    <Typography type={TypographyType.BODY}
                                color={TypographyColor.MUST_100}>
                        {user && (user.firstName || 'TRUCKER')}
                    </Typography>
                </div>}
                {isLoggedIn && user &&
                <IconSprite name={IconName.GREEN_TRIANGLE} className="header-profile-button__triangle"/>}
            </div>
            <div className="header-profile-button__header-context-menu">
                {!isLoggedIn ? (
                    <>
                        <HeaderContextMenuItem text="Вход" onClick={handleLoginClick}/>
                        <HeaderContextMenuItem text="Новый пользователь" onClick={handleRegistrationClick}/>
                    </>
                ) : (
                    renderNavigation()
                )}

            </div>
            {(loginPopupShown || registrationPopupShown) && (
                <AuthContainer
                    initialStep={registrationPopupShown ? 'registration' : 'login'}
                    onCodeSent={onRegister}
                    resetToInitialStepAfterClosed
                    shouldGetProfileAfterConfirmation={true}
                    isOpened
                    onClose={handleLoginOrRegistrationPopupClose}
                    onPhoneConfirmed={handlePhoneConfirmed}
                    loginLabelText='Телефон, если есть личный кабинет'
                    renderModal
                    hidePosition={true}
                    handleRegistrationClick={handleRegistrationClick}
                />
            )}
            {!isLoggedIn && <div className="header-profile-button__mobile-icon"
                                 onClick={handleLoginClick}>
                <IconSprite name={IconName.ENTER} className="header-profile-button__mobile-icon-svg"/>
            </div>}
            {isLoggedIn && <a className="header-profile-button__mobile-icon"
                              href="/profile">
                <IconSprite name={IconName.USER_BLACK} className="header-profile-button__mobile-icon-svg"/>
            </a>}
        </>
    );
};

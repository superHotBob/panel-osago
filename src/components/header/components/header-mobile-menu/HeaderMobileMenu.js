import React, {useRef, useState} from 'react';
import './header-mobile-menu.scss'
import classNames from 'classnames';
import {useOnClickOutside} from "../../../../hooks/useOnClickOutside";
import {IconName, IconSprite} from "../../../icon-sprite/IconSprite";
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";
import {HeaderServices, HeaderServicesOrientation} from "../header-services/HeaderServices";
import {useSelector} from "react-redux";
import {selectAuthIsLoggedIn, selectAuthUser} from "../../../../redux/authReducer";
import {HeaderContextMenuItem} from "../header-context-menu-item/HeaderContextMenuItem";
import {HeaderCollapsableBlock} from "../header-collapsable-block/HeaderCollapsableBlock";
import {HeaderAboutMust} from "../header-about-must/HeaderAboutMust";
import {HeaderMustDocuments} from "../header-must-documents/HeaderMustDocuments";
import AuthContainer from "../../../auth/AuthContainer";
import Registration from "../../../auth/Registration";
import { AddTrack, CustomEventName } from '../../../../modules/tracking';
import {useFilledData} from "../../../../hooks/useFilledData";

const ExpandableBlockTypes = {
    ABOUT: 'ABOUT',
    DOCUMENTS: 'DOCUMENTS'
}


export const HeaderMobileMenu = ({shown, onClose, onLogout}) => {
    const [loginPopupShown, setLoginPopupShown] = useState(false);
    const [registrationPopupShown, setRegistrationPopupShown] = useState(false);
    const [expandedBlock, setExpandedBlock] = useState('');
    const isLoggedIn = useSelector(selectAuthIsLoggedIn);
    const user = useSelector(selectAuthUser);
    const isNeedRedirect = useFilledData();

    const ref = useRef();
    useOnClickOutside(ref, shown && onClose);

    const handleLoginOrRegistrationPopupClose = () => {
        setLoginPopupShown(false);
        setRegistrationPopupShown(false);
    }

    const handleLoginClick = () => {
        AddTrack(CustomEventName.SIGN_IN);
        setLoginPopupShown(true);
        onClose();
    }

    const handleRegistrationClick = () => {
        AddTrack(CustomEventName.SIGN_UP);
        setRegistrationPopupShown(true);
        onClose();
    }

    const handleExpandChange = (changedBlock) => {
        setExpandedBlock(changedBlock === expandedBlock ? '' : changedBlock)
    }

    const renderNavMenu = () => {
        if(isNeedRedirect) {
            return (
                <>
                    <HeaderContextMenuItem text="Профиль" onClick={handleRegistrationClick}/>
                    <HeaderContextMenuItem text="Мои автомобили" onClick={handleRegistrationClick}/>
                    <HeaderContextMenuItem text="Подписки и платежи" onClick={handleRegistrationClick}/>
                    <HeaderContextMenuItem text="История запросов" onClick={handleRegistrationClick}/>
                </>
            )
        }
        return  (
            <>
                <HeaderContextMenuItem text="Профиль" href="/profile"/>
                <HeaderContextMenuItem text="Мои автомобили" href="/my_vehicles"/>
                <HeaderContextMenuItem text="Подписки и платежи" href="/subscriptions"/>
                <HeaderContextMenuItem text="История запросов" href="/my_history"/>
            </>
        )
    }

    return (
        <>
            <div className={classNames('header-mobile-menu', shown ? 'header-mobile-menu--shown' : '')}
                 ref={ref}>
                <div className="header-mobile-menu__close-row">
                    <div className="header-mobile-menu__close-icon"
                         onClick={onClose}>
                        <IconSprite name={IconName.CLOSE} className="header-mobile-menu__close-icon-svg"/>
                    </div>
                </div>
                {isLoggedIn && (
                    <div className="header-mobile-menu__user-block">
                        {user && user.firstName && (
                            <div className="header-mobile-menu__user-row">
                                <IconSprite name={IconName.USER_BLACK} className="header-mobile-menu__user-black"/>
                                <div className="header-mobile-menu__user-name-container">
                                    <Typography type={TypographyType.BODY}
                                                color={TypographyColor.MUST_800}>{user.firstName}</Typography>
                                </div>
                            </div>
                        )}
                        {renderNavMenu()}
                    </div>
                )}
                <div className="mustins-ml-16 mustins-mr-16 mustins-mb-16">
                    <div className="mustins-mb-16">
                        <Typography type={TypographyType.CAPTION}
                                    color={TypographyColor.MUST_800}>Сервисы MUST</Typography>
                    </div>
                    <HeaderServices orientation={HeaderServicesOrientation.VERTICAL}/>
                </div>
                <HeaderCollapsableBlock title="Компания MUST"
                                        expanded={expandedBlock === ExpandableBlockTypes.ABOUT}
                                        onExpandChange={() => handleExpandChange(ExpandableBlockTypes.ABOUT)}>
                    <HeaderAboutMust/>
                </HeaderCollapsableBlock>
                <HeaderCollapsableBlock title="Документы MUST"
                                        expanded={expandedBlock === ExpandableBlockTypes.DOCUMENTS}
                                        onExpandChange={() => handleExpandChange(ExpandableBlockTypes.DOCUMENTS)}>
                    <HeaderMustDocuments/>
                </HeaderCollapsableBlock>
                <div className="mustins-mb-16 mustins-mt-16">
                    {!isLoggedIn && <>
                        <div className="header-mobile-menu__action-row"
                             onClick={handleRegistrationClick}>
                            <IconSprite name={IconName.USER_BLACK} className="header-mobile-menu__action-icon"/>
                            <Typography>НОВЫЙ ПОЛЬЗОВАТЕЛЬ</Typography>
                        </div>
                        <div className="header-mobile-menu__action-row"
                             onClick={handleLoginClick}>
                            <IconSprite name={IconName.ENTER} className="header-mobile-menu__action-icon"/>
                            <Typography>ВОЙТИ</Typography>
                        </div>
                    </>}
                    {isLoggedIn &&
                    <div className="header-mobile-menu__action-row"
                         onClick={onLogout}>
                        <IconSprite name={IconName.EXIT} className="header-mobile-menu__action-icon"/>
                        <Typography>ВЫЙТИ</Typography>
                    </div>}
                </div>
            </div>
            <div className="header-mobile-menu__overlay"></div>
            {(loginPopupShown || registrationPopupShown) && (
                <AuthContainer
                    initialStep={registrationPopupShown ? 'registration' : 'login'}
                    resetToInitialStepAfterClosed
                    shouldGetProfileAfterConfirmation={true}
                    isOpened
                    onClose={handleLoginOrRegistrationPopupClose}
                    onPhoneConfirmed={handleLoginOrRegistrationPopupClose}
                    loginLabelText='Телефон, если есть личный кабинет'
                    renderModal
                    hidePosition={true}
                    handleRegistrationClick={handleRegistrationClick}
                />
            )}
        </>
    )
}

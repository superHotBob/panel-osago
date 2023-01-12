import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { IconName, IconSprite } from 'components/icon-sprite/IconSprite';

import './header.scss';
import { HeaderBurgerMenu } from './components/header-burger-menu/HeaderBurgerMenu';
import { HeaderProfileButton } from './components/header-profile-button/HeaderProfileButton';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { profileLogout } from '../main-panel/MainPanelModel';
import { logoutAction } from '../../redux/authReducer';
import routes from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import AppContext from '../../store/context';
import { withRouter as withRouterHoc } from '../../hoc/withRouter';
import { withRouter } from 'react-router-dom';
import { HeaderServices } from './components/header-services/HeaderServices';
import HeaderLogoSvg from '../../svg/header-logo.svg';
import { HeaderMobileMenu } from './components/header-mobile-menu/HeaderMobileMenu';

import EmailModal from "../email/EmailModal";
import { selectDomainPrefix } from '../../redux/rootReducer';

export const Header = withRouterHoc(withRouter(({ history, location }) => {
    const domainPrefix = useSelector(selectDomainPrefix);
    const [isShowShadow, setIsShowShadow] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const [burgerMenuShown, setBurgerMenuShown] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null);

    const [mobileBurgerMenuShown, setMobileBurgerMenuShown] = useState(false);
    const dispatch = useDispatch();
    const { widgetId } = useContext(AppContext)

    const handleScroll = () => {
        setIsShowShadow(window.scrollY > 20);
    };

    const handleBurgerClick = () => {
        setBurgerMenuShown(!burgerMenuShown);
    }

    const handleMobileBurgerClick = () => {
        setMobileBurgerMenuShown(!mobileBurgerMenuShown);
    }

    const handleMobileBurgerMenuClose = () => {
        setMobileBurgerMenuShown(false);
    }

    const handleLogout = async () => {
        await profileLogout();

        dispatch(logoutAction())

        if (widgetId === 'must-accident') {
            // Если находимся в открытой части, то редиректить не нужно
            if (routes
                .filter(r => r.isPrivate)
                .some(r => r.path === location.pathname)) {
                history.push('/')
            }
        } else {
            if (window.location.pathname !== '/') window.location.href = '/'
        }
    }

    const burgerMenuRef = useRef();
    useOnClickOutside(burgerMenuRef, () => burgerMenuShown && setBurgerMenuShown(false));

    // * Сценарий для показа модального окна после подтверждения email
    useEffect(() => {
        const URLparams = new URLSearchParams(window.location.search);
        const prop = URLparams.get("email-status");

        if (!prop) {
            return;
        }

        switch (prop) {
            case 'verified':
                setEmailStatus('verified');
                break;
            case 'failed':
                setEmailStatus('failed');
                break;
        }

        setEmailModal(true);
    }, []);

    useEffect(() => {
        if (window.innerWidth <= 1280) {
            document.addEventListener('scroll', handleScroll);
        }
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>
            <header className={classNames('header', burgerMenuShown ? 'header--burger-menu-shown' : '')}>
                <div className={classNames('header__inner', burgerMenuShown ? 'header__inner--burger-menu-shown' : '')}>
                    <div className="header__mobile-burger"
                        onClick={handleMobileBurgerClick}>
                        <IconSprite name={IconName.BURGER} />
                    </div>
                    <div className="header__logo">
                        <a href={`https://${domainPrefix}osago.mustins.ru`}>
                            <HeaderLogoSvg className="header__logo-svg" />
                        </a>
                    </div>
                    <div className="header__services">
                        <HeaderServices />
                    </div>
                    <div className="header__burger-and-button">
                        <div className="header__burger"
                            onClick={handleBurgerClick}>
                            {!burgerMenuShown && <IconSprite name={IconName.BURGER} />}
                            {burgerMenuShown && <IconSprite name={IconName.CLOSE} />}
                        </div>
                        <HeaderProfileButton onLogout={handleLogout} showLogin={showLogin} />
                    </div>
                </div>
                <HeaderBurgerMenu shown={burgerMenuShown} ref={burgerMenuRef} />
            </header>
            <div className="header__services-for-mobile-and-tablet">
                <div className="mustins-mt-16">
                    <HeaderServices />
                </div>
            </div>
            <HeaderMobileMenu shown={mobileBurgerMenuShown}
                onClose={handleMobileBurgerMenuClose}
                onLogout={() => {
                    handleLogout();
                    handleMobileBurgerMenuClose();
                }} />

            {emailStatus && (
                <EmailModal
                    isOpened={emailModal}
                    onClose={() => setEmailModal(false)}
                    currentStep={emailStatus}
                    history={history}
                    showLogin={() => setShowLogin(true)}
                />
            )}
        </>
    )
}))




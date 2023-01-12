import React, { useEffect, useState } from 'react';
import './sub-header.scss';


export const SubHeader = () => {
    const [active, setActive] = useState("");
    useEffect(() => {
        setActive(window.location.pathname.substring(1));
    },[]);
    return (
        <nav className="sub-header">
            <ul className="sub-header__list">
                <li className="sub-header__item">
                    <a className={`sub-header__link${active === "profile" ? "__active" : ""}`} href={`/profile`}>Профиль</a>
                </li>
                <li className="sub-header__item">
                    <a className={`sub-header__link${active === "my_vehicles" ? "__active" : ""}`} href={`/my_vehicles`}>Мои автомоибили</a>
                </li>
                <li className="sub-header__item">
                    <a className={`sub-header__link${active === "subscriptions" ? "__active" : ""}`} href={`/subscriptions`}>Подписки и платежи</a>
                </li>
                <li className="sub-header__item">
                    <a className={`sub-header__link${active === "my_history" ? "__active" : ""}`} href={`/my_history`}>История запросов</a>
                </li>
            </ul>
        </nav>
    )
}
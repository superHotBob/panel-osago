import React from 'react';
import './header-about-must.scss';
import map from "lodash/map";
import {HeaderLink} from "../header-link/HeaderLink";

const ABOUT_MUST = [
    {name: 'Команда MUST', href: ''},
    {name: 'Пресс-релизы и статьи', href: ''},
    {name: 'FAQ • Частые вопросы', href: ''}
]

export const HeaderAboutMust = () => {
    return (
        <div className="header-about-must">
            {map(ABOUT_MUST, ({name, href}, key) => (
                <div className="header-about-must__item" key={key}>
                    <HeaderLink name={name} href={href}/>
                </div>
            ))}
        </div>
    );
}


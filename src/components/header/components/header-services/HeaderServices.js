import React from 'react';
import './header-services.scss'
import classNames from "classnames";
import map from 'lodash/map';
import {getCurrentUrl, isEqualWithoutProtocol} from "../../../../utils/urls";
import {IconSprite} from "../../../icon-sprite/IconSprite";
import {Typography, TypographyColor, TypographyType, TypographyWeight} from "../../../typography/Typography";
import TriangleSVG from "../../../../svg/triangle.svg";
import {getHeaderServicesData} from "./HeaderServicesData";
import { useSelector } from 'react-redux';
import { selectDomainPrefix } from '../../../../redux/rootReducer';

export const HeaderServicesOrientation = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL'
}

export const HeaderServices = ({orientation = HeaderServicesOrientation.HORIZONTAL}) => {
    const domainPrefix = useSelector(selectDomainPrefix);

    return (
        <div
            className={classNames('header-services', orientation === HeaderServicesOrientation.VERTICAL ? 'header-services--vertical' : '')}>
            {map(getHeaderServicesData(domainPrefix), (menuItem, index) => {

                // Сценарий заменяет ссылку на страницу FAQ из обекта на сслыку с якорем к блоку на гавной странице.
                if(menuItem.label.toLowerCase() === 'faq') {
                    let anchorAccident = '';
                    let anchorOsago = '';

                    switch (domainPrefix) {
                        case 'gpn-':
                            anchorAccident = '#rec324561189';
                            anchorOsago = '#rec324563335';
                            break;
                        case 'kamaz-':
                            anchorAccident = '#rec331636729';
                            anchorOsago = '#rec331607573';
                            break;
                        default:
                            anchorAccident = '#rec298604264';
                            anchorOsago = '#rec293738948';
                            break;
                    }

                    const url = window.location;

                    switch (url.origin) {
                        case `https://${domainPrefix}osago.mustins.ru`:
                            menuItem.url = `https://${domainPrefix}osago.mustins.ru/${anchorOsago}`;
                            break;
                        case `https://${domainPrefix}accident.mustins.ru`:
                            menuItem.url = `https://${domainPrefix}accident.mustins.ru/${anchorAccident}`;
                            break;
                        default:
                            menuItem.url = `/`;
                    }

                }

                return (
                    <a key={`header-service-item-${index}`}
                       href={menuItem.url}
                       className={classNames(
                           'header-services__item',
                           {'header-services__item--active': menuItem.url && isEqualWithoutProtocol(menuItem.url, getCurrentUrl())},
                       )}
                    >
                        <div className="header-services__item-container">
                            <div className="header-services__item-icon">
                                <IconSprite name={menuItem.icon}/>
                            </div>
                            <div className="header-services__item-link">
                                <Typography type={TypographyType.BODY} color={TypographyColor.MUST_900}>
                                    {menuItem.label}
                                </Typography>
                            </div>
                        </div>
                        {menuItem.startText &&
                        <div className="header-services__item-start-mobile-text mustins-mt-4">
                            <Typography color={TypographyColor.MUST_900} type={TypographyType.FOOTNOTE}>
                                {menuItem.startText.replace('квартал', 'кв.')}
                            </Typography>
                        </div>}
                        {menuItem.startText &&
                        <div className="header-services__item-hover-bubble">
                            <div className="header-services__item-triangle">
                                <TriangleSVG/>
                            </div>
                            <div>
                                <Typography color={TypographyColor.MUST_900} type={TypographyType.CAPTION}>
                                    {menuItem.disabledText}
                                </Typography>
                            </div>
                            <div className="mustins-mt-16">
                                <Typography color={TypographyColor.PRIMARY} type={TypographyType.CAPTION}>
                                    Cтарт
                                </Typography>
                                <span className="header-services__item-start-text">
                                    <Typography color={TypographyColor.PRIMARY}
                                                type={TypographyType.CAPTION}
                                                weight={TypographyWeight.MEDIUM}>
                                    {menuItem.startText}
                                    </Typography>
                                </span>
                            </div>
                        </div>}
                    </a>
                )
            })}
        </div>
    )
}

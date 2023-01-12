import React from 'react';
import './header-burger-menu.scss';
import {Container} from "../../../grid/Container/Container";
import {Row} from "../../../grid/Row/Row";
import {Col} from "../../../grid/Col/Col";
import {Typography, TypographyColor, TypographyType} from "../../../typography/Typography";
import BurgerMenuManSvg from "../../../../svg/burger-menu-man.svg";
import BurgerMenuBoxShieldSvg from "../../../../svg/burger-menu-box-shield.svg";
import {HeaderAboutMust} from "../header-about-must/HeaderAboutMust";
import {HeaderMustDocuments} from "../header-must-documents/HeaderMustDocuments";
import {HeaderServices, HeaderServicesOrientation} from "../header-services/HeaderServices";

export const HeaderBurgerMenu = React.forwardRef(({shown}, ref) => {
    if (!shown) {
        return null;
    }


    return (
        <>
                <Container fluid className="header-burger-menu__container" forwardedRef={ref}>
                    <Row className="header-burger-menu__desktop">
                        <Col xs={{size: 2, offset: 1}}>
                            <div className="mustins-mb-40">
                                <Typography bigDesktopType={TypographyType.BODY}
                                            type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>Компания MUST</Typography>
                            </div>
                            <HeaderAboutMust/>
                        </Col>
                        <Col xs={{size: 2}}>
                            <BurgerMenuManSvg className="header-burger-menu__svg"/>
                        </Col>
                        <Col xs={{size: 2, offset: 2}}>
                            <div className="mustins-mb-40">
                                <Typography bigDesktopType={TypographyType.BODY}
                                            type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>Документы MUST</Typography>
                            </div>
                            <HeaderMustDocuments/>
                        </Col>
                        <Col xs={{size: 2}}>
                            <BurgerMenuBoxShieldSvg className="header-burger-menu__svg"/>
                        </Col>
                    </Row>
                    <Row className="header-burger-menu__tablet">
                        <Col xs={{size: 6}}>
                            <div className="header-burger-menu__services-title">
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>Сервисы MUST</Typography>
                            </div>
                            <HeaderServices orientation={HeaderServicesOrientation.VERTICAL}/>
                        </Col>
                        <Col xs={{size: 6}}>
                            <div className="mustins-mb-32">
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>Компания MUST</Typography>
                            </div>
                            <div className="mustins-mb-52">
                            <HeaderAboutMust/>
                            </div>
                            <div className="mustins-mb-32">
                                <Typography type={TypographyType.CAPTION}
                                            color={TypographyColor.MUST_800}>Документы MUST</Typography>
                            </div>
                            <HeaderMustDocuments/>
                        </Col>
                    </Row>
                </Container>
        </>
    )
})

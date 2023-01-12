import React from 'react';
import './carousel-item.scss';
import {element, string} from 'prop-types'
import {Text, TextColor, TextFont, TextSize} from '../text/Text';
import {Typography, TypographyType, TypographyWeight} from "../typography/Typography";

export class CarouselItem extends React.Component {

    static propTypes = {
        svg: element,
        text: element,
        subText: string
    };

    render() {
        const {svg, text, subText} = this.props;

        return (
            <div className="carousel-item">
                <div className="carousel-item__row">
                    <Typography type={TypographyType.H5} weight={TypographyWeight.MEDIUM}>{text}</Typography>
                    {svg}
                </div>
                <Typography type={TypographyType.BODY}>{subText}</Typography>
            </div>
        );
    }

}

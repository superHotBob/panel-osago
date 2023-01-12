import React from 'react';
import './accident-legend.scss';
import {Typography, TypographyColor, TypographyType} from '../../../../components/typography/Typography';

export const AccidentLegend = () => {
    return (
        <div className="accident-legend">
            <div className="accident-legend__item">
                <div className="accident-legend__circle accident-legend__circle--norma"/>
                <div className="accident-legend__text">
                    <Typography color={TypographyColor.MUST_800}
                                type={TypographyType.CAPTION}>
                        - норма
                    </Typography>
                </div>
            </div>
            <div className="accident-legend__item">
                <div className="accident-legend__circle accident-legend__circle--accident-risk"/>
                <div className="accident-legend__text">
                    <Typography color={TypographyColor.MUST_800}
                                type={TypographyType.CAPTION}>
                        - угроза ДТП
                    </Typography>
                </div>
            </div>
            <div className="accident-legend__item">
                <div className="accident-legend__circle accident-legend__circle--accident"/>
                <div className="accident-legend__text">
                    <Typography color={TypographyColor.MUST_800}
                                type={TypographyType.CAPTION}>
                        - ДТП
                    </Typography>
                </div>
            </div>
        </div>
    )
}
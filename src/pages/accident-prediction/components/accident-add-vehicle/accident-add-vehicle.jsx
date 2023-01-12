import React, { memo } from 'react'

import { AddCar } from "../../../../components/add-car";
import { MustBasedTechnology } from '../../../../components/must-based-technology/must-based-technology';
import { Typography, TypographyType } from '../../../../components/typography/Typography';


import './accident-add-vehicle.scss';

export const AccidentAddVehicle = memo(({
    title,
    subTitle
}) => {
    return (
        <div className="accident-add-vehicle">
            <div className="accident-add-vehicle__header">
                <h1 className="accident-add-vehicle__title">
                    <Typography type={TypographyType.h2}>{title}</Typography>
                </h1>
                <div className="accident-add-vehicle__sub-title">{subTitle}</div>
            </div>

            <div className="accident-add-vehicle__add-vehicle">
                <AddCar />
            </div>

            <div className="accident-add-vehicle__technology">
                <MustBasedTechnology />
            </div>
        </div>
    )
});

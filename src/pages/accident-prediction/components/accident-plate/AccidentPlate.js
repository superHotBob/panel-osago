import React, {useMemo} from 'react';
import './accident-plate.scss';
import classNames from 'classnames';
import RusSvg from '../../../../svg/rus.svg'
import {Typography, TypographyType} from "../../../../components/typography/Typography";


export const AccidentPlateSize = {
    S: 'S',
    M: 'M',
    L: 'L'
}

export const AccidentPlateBorderColor = {
    PRIMARY: 'PRIMARY',
    DEFAULT: 'DEFAULT'
}

export const AccidentPlate = ({number, region, size, borderColor = AccidentPlateBorderColor.DEFAULT}) => {

    const sizeModifierClassName = useMemo(() => {
        switch (size) {
            case AccidentPlateSize.S:
                return 'accident-plate--s';
            case AccidentPlateSize.M:
                return 'accident-plate--m';
            case AccidentPlateSize.L:
                return 'accident-plate--l';
        }
    }, [size])

    const borderColorModifierClassName = useMemo(() => {
        if (borderColor === AccidentPlateBorderColor.PRIMARY) {
            return 'accident-plate--primary'
        }
    }, [borderColor])

    const numberTypographyType = useMemo(() => {
        switch (size) {
            case AccidentPlateSize.S:
                return TypographyType.BODY;
            case AccidentPlateSize.M:
                return TypographyType.H5;
            case AccidentPlateSize.L:
                return TypographyType.H4
        }
    }, [size])

    const formattedNumber = useMemo(() => `${number[0]} ${number[1]}${number[2]}${number[3]} ${number[4]}${number[5]}`, [number])

    return (
        <div className={classNames('accident-plate', sizeModifierClassName, borderColorModifierClassName)}>
            <div className="accident-plate__point"/>
            <div className="accident-plate__content">
                <div className="accident-plate__number">
                    <Typography type={numberTypographyType}>
                        {formattedNumber}
                    </Typography>
                </div>
                <div className="accident-plate__region-and-country">
                    <div className="accident-plate__region">
                        <Typography type={TypographyType.SUBHEAD}>
                            {region}
                        </Typography>
                    </div>
                    <RusSvg className="accident-plate__country"/>
                </div>
            </div>
            <div className="accident-plate__point"/>
        </div>
    )
}

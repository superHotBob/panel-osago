import React from 'react';
import {FormGroup} from '../../../../components/form-group/FormGroup';
import {CarNumber} from '../../../../components/car-number/CarNumber';
import {Typography, TypographyColor, TypographyType} from '../../../../components/typography/Typography';

export const AccidentCarInfo = ({info, number, region, numberLabel}) => {
    return (
        <div>
            <FormGroup label={numberLabel}>
                <CarNumber number={number}
                           region={region}
                           inputStyle='black'
                           readonly={true}/>
            </FormGroup>
            <ul className="mustins-info-list accident-page__info-list">
                <li className={"mustins-info-list-item"}>
                    <div className={"mustins-info-list-item__legend"}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Марка ТС
                        </Typography>
                    </div>
                    <div className={"mustins-info-list-item__val"}>
                        <Typography type={TypographyType.BODY}>
                            {info.make}
                        </Typography>
                    </div>
                </li>
                <li className={"mustins-info-list-item"}>
                    <div className={"mustins-info-list-item__legend"}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Модель ТС
                        </Typography>
                    </div>
                    <div className={"mustins-info-list-item__val"}>
                        <Typography type={TypographyType.BODY}>
                            {info.model}
                        </Typography>
                    </div>
                </li>
                <li className={"mustins-info-list-item"}>
                    <div className={"mustins-info-list-item__legend"}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            Год выпуска
                        </Typography>
                    </div>
                    <div className={"mustins-info-list-item__val"}>
                        <Typography type={TypographyType.BODY}>
                            {info.manufacturedOn}
                        </Typography>
                    </div>
                </li>
                {/*<li className={"mustins-info-list-item"}>*/}
                {/*    <div className={"mustins-info-list-item__legend"}>*/}
                {/*        <Typography type={TypographyType.BODY}*/}
                {/*                    color={TypographyColor.GRAY_DARK}>*/}
                {/*            Двигатель*/}
                {/*        </Typography>*/}
                {/*    </div>*/}
                {/*    <div className={"mustins-info-list-item__val"}>*/}
                {/*        <Typography type={TypographyType.BODY}>*/}
                {/*            {info.powerHp} ЛС*/}
                {/*        </Typography>*/}
                {/*    </div>*/}
                {/*</li>*/}
                <li className={"mustins-info-list-item"}>
                    <div className={"mustins-info-list-item__legend"}>
                        <Typography type={TypographyType.BODY}
                                    color={TypographyColor.GRAY_DARK}>
                            VIN номер
                        </Typography>
                    </div>
                    <div className={"mustins-info-list-item__val"}>
                        <Typography type={TypographyType.BODY}>
                            {info.vin}
                        </Typography>
                    </div>
                </li>
            </ul>
        </div>
    )
}
import React from 'react';
import './accident-flow-filled.scss';
import {Typography, TypographyType} from '../../../../../../components/typography/Typography';
import {Button} from '../../../../../../components/button/Button';
import {setStepAction} from '../../AccidentFlowModel';
import {useDispatch} from 'react-redux';

export const AccidentFlowFilled = () => {

    const dispatch = useDispatch();

    const handleFinishClick = () => {
        dispatch(setStepAction(null))
        location='/';
        //Очищать поля
    }
    return (
        <div className="accident-flow-finish">
            <Typography type={TypographyType.H5}>
                Спасибо, что заботишься <br/>
                о снижении аварийности!
            </Typography>
            <Button onClick={handleFinishClick}
                    className="mustins-mt-40">
                Проверить другое авто
            </Button>
        </div>
    )
}
import React from 'react';
import './accident-flow-initial.scss';
import {Typography, TypographyType} from '../../../../../../components/typography/Typography';
import {Button} from '../../../../../../components/button/Button';
import {useDispatch} from 'react-redux';
import {goToNextStepAction} from '../../AccidentFlowModel';

export const AccidentFlowInitial = () => {

    const dispatch = useDispatch();

    const handleProceedClick = () => {
        dispatch(goToNextStepAction())
    }

    return (
        <div className="accident-flow-initial">
            <Typography type={TypographyType.H5}>
                Пройди регистрацию,
                чтобы получить полный доступ
            </Typography>
            <Button onClick={handleProceedClick}
                    className="mustins-mt-40">
                Пройти регистрацию
            </Button>
        </div>
    )
}
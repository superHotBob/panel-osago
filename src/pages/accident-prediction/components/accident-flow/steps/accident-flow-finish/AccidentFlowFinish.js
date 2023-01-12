import React from 'react';
import './accident-flow-finish.scss';
import {Typography, TypographyType} from '../../../../../../components/typography/Typography';
import {Button} from '../../../../../../components/button/Button';
import {setStepAction} from '../../AccidentFlowModel';
import {useDispatch} from 'react-redux';

export const AccidentFlowFinish = () => {

    const dispatch = useDispatch();

    const handleFinishClick = () => {
        dispatch(setStepAction(null))
    }
    return (
        <div className="accident-flow-finish">
            <Typography type={TypographyType.H5}>
                В течение 24 часов я пришлю <br/>
                тебе инструкцию по снижению <br/>
                аварийности на email
            </Typography>
            <Button onClick={handleFinishClick}
                    className="mustins-mt-40">
                Спасибо, ожидаю
            </Button>
        </div>
    )
}
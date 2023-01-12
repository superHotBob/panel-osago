import React from 'react';
import Radio from '../../../../../../components/radio';
import map from 'lodash/map';
import {useDispatch, useSelector} from 'react-redux';
import {goToNextStepAction, selectClientType, sendClientTypeAction, setClientTypeAction} from '../../AccidentFlowModel';
import {Button} from '../../../../../../components/button/Button';


const types = [
    {value: 'vehicleOwner', label: 'Я Владелец Грузовика'},
    {value: 'vehicleRenter', label: 'Арендую Грузовик'},
    {value: 'vehicleDriver', label: 'Я Водитель'},
    {value: 'other', label: 'Другое'},
    {value: 'justCurious', label: 'Просто Любопытно'},
]

export const AccidentFlowClassification = () => {

    const dispatch = useDispatch();
    const clientType = useSelector(selectClientType)

    const handleChangeClientType = (type) => {
        dispatch(setClientTypeAction(type));
    }

    const handleProceedClick = () => {
        dispatch(goToNextStepAction());
        dispatch(sendClientTypeAction());
    }

    return (
        <div>
            {map(types, ({value, label}) => {
                return (
                    <Radio label={label}
                           name={value}
                           key={value}
                           checked={value === clientType}
                           onChange={() => handleChangeClientType(value)}/>
                )
            })}
            <Button onClick={handleProceedClick}
                    disabled={!clientType}
                    className="mustins-mt-40">
                Дальше
            </Button>
        </div>
    )
}
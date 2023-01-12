import React, {useEffect} from 'react';
import {Modal} from '../../../../components/modal/Modal';
import {useDispatch, useSelector} from 'react-redux';
import {AccidentFlowStepDescription, selectLoading, selectStep, setStepAction} from './AccidentFlowModel';

export const AccidentFlow = () => {

    const dispatch = useDispatch();
    const step = useSelector(selectStep);
    const loading = useSelector(selectLoading);

    if (!step) {
        return null;
    }

    const {title, Component} = AccidentFlowStepDescription[step];

    const handleClose = () => {
        dispatch(setStepAction(null));
    }

    return (
        <Modal isOpened={true}
               loading={loading}
               onClose={handleClose}
               title={title}>
            <Component/>
        </Modal>
    )
}
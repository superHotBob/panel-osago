import React, {useMemo} from 'react';
import {Modal} from "../modal/Modal";
import useEffectWithSkipDidMount from "../../hooks/useEffectWithSkipDidMount";

const maskPhoneNumber = (number = '') => `+7(${number.substr(0, 3)})***-**-${number.substr(8, 2)}`

const AuthModal = ({children, isOpened, titles, currentStep, phoneNumber, onClose, initialStep, loading, resetToInitialStepAfterClosed, setCurrentStep}) => {

    const texts = useMemo(() => {
        const currentTitle = titles[currentStep]

        return {
            title: typeof currentTitle === 'function' ? currentTitle(phoneNumber) : currentTitle
        }
    }, [currentStep || initialStep, phoneNumber])

    useEffectWithSkipDidMount(() => {
        if (!isOpened && resetToInitialStepAfterClosed) {
            setCurrentStep(initialStep)
        }
    }, [isOpened])

    return (
        <Modal
            isOpened={isOpened}
            title={texts.title}
            description={texts.description}
            onClose={onClose}
            loading={loading}
        >
            {children}
        </Modal>
    );
};

AuthModal.defaultProps = {
    titles: {
        login: <span>Введи телефон, чтобы <br/>войти в свой личный кабинет</span>,
        registration: <span>Зарегистрируйся и получи доступ <br /> в личный кабинет,чтобы Cнизить <br/> Аварийность для своего автопарка</span>,
        sms: phoneNumber => (
            <span>Подтверди номер телефона.<br/> Отправил СМС с кодом на номер <br />{maskPhoneNumber(phoneNumber)}</span>
        )
    },
    initialStep: 'login',
}

export default AuthModal;

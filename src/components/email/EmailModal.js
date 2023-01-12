import React, { useCallback, useMemo, useState } from 'react';
import { Modal } from "../modal/Modal";
import { Button } from "../button/Button";
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authReducer';
import api from "../../api";

import "./email-modal.scss";

const EmailModal = props => {
    const {
        isOpened,
        titles,
        descriptions,
        buttons,
        currentStep,
        onClose,
        history,
        showLogin
    } = props;
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectAuthUser);
    const texts = useMemo(() => ({
        title: titles[currentStep],
        description: descriptions[currentStep],
        button: buttons[currentStep]
    }), [currentStep]);

    const handleClick = async () => {
        history.push('/');
        setLoading(true);

        switch (currentStep) {
            case 'verified': {
                setLoading(false);
                onClose();
                break;
            };
            case 'failed': {
                const status = await api('/profile/email-verification', 'POST');

                if (status.status === 200) {
                    setLoading(false);
                    setTimeout(onClose, 250);
                }
                break;
            };
        }
    };

    const showLoginModal = useCallback(() => {
        showLogin();
        onClose();
    }, [showLogin, onClose]);

    return (
        <Modal
            status={currentStep}
            isOpened={isOpened}
            title={texts.title}
            onClose={onClose}
            loading={false}
            color={currentStep === 'verified' ? "primary" : "yellow"}
        >
            <p className="email-modal-text">{texts.description}</p>
            <div className="email-button-container">
                {currentStep === 'verified' || user ? (
                    <Button loading={loading} onClick={handleClick}>{texts.button}</Button>
                ) : (
                    <Button onClick={showLoginModal}>Войти</Button>
                )}
            </div>
        </Modal>
    );
};

EmailModal.defaultProps = {
    titles: {
        verified: <span>Так держать!<br />Я подтвердил твою почту</span>,
        failed: <span>Что-то пошло не так...<br />Мне не удалось подтвердить твою почту</span>,
    },
    descriptions: {
        verified: <span>В течение 24 часов я пришлю тебе инструкцию по снижению аварийности на email </span>,
        failed: <span>Ссылка для подтверждения твоей почты устарела или содержит ошибки</span>,
    },
    buttons: {
        verified: "Спасибо, ожидаю",
        failed: "Получить новую ссылку",
    }
}

export default EmailModal;

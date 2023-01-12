import React, {useMemo} from 'react';
import {Button} from "../../../../components/button/Button";
import {Typography, TypographyType, TypographyWeight} from "../../../../components/typography/Typography";
import {className} from "../../../../utils/class-helper";
import {Modal} from "../../../../components/modal/Modal";
import ShturmanUnhappySvg from "../../../../svg/shturman-unhappy.svg";

export const AccidentErrorModal = ({onClose, errorCode, shown}) => {
    const errorCodeText = useMemo(() => {
        switch (errorCode) {
            case 1102:
            case 1103:
            case 1204:
                return (
                    <Typography type={TypographyType.H5}
                                weight={TypographyWeight.REGULAR}>
                        <span>Наш сервис создан специально<br/>для Владельцев Грузовиков<br/>и коммерческой техники!</span>
                    </Typography>
                )
            case 1201:
            case 1202:
            case 1203:
            case 1301:
                return (
                    <Typography type={TypographyType.H5}
                                weight={TypographyWeight.REGULAR}>
                        <span>Попробуй сделать расчет<br/>для другого автомобиля</span>
                    </Typography>
                )
            default:
                return (
                    <Typography type={TypographyType.H5}
                                weight={TypographyWeight.REGULAR}>
                        <span>Попробуй сделать расчет <br/>для другого автомобиля</span>
                    </Typography>
                )
        }
    }, [errorCode])


    const errorColor = useMemo(() => {
        switch (errorCode) {
            case 1102:
            case 1103:
            case 1204:
                return 'yellow';
            case 1201:
            case 1202:
            case 1203:
            case 1301:
                return 'red';
            default:
                return 'red';
        }
    }, [errorCode])

    const errorTitle = useMemo(() => {
        switch (errorCode) {
            case 1102:
            case 1103:
            case 1204:
                return <span>Кажется я нашел  несоответствия...<br/>гос.номер содержит ошибки или<br/>принадлежит легковому автомобилю</span>;
            case 1201:
            case 1202:
            case 1203:
            case 1301:
                return <span>Расчет Вероятность ДТП <br/>для данного транспортного средства<br/>на данный момент не доступен...</span>;
            default:
                return <span>Расчет Вероятность ДТП <br/>для данного транспортного средства<br/>на данный момент не доступен...</span>;
        }
    }, [errorCode])

    const handleCheckAnotherClick = () => {
        location = '/';
    }

    return (

        <Modal
            isOpened={shown}
            SvgIcon={ShturmanUnhappySvg}
            color={errorColor}
            title={errorTitle}
            onClose={onClose}>
            <div {...className(['modal__description', 'tc'])}>
                {errorCodeText}
            </div>
            <div {...className('form-row-submit')}>
                <Button onClick={handleCheckAnotherClick}
                        buttonType='upper'>
                    Ввести другой номер
                </Button>
            </div>
        </Modal>
    );
};

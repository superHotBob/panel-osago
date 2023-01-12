import React, {useMemo} from 'react';
import {className} from "../../utils/class-helper";
import {Button} from "../button/Button";
import {useSelector} from "react-redux";
import {
    moveNext,
    resetNumberAction,
    resetWizardAction,
    selectOsagoWizardById,
} from "../../redux/osagoWizardReducer";
import useWidgetId from "../../hooks/useWidgetId";
import {Typography, TypographyColor, TypographyType, TypographyWeight} from "../typography/Typography";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../modules/tracking";

const PrescoringErrorStep = () => {
    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {prescoringErrorCode} = useSelector(selector)

    const errorCodeText = useMemo(() => {
        trackEvent(TrackingEventName.SCREEN_ERROR_LOADED, {
            code: prescoringErrorCode
        })
        switch (prescoringErrorCode) {
            case 1102:
            case 1103:
            case 1201:
            case 1203:
            case 1204:
            case 1208:
            case 1406:
            case 1415:
                trackPartnerEvent(PartnerEventName.STEP_ERROR1)
                return (
                    <Typography type={TypographyType.H5}>
                        <span>
                            Наш сервис создан<br/>
                        специально для грузовиков<br/>
                        и коммерческой техники!
                        </span>
                    </Typography>
                )
            case 1202:
            case 1301:
            case 1401:
            case 1901:
                trackPartnerEvent(PartnerEventName.STEP_ERROR2)
                return (
                    <Typography type={TypographyType.H5}>
                        <span>Попробуй сделать расчет <br/>для другого автомобиля</span>
                    </Typography>
                )
            case 1206:
            case 1207:
                trackPartnerEvent(PartnerEventName.STEP_ERROR2)
                return (
                    <>
                        <div className="mustins-mb-12">
                            <Typography  color={TypographyColor.MUST_800}
                                         type={TypographyType.CAPTION}>
                                <span>Я скоро начну оформлять полисы <br/>для ИП и Физических лиц</span>
                            </Typography>
                        </div>
                        <Typography type={TypographyType.H5}>
                            <span>Попробуй сделать расчет <br/>для другого автомобиля</span>
                        </Typography>
                    </>
                )
            case 1407:
            case 1408:
            case 1409:
            case 1410:
            case 1411:
            case 1412:
            case 1413:
            case 1420:
                trackPartnerEvent(PartnerEventName.STEP_ERROR2)
                return (
                    <Typography type={TypographyType.H5}>
                        <span>Попробуй сделать расчет <br/>для другого автомобиля</span>
                    </Typography>
                )
            default:
                trackPartnerEvent(PartnerEventName.STEP_ERROR2)
                return (
                    <Typography type={TypographyType.H5}>
                        <span>Попробуй сделать расчет <br/>для другого автомобиля</span>
                    </Typography>
                )
        }
    }, [prescoringErrorCode])

    const onSubmit = () => {
        dispatchWidgetAction(resetWizardAction())
        dispatchWidgetAction(resetNumberAction())
        dispatchWidgetAction(moveNext())
        trackEvent(TrackingEventName.SCREEN_ERROR_TRYAGAIN)
    }

    return (
        <>
            <div {...className(['modal__description', 'tc'])}>
                {errorCodeText}
            </div>
            <div {...className('form-row-submit')}>
                <Button onClick={onSubmit} buttonType='upper'>
                    Ввести другой номер
                </Button>
            </div>
        </>
    );
};

export default PrescoringErrorStep;

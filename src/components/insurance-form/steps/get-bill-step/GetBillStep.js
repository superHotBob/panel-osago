import './get-bill-step.scss'
import React, {useCallback, useEffect} from 'react';
import {Typography, TypographyColor, TypographyType, TypographyWeight} from "../../../typography/Typography";
import {Email} from "../../../email/Email";
import {FormGroup} from "../../../form-group/FormGroup";
import {PhoneNumber} from "../../../phone-number/PhoneNumber";
import {Button} from "../../../button/Button";
import useWidgetId from "../../../../hooks/useWidgetId";
import {useSelector} from "react-redux";
import {moveNext, selectOsagoWizardById,} from "../../../../redux/osagoWizardReducer";
import {endLoadingAction, selectLoadingById, startLoadingAction} from "../../../../redux/loadingReducer";
import downloadApiGet from "../../../../api/requests/downloadApiGet";
import FileSaver from 'file-saver'
import sendBillApiPost from "../../../../api/requests/sendBillApiPost";
import {withFormHook} from "../../../../hoc/withFormHook";
import {emailValidator, phoneValidator} from "../../../../validators";
import {PartnerEventName, trackEvent, TrackingEventName, trackPartnerEvent} from "../../../../modules/tracking";

const LOADING_ACTION = 'AWAIT_BILL_DOWNLOAD'

const GetBillStep = ({errors, register, setValueAndClearError, getValues, handleSubmit}) => {
    const {selector, dispatchWidgetAction} = useWidgetId(selectOsagoWizardById)
    const {scoringId, paymentInvoiceDownloadKey, contractData} = useSelector(selector)
    const [dispatchWidgetLoadingAction, selectorLoading] = useWidgetId(selectLoadingById)
    const loading = useSelector(selectorLoading)
    const {email = '', phone = ''} = getValues()

    const downloadBill = useCallback(async () => {
        trackEvent(TrackingEventName.SCREEN_INVOICE_DOWNLOAD)
        dispatchWidgetLoadingAction(startLoadingAction(LOADING_ACTION))
        const res = await downloadApiGet(paymentInvoiceDownloadKey)
        const blob = new Blob([res.data], {type: "application/pdf"});
        dispatchWidgetLoadingAction(endLoadingAction(LOADING_ACTION))
        FileSaver.saveAs(blob, "Счет.pdf");
    }, [paymentInvoiceDownloadKey])

    const sendBill = useCallback(async () => {
        trackEvent(TrackingEventName.SCREEN_INVOICE_SUBMIT)
        dispatchWidgetAction(moveNext())
        const data = {};
        if (phone) {
            data.phone = '+7' + phone;
        }
        if (email) {
            data.email = email;
        }
        await sendBillApiPost(scoringId, data)
    }, [scoringId, phone, email])

    const setPhone = useCallback(phone => {
        setValueAndClearError('phone', phone)
    }, [])

    const setEmail = useCallback(email => {
        setValueAndClearError('email', email)
    }, [])

    useEffect(() => {
        register(...phoneValidator('phone', false))
        register(...emailValidator('email', false))
        trackEvent(TrackingEventName.SCREEN_INVOICE_LOADED)
        trackPartnerEvent(PartnerEventName.STEP_9_INVOICE)
    }, [])

    return (
        <div className='get-bill-step'>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.CAPTION} weight={TypographyWeight.BOLD}>
                    Транспортное средство для<br/> которого нужно оформить полис ОСАГО:
                </Typography>
            </div>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.CAPTION} weight={TypographyWeight.BOLD}>
                    Данные ТС
                </Typography>
            </div>
            <table className='get-bill-step__table mustins-mb-16'>
                <tbody>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Госномер ТС
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['vehicle.plates'].value}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            VIN
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['vehicle.vin'].value}
                        </Typography>
                    </td>
                </tr>
                </tbody>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Марка
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['vehicle.make'].value}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Модель
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['vehicle.model'].value}
                        </Typography>
                    </td>
                </tr>
            </table>
            <div className='mustins-mb-28'>
                <Typography type={TypographyType.CAPTION} weight={TypographyWeight.BOLD}>
                    Организация
                </Typography>
            </div>
            <table className='get-bill-step__table mustins-mb-28'>
                <tbody>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            ИНН
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['insurer.legalEntity'].value.inn}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            КПП
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['insurer.legalEntity.kpp'].value}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Название
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['insurer.legalEntity.title'].value}
                        </Typography>
                    </td>
                </tr>
                <tr>
                    <td className='get-bill-step__table-key mustins-pb-12'>
                        <Typography color={TypographyColor.GRAY_DARK} type={TypographyType.BODY}>
                            Юридический адрес
                        </Typography>
                    </td>
                    <td className='get-bill-step__table-value mustins-pb-12'>
                        <Typography type={TypographyType.BODY}>
                            {contractData['insurer.legalEntity.legalAddress'].value.fullAddress}
                        </Typography>
                    </td>
                </tr>
                </tbody>
            </table>
            <FormGroup label='Отправить счет Бухгалтеру на почту:' error={errors.email}>
                <Email
                    email={email}
                    onEmailChange={setEmail}
                    onEnter={() => {
                    }}
                    onBlur={() => trackEvent(TrackingEventName.SCREEN_INVOICE_PUTIN, {type: 'buhEmail'})}
                />
            </FormGroup>
            <FormGroup label='Отправить ссылку счета на телефон:' error={errors.phone}>
                <PhoneNumber
                    onNumberChange={setPhone}
                    number={phone}
                    onBlur={() => trackEvent(TrackingEventName.SCREEN_INVOICE_PUTIN, {type: 'phone'})}
                />
            </FormGroup>
            <div className='mustins-mt-24'>
                <Button
                    buttonType='upper'
                    onClick={handleSubmit(sendBill)}>
                    Отправить счет
                </Button>
            </div>
            {/*<div className='mustins-mt-24'>*/}
            {/*    <Button*/}
            {/*        icon='download'*/}
            {/*        buttonType='hollow'*/}
            {/*        loading={loading[LOADING_ACTION]}*/}
            {/*        onClick={downloadBill}>*/}
            {/*        скачать счет*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    );
};

export default withFormHook(GetBillStep);

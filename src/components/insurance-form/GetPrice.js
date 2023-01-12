import React, {useEffect, useRef, useState} from 'react';

import {CarNumber} from '/components/car-number/CarNumber'
import {Button} from '/components/button/Button'
import {BemHelper, className} from "/utils/class-helper";

import './get-price.scss'
import {withFormHook} from "../../hoc/withFormHook";
import {carNumberValidator, phoneValidator, vinValidator} from "../../validators";
import {FormGroup} from "../form-group/FormGroup";
import {Tabs} from "../tabs/Tabs";
import {Tab} from "../tabs/Tab";
import {VinInput} from "../vin-input/VinInput";
import useWidgetId from "../../hooks/useWidgetId";
import {selectOsagoWizardById, setNumberTypeAction, setPhoneNumberAction} from "../../redux/osagoWizardReducer";
import {useSelector} from "react-redux";
import {OSAGO_NUMBER_TYPE_GOV, OSAGO_NUMBER_TYPE_VIN} from "../../constants/osago";
import {trackEvent, TrackingEventName} from "../../modules/tracking";
import {PhoneNumber} from "../phone-number/PhoneNumber";
import {selectAuthIsLoggedIn} from "../../redux/authReducer";
import size from 'lodash/size';

const GetPriceComponent = ({
                               toggleModal,
                               onCarNumberChange,
                               onCarVinChange,
                               children,
                               region,
                               number,
                               fullNumber,
                               vin,
                               register,
                               unregister,
                               handleSubmit,
                               isFormValid,
                               setValueAndClearError,
                               errors,
                               showPhoneInput
                           }) => {
    const carNumberRef = useRef(null)
    const classes = new BemHelper({name: 'get-price'});

    const [vinError, setVinError] = useState(null)
    const [carNumberError, setCarNumberError] = useState(null)
    const [viewed, setViewed] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')

    const {dispatchWidgetAction, selector} = useWidgetId(selectOsagoWizardById)
    const {numberType} = useSelector(selector)
    const isLoggedIn = useSelector(selectAuthIsLoggedIn)

    const handleEnterPress = async (data, evt) => {
        if (!isFormValid()) {
            return
        }
        trackEvent(
            TrackingEventName.SCREEN_GETNUMBER_SUBMIT,
            {
                type: numberType === OSAGO_NUMBER_TYPE_GOV ? 'gov' : 'vin'
            }
        )
        toggleModal(evt);
    };

    const onTabChange = tab => {
        dispatchWidgetAction(setNumberTypeAction(tab))

        if (tab === OSAGO_NUMBER_TYPE_GOV) {
            register(...carNumberValidator('fullNumber'))
            unregister('vin')
            setValueAndClearError('fullNumber', fullNumber)
            return
        }
        register(...vinValidator('vin'))
        setValueAndClearError('vin', vin)
        unregister('fullNumber')
    }

    const onTabClick = tabKey => {
        trackEvent(
            TrackingEventName.SCREEN_GETNUMBER_SELECTED,
            {
                type: tabKey === OSAGO_NUMBER_TYPE_GOV ? 'gov' : 'vin'
            }
        )
    }

    const onNumberChange = number => {
        onCarNumberChange(number, region)
    }

    const onRegionChange = region => {
        onCarNumberChange(number, region)
    }

    const onVinChange = vin => {
        onCarVinChange(vin)
    }

    const handleBlurPhoneInput = () => {
        dispatchWidgetAction(setPhoneNumberAction(phoneNumber))
    }

    const onPhoneNumberChange = (phoneNumber) => {
        setValueAndClearError('phone', phoneNumber);
        if(phoneNumber && size(phoneNumber) === 10){
            trackEvent(TrackingEventName.SCREEN_GETNUMBER_PUTIN, {
                type: 'phone'
            });
        }
        setPhoneNumber(phoneNumber);
    }

    useEffect(() => {
        if (showPhoneInput && !isLoggedIn) {
            register(...phoneValidator('phone'))
        } else {
            unregister('phone')
        }

    }, [showPhoneInput, isLoggedIn])

    return (
        <div {...classes()}>
            <div {...classes('car-number')} ref={carNumberRef}>
                {
                    numberType &&
                    <Tabs onTabChange={onTabChange} active={numberType} onTabClick={onTabClick}>
                        <Tab title='Гос. номер' tabKey={OSAGO_NUMBER_TYPE_GOV}>
                            <FormGroup error={errors.fullNumber || carNumberError}>
                                <CarNumber number={number}
                                           region={region}
                                           inputStyle='black'
                                           error={errors.fullNumber}
                                           onError={setCarNumberError}
                                           onNumberChange={onNumberChange}
                                           onRegionChange={onRegionChange}
                                           onEnterPress={handleSubmit(handleEnterPress)}
                                           readonly={false}/>
                            </FormGroup>
                        </Tab>
                        <Tab title='VIN-номер' tabKey={OSAGO_NUMBER_TYPE_VIN}>
                            <div {...className(['get-price__vin-input'])}>
                                <FormGroup error={errors.vin || vinError}>
                                    <VinInput
                                        value={vin}
                                        inputStyle='black'
                                        onError={setVinError}
                                        onEnterPress={handleSubmit(handleEnterPress)}
                                        onChange={onVinChange}/>
                                </FormGroup>
                            </div>
                        </Tab>
                    </Tabs>
                }

            </div>
            {showPhoneInput && !isLoggedIn && <div {...className(['mt-12', 'get-price__phone-input'])}>
                <FormGroup error={errors.phone}>
                    <PhoneNumber
                        onNumberChange={onPhoneNumberChange}
                        number={phoneNumber}
                        onBlur={handleBlurPhoneInput}
                    />
                </FormGroup>
            </div>}
            {children}
            <div {...classes('car-submit')}>
                <Button {...classes('button')} size='big' buttonType='upper' onClick={handleSubmit(handleEnterPress)}>
                    Узнать цену
                </Button>
            </div>
        </div>
    )
}

const GetPrice = withFormHook(GetPriceComponent, ['fullNumber', 'vin'])

export {GetPrice}

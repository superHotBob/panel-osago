import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Modal } from "src/components/modal/Modal";
import { BemHelper } from "src/utils/class-helper";
import { withFormHook } from "src/hoc/withFormHook";
import { Button } from "src/components/button/Button";
import { nameValidator, phoneValidator } from "src/validators";
import { FormGroup } from "src/components/form-group/FormGroup";
import { GlobalAlert } from "src/components/global-alert/global-alert";
import { PhoneNumber } from "src/components/phone-number/PhoneNumber";
import { AddTrack, CustomEventName, tracking, trackingReachGoal } from "src/modules/tracking";

import useApiWithWidgetId from "../../../hooks/useApiWithWidgetId";
import { leadPhoneAction } from "./phoneWidgetActions";

import "./subscriptions-form.scss";

// Classes
const classes = new BemHelper({ name: "subscriptions-form" });

// Components
export const SubscriptionsForm = withFormHook(
    ({ register, handleSubmit, setValueAndClearError, isFormValid, errors }) => {
        const dispatch = useDispatch();

        const [phone, setPhone] = useState("");
        const [name, setName] = useState("");
        const [loading, setLoading] = useState(false);

        const phoneInput = useRef(null);
        const refAlert = useRef(null);

        useEffect(() => {
            register(...phoneValidator());
            register(...nameValidator("subscriptionName", "Имя"));
        }, []);

        const leadPhoneWrappedAction = useApiWithWidgetId(leadPhoneAction);

        const handlePhoneChange = (value) => {
            setPhone(value);
            setValueAndClearError("phone", value);
        };

        const handleNameChange = (value) => {
            setName(value);
            setValueAndClearError("subscriptionName", value);
        };

        const handleClick = async () => {
            if (!isFormValid() && phoneInput.current) {
                phoneInput.current.getInputDOMNode().focus();
                return;
            }

            await leadPhone();
            AddTrack(CustomEventName.SEND_SPECIAL_CONDS);
        };

        const leadPhone = async () => {
            setLoading(true);
            const leadPhoneSuccess = await dispatch(
                leadPhoneWrappedAction({
                    source: 'site=accident.mustins.ru',
                    phone: `+7${phone}`,
                    name: name
                })
            );

            trackingReachGoal(tracking.osagoCallbackValid);

            if (leadPhoneSuccess) {
                handleNameChange('');
                handlePhoneChange('');
            }
        };

        const showModal = useCallback(() => {
            return (
                loading && (
                    <Modal
                        isOpened={loading}
                        title={"Я уже передал твой запрос оператору, он позвонит в ближайшее время"}
                        onClose={() => setLoading(false)}
                    >
                        <Button onClick={() => setLoading(false)}>ЖДУ ЗВОНКА</Button>
                    </Modal>
                )
            );
        }, [loading]);

        return (
            <>
                <div {...classes()}>
                    <div {...classes("container")}>
                        <GlobalAlert ref={refAlert} />
                        <div {...classes("wrapper")}>
                            <h2 {...classes("title")}>
                                Специальные условия
                                <br {...classes("titleBreak")} /> для парков от 20 ТС
                            </h2>
                            <h2 {...classes("subtitle")}>
                                Оставь свои контактные данные, чтобы получить специальное предложение для корпоративных
                                клиентов
                            </h2>
                            <div {...classes("content")}>
                                <FormGroup label={"Как обращаться?"} error={errors.subscriptionName}>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="mustins-input"
                                        placeholder="Имя"
                                        name="subscriptionName"
                                    />
                                </FormGroup>
                                <FormGroup label={"Телефон"} error={errors.phone}>
                                    <PhoneNumber
                                        onNumberChange={handlePhoneChange}
                                        onEnter={handleSubmit(handleClick)}
                                        number={phone}
                                    />
                                </FormGroup>
                                <Button
                                    disabled={loading}
                                    loading={loading}
                                    onClick={handleSubmit(handleClick)}
                                    landing={true}
                                    {...classes("button")}
                                >
                                    Отправить
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal()}
            </>
        );
    }
);

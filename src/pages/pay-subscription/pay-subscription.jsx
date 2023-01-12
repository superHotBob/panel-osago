import React, { useEffect, useState, useRef } from "react";
import { PUBLICK_ID_TEST, PUBLICK_ID_PROD } from "../../constants/payments";
import { withWidgetId } from '../../hoc/withWidgetId';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authReducer';
import { getToken } from "../../modules/auth";
import { SUBSCRIPTION_TARIFFS } from "../../constants/osago";
import { Number, Cvc, Expiration } from 'react-credit-card-primitives';
import { Button } from '../../components/button/Button';
import { GlobalAlert } from '../../components/global-alert/global-alert';
import { Sprite } from '../../components/sprite/Sprite';
import { getDomainForCookies } from "../../utils/getDomainForCookies";

import cn from 'classnames';
import "./style.scss";
import api from "../../api";
import paySystemsPng from '../../assets/images/pay-systems.png'
import withWidgetAuth from "../../hoc/withWidgetAuth";

const paySubscription = (props) => {
    const formPay = useRef(null),
        framePay = useRef(null),
        alertRef = useRef(null),
        //values
        [count, setCount] = useState(0),
        [price, setPrice] = useState(0),
        [planId, setPlanId] = useState(0),

        [currency] = useState("RUB"),
        [cardNumber, setCardNumber] = useState(''),
        [expDateMonth, setMounth] = useState(''),
        [expDateYear, setYear] = useState(''),
        [name, setCardName] = useState(''),
        [CVV, setCVV] = useState(''),
        [submitted, setSubmitted] = useState(false),
        [checkout, setCheckout] = useState(),
        generateCryptogram = async () => {
            let description = 'must';
            let result = checkout.createCryptogramPacket();

            if (result.success) {
                let crypto = result.packet;

                let model = {
                    name: name,
                    crypto: crypto,
                    amount: price,
                    currency: currency,
                    description: description
                };

                let json = JSON.stringify(model);

                sendTomustApp(json);
            }
            else {
                for (var msgName in result.messages) {
                    alertRef.current.showAlert(result.messages[msgName]);
                }
            }
        },
        createFrame = (res) => {
            let iframe = document.createElement('iframe');
            iframe.id = "threeds";
            iframe.className = "payment-iframe";
            iframe.width = "100%";
            iframe.height = "630px";
            document.querySelector("#result").appendChild(iframe);

            let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            iframeDoc.open();
            iframeDoc.write('<form method="POST" action="' + res.acsUrl + '">' +
                '<input type="hidden" name="MD" value="' + res.md + '" />' +
                '<input type="hidden" name="PaReq" value="' + res.paReq + '" />' +
                '<input type="hidden" name="TermUrl" value="' + res.termUrl + '" />' +
                '</form>');
            iframeDoc.querySelector("form").submit()
            iframeDoc.close();
        },
        sendTomustApp = async (json) => {
            const model = JSON.parse(json),
                body = {
                    vehicleCount: count,
                    planId: planId,
                    chargeCrypto: model
                },
                response = await api(`/subscription/create`, "POST", body);

            if (response.status === 200) {
                const res = await response.json();

                if (res.success) {
                    window.location.href = '/subscriptions';
                }
                else if (res.acsUrl && res.paReq) {
                    createFrame(res);

                    framePay.current.style.display = "block";
                    formPay.current.style.display = "none";

                    window.addEventListener('message', function (event) {
                        let model = event.data;

                        if (model.success === true || model.success === false) {
                            if (model.success) {
                                alertRef.current.showAlert('Оплата прошла успешно');
                                setTimeout(() => window.location.href = "/subscriptions", 1000);
                            } else {
                                alertRef.current.showAlert('Ошибка оплаты через 3DS - см логи сервера');
                            }
                            window.localStorage.removeItem("osago-pay");
                        }
                    });
                } else {
                    alertRef.current.showAlert('Произошла ошибка');
                }
            }
        },
        init = (callback) => {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://widget.cloudpayments.ru/bundles/checkout';
            document.body.appendChild(script);
            script.onload = () => {
                if (callback) callback();
            };
        },
        handleExpiration = (month, year, valid) => {
            if (!valid) {
                return;
            }
            setMounth(month);
            setYear(year);
        },
        submitForm = (e) => {
            e.preventDefault();
            setSubmitted(true)
            if (
                !cardNumber ||
                !CVV ||
                !expDateMonth ||
                !expDateYear
            ) {
                return;
            }
            generateCryptogram();
            e.stopPropagation();
            return false;
        },
        checkProd = () => {
            const firstLevelDomain = getDomainForCookies();
            const domain = document.domain;
            if (!firstLevelDomain ||
                firstLevelDomain === 'tilda.ws' ||
                domain === 'osago-k8s-test.stage.mustins.ru') {
                return PUBLICK_ID_TEST;
            } else {
                return PUBLICK_ID_PROD;
            }
        };

    useEffect(async () => {
        window.scrollTo({ top: 0 });
        const data = window.localStorage.getItem('osago-pay'),
            { count, planId, price } = JSON.parse(data),
            newPrice = price * count;

        setPrice(newPrice);
        setCount(count);
        setPlanId(planId);
        init(() => {
            const c = new cp.Checkout(checkProd(), document.getElementById("mobile-form"));
            setCheckout(c);
        });
    }, []);

    return (
        <div className="payFlow">
            <GlobalAlert ref={alertRef} />
            <h1 className="payFlow__title">Оплата подписки</h1>
            <div className="payFlow__body">
                <div className="payFlow__fieldset payFlow__details">
                    <div className="payFlow__row">
                        <div className="payFlow__details__ttl payFlow__col">Тариф</div>
                        <div className="payFlow__col">{SUBSCRIPTION_TARIFFS[planId]}</div>
                    </div>
                    <div className="payFlow__row">
                        <div className="payFlow__details__ttl payFlow__col">Стоимость</div>
                        <div className="payFlow__col">{parseInt(price / count, 10)} {currency} в мес.</div>
                    </div>
                    <div className="payFlow__row">
                        <div className="payFlow__details__ttl payFlow__col">Кол-во авто</div>
                        <div className="payFlow__col">{count} авто</div>
                    </div>
                    <div className="payFlow__row">
                        <div className="payFlow__details__ttl payFlow__col">Итого</div>
                        <div className="payFlow__col">{price} {currency}</div>
                    </div>
                </div>
                <div className="payFlow__fieldset">
                    <div className="payment" id="result" ref={framePay}></div>

                    <form className="payment" id="mobile-form" onSubmit={submitForm} ref={formPay}>

                        <Number
                            onChange={({ value, valid }) => valid && setCardNumber(value)}
                            render={({
                                getInputProps,
                                valid
                            }) => (
                                <div className={
                                    cn('payFlow__group mustins-form-row', { 'mustins-form-row--error': !valid && submitted })
                                }>
                                    <label className="payFlow__label">Номер карты</label>
                                    <input
                                        required
                                        {...getInputProps()}
                                        placeholder="1111 1111 1111 1111"
                                        className="payFlow__input mustins-input"
                                    />
                                </div>
                            )}
                        />

                        <div className="payFlow__group payFlow__row">

                            <div className="payFlow__col">
                                <Expiration
                                    onChange={({ month, year, valid }) => handleExpiration(month, year, valid)}
                                    render={({
                                        getInputProps,
                                        valid,
                                        error
                                    }) => (
                                        <div className={
                                            cn('payFlow__group mb-0 mustins-form-row', { 'mustins-form-row--error': !valid && submitted })
                                        }>
                                            <label className="payFlow__label">Месяц</label>
                                            <input
                                                required
                                                {...getInputProps()}
                                                placeholder="ММ / ГГГГ"
                                                className="payFlow__input mustins-input"
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="payFlow__col">
                                <Cvc
                                    onChange={({ value, valid }) => valid && setCVV(value)}
                                    render={({ getInputProps, value, valid }) => (
                                        <div className={
                                            cn('payFlow__group mb-0 mustins-form-row', { 'mustins-form-row--error': !valid && submitted })
                                        }>
                                            <label className="payFlow__label">CVV</label>
                                            <input
                                                {...getInputProps()}
                                                placeholder="***"
                                                type="password"
                                                className="payFlow__input mustins-input"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className={
                            cn('payFlow__group mustins-form-row', { 'mustins-form-row--error': name.length === 0 && submitted })
                        }>
                            <label className="payFlow__label">Имя на карте</label>
                            <input
                                required
                                className="payFlow__input mustins-input"
                                type="text"
                                data-cp="name"
                                id="name"
                                value={name}
                                placeholder="Имя и Фамилия на карте"
                                onChange={e => setCardName(e.target.value)}
                            />
                        </div>

                        <Button
                            className="btn btn-primary"
                            type="submit"
                            width="fluid"
                            onClick={submitForm}
                        >Оплатить - {price} ₽</Button>

                        <input type="hidden" data-cp="cardNumber" value={cardNumber} />
                        <input type="hidden" data-cp="cvv" value={CVV} />
                        <input type="hidden" data-cp="expDateMonth" value={expDateMonth} />
                        <input type="hidden" data-cp="expDateYear" value={expDateYear} />
                    </form>
                </div>
            </div>
            <div className="payFlow__systems">
                <img src={paySystemsPng} alt="pay systems" />
            </div>
        </div>
    )
};


export const paySubscriptionPage = withWidgetId(withWidgetAuth(paySubscription));
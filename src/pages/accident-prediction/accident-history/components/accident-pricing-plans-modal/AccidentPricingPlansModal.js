import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { getPlans, selectPlans } from "../../AccidentHistoryPageModel";

import Radio from "../../../../../components/radio";
import { Modal } from "../../../../../components/modal/Modal";
import { Button } from "../../../../../components/button/Button";
import { QuantitySelect } from "../../../../../components/quantity-select";
import { Typography, TypographyType } from "../../../../../components/typography/Typography";

export const AccidentPricingPlansModal = ({isOpen, setOpen}) => {
    const plansSelector = useSelector(selectPlans)

    const dispatch = useDispatch();

    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState({})
    const [qty, setQty] = useState(1)

    useEffect(() => {
        dispatch(getPlans())
    },[])

    useEffect(() => {
        setPlans(plansSelector)
        setPlans((state) => state && state.map((item, i) => {
            if(item.amount === 199) {
                setSelectedPlan(item)
                return {
                    ...item,
                    label: 'Pro Drive',
                    details: '199 руб/мес за 1авто',
                    checked: true,
                    name: 'pricing'
                }

            }
            return {
                ...item,
                label: 'Extra Drive',
                details: '599 руб/мес за 1авто',
                checked: false,
                name: 'pricing'
            }
        }))
    },[plansSelector])

    const onSubmit = () => {
        setOpen(false);
        const { amount, planId } = selectedPlan;
        window.localStorage.setItem('osago-pay', JSON.stringify({
            price: amount,
            count: qty,
            planId
        }));
        window.location.href = '/payment';
    };

    const onClose = () => {
        setOpen(false);
    };

    const handlerQuantity = (amount) => {
        setQty(amount);
    };


    const handleChange = (e) => {
        const itemValue = e.target.value;
        setPlans((state) => state.map(item => {
            if(item.planId === +itemValue) {
                setSelectedPlan(item)
                return {
                    ...item,
                    checked: true
                }
            }
            return {
                ...item,
                checked: false
            }
        }))
    };

    const renderPriceCheckboxes = () => (
        <div className='plans-wrapper'>
            {plans.map(item => (
                <Radio
                    label={item.label}
                    details={item.details}
                    checked={item.checked}
                    key={item.planId}
                    name={item.name}
                    onChange={handleChange}
                    value={item.planId}
                />
            ))}
        </div>
    );

    return (
        isOpen && (
            <Modal
                isOpened={isOpen}
                title={'Достигнут лимит бесплатных авто. Чтобы добавить больше автомобилей, перейди на тариф выше'}
                onClose={onClose}
            >


                {renderPriceCheckboxes()}

                <Typography type={TypographyType.CAPTION} >
                    Количество авто
                </Typography>

                <div className='mustins-mb-36'>
                    <QuantitySelect
                        handlerQuantity={handlerQuantity}
                    />
                </div>

                <Button onClick={onSubmit}>
                    ВКЛЮЧИТЬ - {selectedPlan.amount * qty} ₽
                </Button>
            </Modal>
        )
    )
}

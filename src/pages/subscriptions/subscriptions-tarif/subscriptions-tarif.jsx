import React, { useState, useRef } from 'react';
import { BemHelper } from 'src/utils/class-helper';
import { SubscriptionsTarifItem } from './subscriptions-tarif-item/subscriptions-tarif-item';
import AuthContainer from "../../../components/auth/AuthContainer";
// SVG
import Truck from '../../../svg/truck.svg';
import Truck2 from '../../../svg/truck-2.svg';
import Truck3 from '../../../svg/truck-3.svg';

// Styles
import './subscriptions-tarif.scss';

// Classes
const classes = new BemHelper({ name: 'subscriptions-tarif' });

// Components
export const SubscriptionsTarif = ({ plans }) => {
  const [loginPopupShown, setLoginPopupShown] = useState(false);
  const [registrationPopupShown, setRegistrationPopupShown] = useState(false);

  const handleLoginOrRegistrationPopupClose = () => {
    setLoginPopupShown(false);
    setRegistrationPopupShown(false);
  }

  const handleLoginClick = () => {
    setLoginPopupShown(true);
    onClose();
  }

  return (
    <div {...classes()}>
      <h3 {...classes('title')}>Тарифные планы</h3>
      <div {...classes('subtitle')}>
        Выбери оптимальный тарифный план для снижения аварийности и сокращение риска ДТП
      </div>
      <div {...classes('wrapper')}>
        <SubscriptionsTarifItem
          isFree={true}
          title="Free"
          counter={false}
          price={0}
          planId={0}
          priceText="для 3 авто"
          content={['Возможность добавлять до 3-х автомобилей в личный кабинет организации']}
          handleLoginClick={handleLoginClick}
        >
          <Truck />
        </SubscriptionsTarifItem>

        {plans &&
          <SubscriptionsTarifItem
            headtext="MUST РЕКОМЕНДУЕТ"
            title="Pro Drive"
            counter={true}
            price={plans.plans[0].amount}
            planId={1}
            priceText="за 1 авто в месяц"
            content={
              [
                'Ежемесячный отчёт об аварийности для каждого авто',
                'Рекомендации по снижению аварийности Ежемесячно', ,
                'Доступ в платную часть личного кабинета с данными о влиянии Аварийности на Финансовые показатели бизнеса'
              ]
            }
            handleLoginClick={handleLoginClick}
          >
            <Truck2 />
          </SubscriptionsTarifItem>
        }
        {plans &&
          <SubscriptionsTarifItem
            title="Extra Drive"
            price={plans.plans[1].amount}
            planId={2}
            priceText="за 1 авто в месяц"
            content={
              [
                'Ежемесячный отчёт об аварийности для каждого авто',
                'Рекомендации по снижению аварийности Ежемесячно', ,
                'Онлайн-обучение по снижению аварийности для водителей 1 раз в квартал + аттестация',
                'Доступ в платную часть личного кабинета'
              ]
            }
            handleLoginClick={handleLoginClick}
          >
            <Truck3 />
          </SubscriptionsTarifItem>
        }
      </div>

      {(loginPopupShown) && (
        <AuthContainer
          initialStep={registrationPopupShown ? 'registration' : 'login'}
          resetToInitialStepAfterClosed
          isOpened
          onClose={handleLoginOrRegistrationPopupClose}
          onPhoneConfirmed={handleLoginOrRegistrationPopupClose}
          loginLabelText='Телефон, если есть личный кабинет'
          renderModal
          hidePosition={true}
        />
      )}
    </div>
  )
}

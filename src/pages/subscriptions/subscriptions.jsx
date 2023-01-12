import React, { useEffect, useState } from 'react';
import { SubscriptionsCalculation } from './subscriptions-calculation/subscriptions-calculation';
import { SubscriptionsTarif } from './subscriptions-tarif/subscriptions-tarif';
import { SubsciptionsInfo } from './subsriptions-info/subsriptions-info';
import { SubscriptionsDetailPage } from '../subscriptions-detail/subscriptionsDetail';
import api from "../../api";

import { SubHeader } from '../../components/sub-header/sub-header';
import { withWidgetId } from '../../hoc/withWidgetId';
import { BemHelper } from '../../utils/class-helper';
import { Sprite } from '../../components/sprite/Sprite';
// Styles
import './subsriptions.scss';
import Loading from "../../components/loading/loading";
import { SubscriptionsForm } from './subscriptions-form/subscriptions-form';
import withWidgetAuth from '../../hoc/withWidgetAuth';
import {withFormHook} from '../../hoc/withFormHook'
import {useSelector} from "react-redux";
import {selectAuthUser} from "src/redux/authReducer";
import {useFilledData} from "src/hooks/useFilledData";

// Classes
const classes = new BemHelper({name: 'subscriptions'});

// Component
const SubscriptionsPageComponent = (props) => {
    const [plans, setPlans] = useState(null);
    const user = useSelector(selectAuthUser);
    const isNeedRedirect = useFilledData();
    /* Page statuses */
    // 0 - Loading
    // 1 - Not plan
    // 2 - Selected plan
    const [pageStatus, setPageStatus] = useState(null);
    const [activeSubscription, setActiveSubscription] = useState(null);

    const getPlansList = async () => {
      const plansList = await api(`/subscription/plans`);

      if (plansList.status === 200) {
        const plansListJson = await plansList.json();
        setPlans(plansListJson);
      }
    };

    const getActiveSubscription = async () => {
      const subscription = await api(`/subscription`);

      if (subscription.status === 200) {
        const subscriptionJson = await subscription.json();
        setActiveSubscription(subscriptionJson);
        setPageStatus(subscriptionJson.hasActiveSubscription && (subscriptionJson.current && subscriptionJson.current.isActive));
      }
    };

    const initPage = async () => {
      await getActiveSubscription();
      await getPlansList();
    };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    initPage();
  }, []);

  useEffect(() => {
      // if(isNeedRedirect) window.location.href = '/?showRegistration'
  }, [isNeedRedirect])

  return (
    <div {...classes()}>
      <SubHeader />
      {pageStatus === null && <Loading />}
      {pageStatus === false && <SubscriptionStatus_1 plans={plans} {...props}/>}
      {pageStatus === true && <SubscriptionStatus_2 subscription={activeSubscription} plans={plans} refresh={initPage} />}
      <Sprite />
    </div>
  );
};

const SubscriptionStatus_1 = (props) => {
  return <div {...classes('wrapper')}>
    <div {...classes('body')}>
      <div {...classes('info')}>
        <SubsciptionsInfo
          title="Подписка на Снижение аварийности"
          subTitle="Помогаем больше зарабатывать, уменьшая количество простоев через снижение аварийности и сокращение риска ДТП"
        />
      </div>
      <SubscriptionsCalculation />
      <SubscriptionsTarif plans={ props.plans } />
      <SubscriptionsForm {...props}/>
    </div>
  </div>
};

const SubscriptionStatus_2 = ({ subscription, plans, refresh }) => {
  return <SubscriptionsDetailPage subscription={subscription} plans={plans} refresh={refresh} />
}

export const SubscriptionsPage = withWidgetId(withWidgetAuth(withFormHook(SubscriptionsPageComponent)));

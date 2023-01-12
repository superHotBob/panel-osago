import React, { useEffect, useState } from 'react';
import { SubscriptionsCalculation } from '../subscriptions-calculation/subscriptions-calculation';
import { SubscriptionsTarif } from '../subscriptions-tarif/subscriptions-tarif';
import api from "../../../api";
import {withFormHook} from '../../../hoc/withFormHook'
import { withWidgetId } from '../../../hoc/withWidgetId';
import Loading from "../../../components/loading/loading";
import { SubscriptionsForm } from '../subscriptions-form/subscriptions-form';


const PLANS_HARDCODE = {
    'plans': [{
        planId: 1,
        amount: 199
    }, {
        planId: 2,
        amount: 599
    }]
}

// Component
const SubscriptionsLanding = (props) => {
  const [plans, setPlans] = useState(PLANS_HARDCODE),
    [pageStatus, setPageStatus] = useState(1),
    getPlansList = async () => {
      const plansList = await api(`/subscription/plans`);

      if (plansList.status === 200) {
        const plansListJson = await plansList.json();
        setPlans(plansListJson);
      }
    },
    initPage = async () => {
      await getPlansList();
      setPageStatus(1);
    };

  useEffect(() => {
    initPage();
  }, []);

  return (
    <>
      {pageStatus === 0 && <Loading />}
      {pageStatus === 1 && <SubscriptionStatus_1 plans={plans} {...props} />}
    </>
  );
};

const SubscriptionStatus_1 = (props) => {
  return (
    <>
      <SubscriptionsCalculation />
      <SubscriptionsTarif plans={ props.plans } />
      <SubscriptionsForm {...props} />
    </>
  )
};

export const SubscriptionsLandingPage = withWidgetId(withFormHook(SubscriptionsLanding))

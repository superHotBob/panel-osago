import React from "react";

import { AccidentHistoryPage } from "./pages/accident-prediction/accident-history/AccidentHistoryPage";
import ProfileNew from "./pages/profile-new";
import { SubscriptionsPage } from "./pages/subscriptions/subscriptions";
import { paySubscriptionPage } from "./pages/pay-subscription/pay-subscription";

export default [
  {
    path: '/',
    component: () => <ProfileNew active={"profile"} />,
    exact: true,
    isPrivate: true,
  },
  {
    path: '/payment',
    component: paySubscriptionPage,
    exact: true,
    isPrivate: true,
  },
  {
    path: '/subscriptions',
    component: SubscriptionsPage,
    exact: true,
    isPrivate: true,
  },
  {
    path: '/my_history',
    component: () => AccidentHistoryPage(false),
    exact: true,
    isPrivate: true,
  },
  {
    path: '/my_vehicles',
    component: () => AccidentHistoryPage(true),
    exact: true,
    isPrivate: true,
  },
];

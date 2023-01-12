import React from 'react';
import { KAMAZ_FLEET_DEV_SOURCE_VALUE, KAMAZ_FLEET_PROD_SOURCE_VALUE, KAMAZ_FLEET_STAGE_SOURCE_VALUE } from "../constants/osago";
import { withRouter } from "../hoc/withRouter";
import { Theme } from "../hoc/withTheme";
import { SubscriptionsLandingPage } from "../pages/subscriptions/subscriptions-landing-page/subscriptions-landing-page";
import { HeaderWidget } from "../widgets/header/HeaderWidget";
import { InsurancePartnerWidget } from "../widgets/insurance-partner-widget/InsurancePartnerWidget";
import { AccidentHistoryPage } from '../pages/accident-prediction/accident-history/AccidentHistoryPage';
import { SubscriptionsPage } from '../pages/subscriptions/subscriptions';
import { AddCarPage } from '../pages/add-car';
import { paySubscriptionPage } from '../pages/pay-subscription/pay-subscription';
import { SubsciptionsInfo } from '../pages/subscriptions/subsriptions-info/subsriptions-info';
import MustAccident from "../widgets/accident";
import ProfileNew from "../pages/profile-new";

export const KAMAZ_WIDGETS = [
    {
        id: 'kamaz-header',
        component: HeaderWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-prod',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-mobile-prod',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-stage',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_STAGE_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-mobile-stage',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_STAGE_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-dev',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_DEV_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-eosago-insurance-widget-mobile-dev',
        component: InsurancePartnerWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
        source: KAMAZ_FLEET_DEV_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-accident-header',
        component: HeaderWidget,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-accident.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-must-accident',
        component: withRouter(MustAccident),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-accident.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },
    {
        id: 'kamaz-accident-subsciptions-landing',
        component: SubscriptionsLandingPage,
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-accident.mustins.ru/',
        source: KAMAZ_FLEET_PROD_SOURCE_VALUE,
        domainPrefix: 'kamaz-'
    },

    {
        id: 'kamaz-accident',
        component: withRouter(MustAccident),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-profile',
        component: withRouter(() => <ProfileNew />),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-my-trucks',
        component: withRouter(() => AccidentHistoryPage(true)),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-subscriptions',
        component: withRouter(() => SubscriptionsPage()),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-my-history',
        component: withRouter(() => AccidentHistoryPage(false)),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-add-car',
        component: withRouter(AddCarPage),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-pay-subscription',
        component: withRouter(() => paySubscriptionPage()),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
    {
        id: 'kamaz-subsciptions-info',
        component: () => (
            <SubsciptionsInfo
                showDivider={true}
                title={<>Экономь ежегодно<br className="mustins-subscriptions-info__titleBreak"/>до 216.000 рублей<br/>на каждом Грузовике</>}
                subTitle={<>Помогаем больше зарабатывать, сокращая количество простоев <br/>и расходов на ремонт, через снижение аварийности и рисков ДТП</>}
            />
        ),
        theme: Theme.KAMAZ,
        mainPageUrl: 'http://kamaz-osago.mustins.ru/',
    },
];

import './utils/loadMetrics'
import React from 'react';

import ReactDOM from 'react-dom';
import PhoneWidget from './widgets/phone-widget';
import EmailWidget from './widgets/email-widget';
import {InsuranceWidget} from './widgets/insurance-widget/InsuranceWidget';
import Profile from './pages/profile';
import ProfileNew from "./pages/profile-new";

import {ProfileWidget} from "./widgets/profile-widget";
import {HeaderWidget} from './widgets/header/HeaderWidget';
import MustAccident from './widgets/accident';
import {store, withStore} from "./hoc/withStore";
import {withContext} from "./hoc/withContext";
import {withRouter} from "./hoc/withRouter";
import {ReconstructionWidget} from "./widgets/reconstruction-widget/ReconstructionWidget";
import {Theme, withTheme} from "./hoc/withTheme";
import {setDomainPrefixAction, setMainPageUrlAction, setSourceAction} from "./redux/rootReducer";
import {
    AGENT_BROKER_SOURCE_VALUE,
    E100_SOURCE_VALUE,
    ELPOLIS_SOURCE_VALUE, EUROGARANT_SOURCE_VALUE, INFULL_SOURCE_VALUE,
    OBOZ_SOURCE_VALUE,
    OSAGO_SOURCE_VALUE, POLIS_ONLINE_SOURCE_VALUE
} from "./constants/osago";
import {InsurancePartnerWidget} from "./widgets/insurance-partner-widget/InsurancePartnerWidget";

import { AccidentHistoryPage } from "./pages/accident-prediction/accident-history/AccidentHistoryPage";
import { SubscriptionsPage } from "./pages/subscriptions/subscriptions";
import { paySubscriptionPage } from "./pages/pay-subscription/pay-subscription";
import { AddCarPage } from "./pages/add-car";
import { SubsciptionsInfo } from './pages/subscriptions/subsriptions-info/subsriptions-info';
import { SubscriptionsLandingPage } from './pages/subscriptions/subscriptions-landing-page/subscriptions-landing-page';
import { KAMAZ_WIDGETS } from './widgets-entries/kamaz';
import { IPOLIS_WIDGETS } from './widgets-entries/ipolis';

const widgets = [{
    id: 'must-header',
    component: HeaderWidget,
}, {
    id: 'must-accident',
    component: withRouter(MustAccident),
}, {
    id: 'must-eosago-phone',
    component: PhoneWidget,
}, {
    id: 'must-eosago-phone-mobile',
    component: PhoneWidget,
}, {
    id: 'must-reconstruction-email',
    component: ReconstructionWidget,
}, {
    id: 'must-eosago-email',
    component: EmailWidget,
}, {
    id: 'must-eosago-email-mobile',
    component: EmailWidget,
}, {
    id: 'must-eosago-insurance-form',
    component: InsurancePartnerWidget,
    source: OSAGO_SOURCE_VALUE
}, {
    id: 'must-eosago-insurance-form-mobile',
    component: InsurancePartnerWidget,
    source: OSAGO_SOURCE_VALUE
}, {
    id: 'must-eosago-insurance-form-bottom',
    component: InsurancePartnerWidget,
    source: OSAGO_SOURCE_VALUE
}, {
    id: 'must-eosago-insurance-form-bottom-mobile',
    component: InsurancePartnerWidget,
    source: OSAGO_SOURCE_VALUE
},
    {
        id: 'demo-eosago-insurance-form',
        component: InsurancePartnerWidget,
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    }, {
        id: 'demo-eosago-insurance-form-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    }, {
        id: 'demo-eosago-insurance-form-bottom',
        component: InsurancePartnerWidget,
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    }, {
        id: 'demo-eosago-insurance-form-bottom-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-full-profile',
        component: withRouter(ProfileWidget),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    }, 
    {
        id: 'must-eosago-profile',
        component: withRouter(() => <ProfileNew />),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },

    {
        id: 'must-eosago-my-trucks',
        component: withRouter(() => AccidentHistoryPage(true)),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-subscriptions',
        component: withRouter(() => SubscriptionsPage()),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-subsciptions-info',
        component: () => (
            <SubsciptionsInfo
                showDivider={true}
                title={<>Экономь ежегодно<br className="mustins-subscriptions-info__titleBreak"/>до 216.000 рублей<br/>на каждом Грузовике</>}
                subTitle={<>Помогаем больше зарабатывать, сокращая количество простоев <br/>и расходов на ремонт, через снижение аварийности и рисков ДТП</>}
            />
        ),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-subsciptions-landing',
        component: SubscriptionsLandingPage,
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-my-history',
        component: withRouter(() => AccidentHistoryPage(false)),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-add-car',
        component: withRouter(AddCarPage),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'must-eosago-pay-subscription',
        component: withRouter(() => paySubscriptionPage()),
        theme: Theme.DEMO,
        mainPageUrl: 'http://demo-osago.tilda.ws/',
    },
    {
        id: 'e100-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.E100,
        mainPageUrl: 'https://e100.market/',
        source: E100_SOURCE_VALUE
    }, {
        id: 'e100-insurance-widget-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.E100,
        mainPageUrl: 'https://e100.market/',
        source: E100_SOURCE_VALUE
    },
    {
        id: 'e100-insurance-widget-bottom-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.E100,
        mainPageUrl: 'https://e100.market/',
        source: E100_SOURCE_VALUE
    },
    {
        id: 'oboz-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.OBOZ,
        mainPageUrl: 'https://insurance.oboz.com/',
        source: OBOZ_SOURCE_VALUE
    },
    {
        id: 'oboz-insurance-widget-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.OBOZ,
        mainPageUrl: 'https://insurance.oboz.com/',
        source: OBOZ_SOURCE_VALUE
    },
    {
        id: 'oboz-insurance-widget-bottom-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.OBOZ,
        mainPageUrl: 'https://insurance.oboz.com/',
        source: OBOZ_SOURCE_VALUE
    },

    {
        id: 'elpolis-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.EL_POLIS,
        mainPageUrl: 'https://must.el-polis.ru/',
        source: ELPOLIS_SOURCE_VALUE
    }, {
        id: 'elpolis-insurance-widget-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.EL_POLIS,
        mainPageUrl: 'https://must.el-polis.ru/',
        source: ELPOLIS_SOURCE_VALUE
    },
    {
        id: 'elpolis-insurance-widget-bottom-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.EL_POLIS,
        mainPageUrl: 'https://must.el-polis.ru/',
        source: ELPOLIS_SOURCE_VALUE
    },
    {
        id: 'agent-broker-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.AGENT_BROKER,
        mainPageUrl: 'http://fura.agentbroker.ru/',
        source: AGENT_BROKER_SOURCE_VALUE
    },
    {
        id: 'polis-online-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.POLIS_ONLINE,
        mainPageUrl: 'https://polis.online/osago/e-osago/',
        source: POLIS_ONLINE_SOURCE_VALUE
    },
    {
        id: 'infull-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.INFULL,
        mainPageUrl: 'https://www.infullbroker.ru/osago/',
        source: INFULL_SOURCE_VALUE
    },
    {
        id: 'eurogarant-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.EUROGARANT,
        mainPageUrl: 'http://www.eurogarant.ru/',
        source: EUROGARANT_SOURCE_VALUE
    },
    {
        id: 'gpnregion-header',
        component: HeaderWidget,
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },
    {
        id: 'gpnregion-eosago-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },
    {
        id: 'gpnregion-eosago-insurance-widget-mobile',
        component: InsurancePartnerWidget,
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },
    {
        id: 'gpnregion-accident-header',
        component: HeaderWidget,
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-accident.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },
    {
        id: 'gpnregion-must-accident',
        component: withRouter(MustAccident),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-accident.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },
    {
        id: 'gpnregion-accident-subsciptions-landing',
        component: SubscriptionsLandingPage,
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-accident.mustins.ru/',
        source: OSAGO_SOURCE_VALUE,
        domainPrefix: 'gpn-'
    },

    {
        id: 'gpnregion-accident',
        component: withRouter(MustAccident),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-profile',
        component: withRouter(() => <ProfileNew />),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-my-trucks',
        component: withRouter(() => AccidentHistoryPage(true)),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-subscriptions',
        component: withRouter(() => SubscriptionsPage()),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-my-history',
        component: withRouter(() => AccidentHistoryPage(false)),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-add-car',
        component: withRouter(AddCarPage),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-pay-subscription',
        component: withRouter(() => paySubscriptionPage()),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    {
        id: 'gpnregion-subsciptions-info',
        component: () => (
            <SubsciptionsInfo
                showDivider={true}
                title={<>Экономь ежегодно<br className="mustins-subscriptions-info__titleBreak"/>до 216.000 рублей<br/>на каждом Грузовике</>}
                subTitle={<>Помогаем больше зарабатывать, сокращая количество простоев <br/>и расходов на ремонт, через снижение аварийности и рисков ДТП</>}
            />
        ),
        theme: Theme.GPN_REGION,
        mainPageUrl: 'http://gpn-osago.mustins.ru/',
    },
    ...KAMAZ_WIDGETS,
    ...IPOLIS_WIDGETS
];

widgets.forEach((widget) => {
    const widgetContainer = document.getElementById(widget.id);
    const Component = withTheme(withStore(withContext(widget.component, {widgetId: widget.id})), widget.theme, true)

    if (widgetContainer) {
        if (widget.mainPageUrl) {
            store.dispatch(setMainPageUrlAction(widget.mainPageUrl))
        }
        if (widget.domainPrefix) {
            store.dispatch(setDomainPrefixAction(widget.domainPrefix))
        }
        if (widget.source) {
            store.dispatch(setSourceAction(widget.source))
        }
        ReactDOM.render(<Component/>, widgetContainer);
    }
})

if (document.location.pathname === '/confirm-payment') {
    const domain = document.domain;
    let theme = Theme.MUST;
    if (domain === 'e100.market.tilda.ws' || domain === 'e100.market') {
        theme = Theme.E100;
        store.dispatch(setMainPageUrlAction('https://' + domain));
        setSourceAction(E100_SOURCE_VALUE);
    } else if(domain === 'must.el-polis.tilda.ws' || domain === 'must.el-polis.ru') {
        theme = Theme.EL_POLIS;
        store.dispatch(setMainPageUrlAction('https://' + domain));
        setSourceAction(ELPOLIS_SOURCE_VALUE);
    } else if(domain === 'insurance.oboz.com' || domain === 'insurance.oboz.com') {
        theme = Theme.OBOZ;
        store.dispatch(setMainPageUrlAction('https://' + domain));
        setSourceAction(OBOZ_SOURCE_VALUE);
    } else {
        setSourceAction(OSAGO_SOURCE_VALUE)
    }
    if (domain === 'demo-osago.tilda.ws') {
        store.dispatch(setMainPageUrlAction('http://' + domain));
    }
    const Component = withTheme(withStore(withContext(InsuranceWidget, {widgetId: 'confirm-payment'})), theme)
    const container = document.createElement("div");
    document.body.append(container);
    ReactDOM.render(<Component/>, container);
}

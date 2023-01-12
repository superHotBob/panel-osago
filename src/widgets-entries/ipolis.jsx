import { IPOLIS_SOURCE_VALUE } from "../constants/osago";
import { Theme } from "../hoc/withTheme";
import { InsurancePartnerWidget } from "../widgets/insurance-partner-widget/InsurancePartnerWidget";

export const IPOLIS_WIDGETS = [
    {
        id: 'ipolis-eosago-insurance-widget',
        component: InsurancePartnerWidget,
        theme: Theme.IPOLIS,
        mainPageUrl: 'https://lp.i-polis.pro/',
        source: IPOLIS_SOURCE_VALUE,
        domainPrefix: ''
    },
];

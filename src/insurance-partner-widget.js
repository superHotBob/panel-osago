import React from 'react';
import ReactDOM from 'react-dom';
import './utils/loadMetrics'
import {InsurancePartnerWidget} from './widgets/insurance-partner-widget/InsurancePartnerWidget';
import {withStore, store} from "./hoc/withStore";
import {withContext} from "./hoc/withContext";
import {setMainPageUrlAction, setSourceAction, setYmIdAction} from "./redux/rootReducer";
import {withTheme} from "./hoc/withTheme";

(function (window) {
    const init = ({...args}) => {
        const config = args[0]

        if (config.ym) {
            store.dispatch(setYmIdAction(config.ym))
        }
        if (config.source) {
            store.dispatch(setSourceAction(config.source))
        }

        if (config.mainPageUrl) {
            store.dispatch(setMainPageUrlAction(config.mainPageUrl))
        }

        let Component = withTheme(withContext(withStore(InsurancePartnerWidget), {widgetId: config.selector}), config.theme)

        ReactDOM.render(
            <Component/>,
            document.querySelector(config.selector)
        );

    }

    if (window.mustins && window.mustins.queue && window.mustins.queue.length > 0) {
        window.mustins.queue.forEach(config => init(config))
    }

    window.mustins = init
}(window))


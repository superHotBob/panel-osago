import AppContext from "store/context";
import createCrmDataAggregator from 'utils/crmDataAggregator'
import {getObjectFromUrlParams} from "utils";
import React from "react";

const aggregateCrmData = createCrmDataAggregator({
    UTM: JSON.stringify(
        getObjectFromUrlParams(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'])
    )
})

export const withContext = (WrappedComponent, data = {}) => {
    return class extends React.Component {
        render() {
            const context = {
                aggregateCrmData,
                ...data
            }

            return (
                <AppContext.Provider value={context}>
                    <WrappedComponent/>
                </AppContext.Provider>
            )
        }
    }
}

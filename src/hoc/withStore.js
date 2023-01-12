// set up redux
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import isEmpty from 'lodash/isEmpty';
import reducer from "../redux";
import {Provider} from 'react-redux'
import React from "react";
import {setAuthTokenAction, setUtmAction} from "../redux/authReducer";
import {getToken} from "../modules/auth";
import {getObjectFromUrlParams} from "../utils";
import {composeWithDevTools} from "redux-devtools-extension";

const middleware = [thunk]

export const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(...middleware),
    )
)

window.dispatch = store.dispatch
store.subscribe(() => window.__renderedState = store.getState());
store.dispatch(setAuthTokenAction(getToken(), true))
const utm = getObjectFromUrlParams(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);
if (!isEmpty(utm)) {
    store.dispatch(setUtmAction(JSON.stringify(utm)));
}
export const withStore = (WrappedComponent) => {
    return class extends React.Component {
        render() {
            return (
                <Provider store={store}>
                    <WrappedComponent/>
                </Provider>
            )
        }
    }
}

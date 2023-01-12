import {BrowserRouter as Router} from 'react-router-dom';
import React from "react";

export const withRouter = (WrappedComponent) => {
    return class extends React.Component {
        render() {
            return (
                <Router>
                    <WrappedComponent/>
                </Router>
            )
        }
    }
}

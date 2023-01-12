import React, {Component} from 'react';
import PrivateRoute from "../../PrivateRoute";

import routes from '../../routes';

import './accident.scss';
import {Route} from "react-router-dom";
import {HeaderWidget} from "../header/HeaderWidget";
import {Sprite} from '../../components/sprite/Sprite';

class MustAccident extends Component {
    render() {
        return (
            <>
                {/*<HeaderWidget/>*/}
                {
                    routes.map((route) => {
                        return (
                                route.isPrivate
                                    ? <PrivateRoute
                                            key={`route-${route.path}`}
                                            exact
                                            path={route.path}
                                            component={route.component}
                                    />
                                    : <Route
                                            key={`route-${route.path}`}
                                            exact
                                            path={route.path}
                                            component={route.component}
                                    />
                        );
                    })
                }
                <Sprite/>
            </>
        )
    };
}

export default MustAccident;

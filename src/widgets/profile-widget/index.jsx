import React from "react";
import PrivateRoute from "../../PrivateRoute";

import routes from '../../routes-profile';

import { Route } from "react-router-dom";
import { HeaderWidget } from "../header/HeaderWidget";
import { Sprite } from '../../components/sprite/Sprite';

export const ProfileWidget = () => {
    return (<>
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
        <Sprite />
    </>);
};
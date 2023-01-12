import React from 'react';
import {BemHelper} from "../../utils/class-helper";

export const Tab = ({
    tabKey = '',
    title = '',
    active = false,
    children
}) => {
    const classes = new BemHelper({name: 'tab'});

    return (
        <div {...classes(null, active ? 'active' : '')}>
            {children}
        </div>
    )
}

import React, {useRef, useState} from 'react';
import {BemHelper} from "../../utils/class-helper";
import TooltipTriangleSvg from "/svg/tooltip-triangle.svg";

import './tooltip.scss'
import {useOnTouchOutside} from "../../hooks/useOnTouchOutside";

export const Tooltip = ({
    children,
    activator = null
}) => {
    const classes = new BemHelper({name: 'tooltip'});
    const [touched, setTouched] = useState(false)
    const ref = useRef();
    useOnTouchOutside(ref, () => setTouched(false));

    const handleTouchActivator = () => {
        setTouched(true);
    }
    return (
        <div {...classes(null, touched ? 'touched' : '')} ref={ref}>
            <div {...classes('activator')} onTouchStart={handleTouchActivator}>
                {activator}
            </div>
            <div {...classes('body')}>
                <TooltipTriangleSvg {...classes('triangle')}/>
                {children}
            </div>
        </div>
    )
}

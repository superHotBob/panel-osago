import React from 'react';
import './three-columns-layout.scss';

export const ThreeColumnsLayout = ({children}) => {
    return (
        <div className="three-columns-layout">
            {children}
        </div>
    )
}

export const LeftColumn = ({children}) => {
    return (
        <div className="three-columns-layout__left">
            {children}
        </div>
    )
}

export const CenterColumn = ({children}) => {
    return (
        <div className="three-columns-layout__center">
            {children}
        </div>
    )
}

export const RightColumn = ({children}) => {
    return (
        <div className="three-columns-layout__right">
            {children}
        </div>
    )
}

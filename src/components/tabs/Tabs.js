import React, {useEffect} from 'react';
import {BemHelper} from "../../utils/class-helper";
import {Tab} from "./Tab";
import './tabs.scss'
import {noop} from "lodash";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";

export const Tabs = ({
                         active = null,
                         onTabChange = null,
                         onTabClick = noop,
                         children,
                         style = 'style-1',
                         skipInitialCallback,
                     }) => {
    const classes = new BemHelper({name: 'tabs'});

    useEffect(() => {
        if (!skipInitialCallback) {
            if (active) {
                onTabChange(active)
                return;
            }
            onTabChange(children[0].props.tabKey)
        }
    }, [])

    return (
        <div {...classes(null, style)}>
            <div {...classes('header')}>
                {
                    children.map((child) => {
                        const {title, tabKey} = child.props;
                        return (
                            <div
                                {...classes('header-item', active === tabKey ? 'active' : '')}
                                key={tabKey}
                                style={{flexBasis: `${100 / children.length}%`}}
                                onClick={() => {
                                    onTabClick(tabKey)
                                    onTabChange(tabKey);
                                }}>
                                <Typography type={TypographyType.BODY} color={active === tabKey ? TypographyColor.WHITE : TypographyColor.BLACK}>
                                    {title}
                                </Typography>
                            </div>
                        )
                    })
                }
            </div>
            <div {...classes('content')}>
                {
                    children.map((child) => {
                        const {title, tabKey} = child.props;
                        return (
                            <Tab
                                key={tabKey}
                                tabKey={tabKey}
                                title={title}
                                active={active === tabKey}
                            >{child.props.children}</Tab>
                        );
                    })
                }
            </div>
        </div>
    )
}

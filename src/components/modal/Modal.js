import React, {useContext, useEffect, useRef, useState} from 'react'
import {createPortal} from "react-dom";

import {ModalHeader} from "./ModalHeader";
import CloseSVG from 'svg/close.svg';

import './modal.scss'
import {useCompare} from "../../hooks/useCompare";
import {BemHelper, className} from "/utils/class-helper";
import {ThemeContext} from "../../hoc/withTheme";

const Modal = ({
   isOpened = false,
   onOpen = () => {},
   onClose = () => {},
   loading = false,
   title = '',
   description = '',
   children = null,
   color = 'primary',
   steps = {},
   activeStep = 'firstStep',
   SvgIcon
}) => {
    const classes = new BemHelper({name: 'modal'});
    const themeContext = useContext(ThemeContext)
    let [container] = useState(document.createElement('div'))
    const visibilityChanged = useCompare(isOpened)
    const rootEl = useRef(null);

    const classOpened = classes('', 'opened').className.split(' ')[1]

    const toggle = visible => {
        if (visible) {
            document.body.classList.add(`body-${classOpened}`)
            container.classList.add(classOpened)
            container.classList.add('theme-' + themeContext.theme)
            onOpen()
        } else {
            container.classList.remove(classOpened)
            // check if we still have opened modals to show background
            if (!document.querySelector(`.${classOpened}`)) {
                document.body.classList.remove(`body-${classOpened}`)
            }
            onClose()
        }
    }

    // create and remove container for modal
    useEffect(() => {
        container.className = classes().className;
        document.body.appendChild(container)

        return () => {
            document.body.removeChild(container)
            if (!document.querySelector(`.${classOpened}`)) {
                document.body.classList.remove(`body-${classOpened}`)
            }
        }
    }, [])

    useEffect(() => {
        if (rootEl.current) {
            rootEl.current.scrollTop = 0;
        }
    }, [activeStep]);

    // watch for visibility
    useEffect(() => {
        if (visibilityChanged) {
            toggle(isOpened)
        }
    });

    let content = null
    if (steps.hasOwnProperty(activeStep)) {
        content = steps[activeStep]
    }

    const modal = (
        <div ref={rootEl} {...classes('root', ['scrollable', loading ? 'loading' : ''])}>
            <div {...classes('wrapper')}>
                <div {...classes('fixer')}>
                    <div {...classes('container')}>
                        <CloseSVG
                            {...classes('close')}
                            onClick={() => toggle(false)}
                        />
                        <ModalHeader
                            title={title}
                            SvgIcon={SvgIcon}
                            color={color}>
                            {description}
                        </ModalHeader>
                        <div {...classes('content')}>
                            {children}                            
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    if (isOpened) {
        return createPortal(modal, container)
    }
    return null
}

export {Modal};

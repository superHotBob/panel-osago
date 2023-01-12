import React, {Fragment} from "react";
import {BemHelper} from "../../utils/class-helper";
import EditSvg from './edit.svg'
import OkSvg from './ok.svg'
import NoSvg from './no.svg'
import CheckSvg from './check.svg'
import LookSvg from './look.svg'

import './contract-data-field.scss'
import {FormGroup} from "../form-group/FormGroup";
import {Button} from "../button/Button";
import {TypographyColor} from "../typography/Typography";

export const ContractDataField = ({
                                      children,
                                      label = '',
                                      editable = false,
                                      error = false,
                                      loading = false,
                                      confirm = () => {
                                      },
                                      shouldConfirm = false,
                                      toggle = () => {
                                      },
                                      opened = false,
                                      value = ''
                                  }) => {
    const classes = new BemHelper({name: 'contract-data-field'});

    const getOkIcon = () => {
        if (editable && shouldConfirm) {
            return <span {...classes('icon')}><LookSvg/></span>
        }
        if (opened) {
            return null
        }
        return <span {...classes('icon-ok')}><OkSvg/></span>
    }

    const getIcons = () => {
        if (loading) {
            return <div {...classes('loading')}></div>
        }

        let errorIcon = (
            <span {...classes('icon')}>
                <NoSvg/>
            </span>
        )
        const checkIcon = error ? errorIcon : getOkIcon()

        return (
            <Fragment>
                {
                    editable && !opened ?
                        <span onClick={() => toggle(true)} {...classes('icon', 'edit')}>
                            <EditSvg/>
                        </span> : null
                }
                {checkIcon}
            </Fragment>
        )
    }

    return (
        <div {...classes(null, [opened ? 'opened' : '', editable && shouldConfirm ? 'confirm' : ''])}>
            <FormGroup
                error={error}
                showError={opened}
                label={<div {...classes('label')}>
                    <span>{label}</span>
                    <div {...classes('icons')}>
                        {getIcons()}
                    </div>
                </div>}
                labelColor={!opened ? TypographyColor.GRAY_DARK : null}
                errorTextTypographyColor={editable && shouldConfirm ? TypographyColor.WARNING: null}
                formNote={editable && shouldConfirm ? 'Проверь и нажми кнопку' : ''}>
                {
                    opened ?
                        <div {...classes('field')}>
                            {children}
                            {
                                editable && shouldConfirm ?
                                    <Button onClick={() => confirm()}><CheckSvg/></Button> : null
                            }
                        </div> :
                        <div {...classes('value')}>{!value ? '--' : value}</div>
                }
            </FormGroup>
        </div>
    )
}


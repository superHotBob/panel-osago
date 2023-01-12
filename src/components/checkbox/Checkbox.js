import React from 'react';
import './checkbox.scss';
import {BemHelper, className} from "../../utils/class-helper";
import CheckSvg from 'svg/check.svg';
import {Typography, TypographyColor, TypographyDisplay, TypographyType} from "../typography/Typography";
import {noop} from "lodash";

const classes = new BemHelper({name: 'checkbox'});

export const Checkbox = ({
    onChange = () => {},
    label = '',
    labelAsFootnote = false,
    boldLabel = false,
    error = false,
    note = '',
    checked = false,
    disabled = false,
    // temp fix to leave other checkboxes as is
    disabledStyle = false,
    color = 'grey',
    onClick = noop
}) => {
    return (
      <div {...classes('container', [color, disabled ? 'disabled' : ''])}>
        <label {...classes('control')} onClick={onClick}>
          <input disabled={disabled} type="checkbox" checked={checked} onChange={onChange}/>
          <div {...classes('indicator', error ? 'error' : '', [className('form-control', true)])}>
              <CheckSvg/>
          </div>
            <div {...classes('label', labelAsFootnote ? 'footnote' : '')}>
                <Typography type={labelAsFootnote ? TypographyType.FOOTNOTE : TypographyType.SUBHEAD}
                            display={labelAsFootnote ? TypographyDisplay.BLOCK : TypographyDisplay.INLINE}>
                    {label}
                </Typography>
                {note && <div {...classes('note')}>
                    <Typography type={TypographyType.CAPTION} color={TypographyColor.GRAY_DARK}>{note}</Typography>
                </div>}
            </div>

          {/*<div {...classes('label', boldLabel ? 'bold' : '')}>*/}
          {/*  {!!note && <div {...classes('note')}>{note}</div>}*/}
          {/*</div>*/}

        </label>
      </div>
    );
}

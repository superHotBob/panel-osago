import React, {useRef, useState} from 'react';
import {BemHelper, className} from "../../utils/class-helper";

import './vin-input.scss'
import toUpper from "lodash/toUpper";
import {Tooltip} from "../tooltip/tooltip";
import QuestionSvg from "/svg/question.svg";

const placeholder = [
    '4', 'F', '2', 'Y', 'U', '0', '8',
    '1', '0', '2', 'K', 'V', '2', '6',
    '2', '5', '1',
]
const VIN_MAX_LENGTH = 17;

export const VinInput = ({
    onEnterPress,
    onChange,
    value = '',
    onError = () => {},
    readonly = false,
    inputStyle = ''
}) => {
    const classes = new BemHelper({name: 'vin-input'});
    const inputEl = useRef(null);
    const placeholderEl = useRef(null);

    const [inputWidth, setInputWidth] = useState(0)
    const [focused, setFocused] = useState(false)

    const changeValue = value => {
        value = toUpper(value)
        onChange(value)
    }

    const onInputChange = e => {
        onError(null);
        changeValue(e.target.value)

        setTimeout(() => {
            let width = 0;
            placeholderEl.current
                .querySelectorAll('.mustins-vin-input__symbol--hidden')
                .forEach(s => {
                    width += s.clientWidth
                })
            setInputWidth(width)
        }, 0)
    }

    const onPaste = e => {
        e.preventDefault()
        onError(null);

        const input = e.clipboardData.getData('Text') || '';
        let vin = input.replace(/[^0-9a-z]/gi, '')

        vin = vin.slice(0, VIN_MAX_LENGTH)

        changeValue(vin)
    }

    const onKeyPress = e => {
        onError(null);

        const isPasting = e.metaKey && toUpper(e.key) === 'V'
        if (isPasting) {
            return;
        }

        if (e.key === 'Enter') {
            onEnterPress()
        }

        if (!/[0-9a-z]/i.test(e.key)) {
            e.preventDefault();
            onError('Используй только латиницу и цифры');
        }
    };

    return (
        <div {...classes(null, [focused ? 'focused' : '', inputStyle])}>
            <div
                {...className('input')}
                onClick={() => inputEl && inputEl.current.focus()}>

                <div {...classes('placeholder')} ref={placeholderEl}>
                    {
                        placeholder.map((s, i) => {
                            let isValue = value.length - 1 >= i;
                            return (
                                <div
                                    key={`vin-placeholder-${i}`}
                                    {...classes('symbol', isValue ? 'value' : '')}
                                >{isValue ? value[i] : s}</div>
                            )
                        })
                    }
                </div>
                {
                    !readonly &&
                    <input
                        style={{width: inputWidth || '100%'}}
                        maxLength={17}
                        ref={inputEl}
                        value={value}
                        {...classes('field')}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onPaste={onPaste}
                        onKeyPress={onKeyPress}
                        onChange={onInputChange}/>
                }

            </div>
            {
                !readonly &&
                <div {...classes('question')}>
                    <Tooltip activator={<QuestionSvg {...classes('question__icon')}/>}>
                        17-ти символьный VIN код можно найти в свидетельстве о регистрации или тех. паспорте
                    </Tooltip>
                </div>
            }
        </div>
    )
}

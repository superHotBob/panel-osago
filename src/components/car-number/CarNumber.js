import React from 'react';
import './car-number.scss';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import includes from 'lodash/includes';
import toUpper from 'lodash/toUpper';
import EllipseSvg from 'svg/ellipse.svg';
import RusSvg from 'svg/rus.svg';
import {BemHelper} from "../../utils/class-helper";

const LETTERS = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х', 'A', 'B', 'E', 'K', 'M', 'H', 'O', 'P', 'C', 'T', 'Y', 'X'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const LETTERS_STR = LETTERS.join('');
const DIGITS_STR = DIGITS.join('');


const DIGIT_MESSAGE = 'Введите цифру'
const LETTER_MESSAGE = <span>Используйте буквы: A B E K M H O P C T У X</span>

const classes = new BemHelper({name: 'car-number'});

export class CarNumber extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            focused: false
        }

        this.regionInputRef = React.createRef();
        this.numberHiddenInputRef = React.createRef();
        this.numberRef = React.createRef();
    }

    handleError = (beforeValue, afterValue) => {
        const diffChar = beforeValue.split(afterValue).join('')

        const {number, onError} = this.props;
        let allowedSymbols;
        if (size(number) === 0 || size(number) === 4 || size(number) === 5) {
            allowedSymbols = LETTERS;
        } else {
            allowedSymbols = DIGITS;
        }

        if (!includes(allowedSymbols, toUpper(diffChar))) {
            if (size(number) < 6) {
                if (allowedSymbols !== DIGITS) {
                    onError(LETTER_MESSAGE)
                }
                if (allowedSymbols !== LETTERS) {
                    onError(DIGIT_MESSAGE)
                }
            }
        }
    }


    handleNumberChange = (e) => {
        const {onNumberChange, onError} = this.props;
        const originalValue = e.target.value;

        // remove not allowed symbols
        const regex = RegExp(String.raw`[^${LETTERS_STR}${DIGITS_STR}]`, 'gi')
        let number = originalValue.replace(regex, '')

        // get all allowed numbers and letters
        let result = ''
        const numbers = number.match(/(\d+)/gi)
        const letters = number.match(/(\D+)/gi)

        // if we have at least one letter
        if (letters) {
            let lettersStr = letters.join('')
            // we should use it as first letter value
            if (letters && lettersStr.length > 0) {
                result = lettersStr[0]
            }
            // if we have at least one number
            if (numbers) {
                let numbersStr = numbers.join('')
                // add 3 numbers after the first letter
                result += numbersStr.slice(0, 3)

                // if there were 3 or more numbers in the string, add 2 letters to the end
                if (numbersStr.length >= 3 && lettersStr.length > 1) {
                    result += lettersStr.slice(1, 3)
                }
            }
        }

        if (originalValue.length !== result.length) {
            this.handleError(originalValue, number)
        } else {
            onError(null)
        }

        // if no letters were in string, number will be empty

        onNumberChange(result);
        if (size(result) === 6) {
            this.regionInputRef.current.focus();
        }
    };

    handleRegionChange = (e) => {
        const {onRegionChange} = this.props;
        const region = e.target.value;
        onRegionChange(region);
    };

    handleNumberClick = () => {
        if (this.numberRef) {
            this.numberRef.current.focus();
        }
    };

    componentDidUpdate = () => {
        const {number} = this.props;
        if (!isEmpty(number)) {
            const letterSpacing = Math.floor(((-0.18278 * this.numberHiddenInputRef.current.offsetWidth * 6) / (size(number)) + 47.8684));
            if (this.numberRef) {
                this.numberRef.current.style.letterSpacing = `${letterSpacing}px`;
            }
        }
    };

    handleNumberKeyDown = (e) => {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            e.preventDefault();
        }

        if (e.key === 'Enter') {
            this.props.onEnterPress();
        }
    };

    handleRegionKeyPress = (e) => {
        const isPasting = e.metaKey && toUpper(e.key) == 'V' // pasting occurred
        if (isPasting) {
            return;
        }
        const {region} = this.props;
        if (!includes(DIGITS, toUpper(e.key))) {
            e.preventDefault();
            e.stopPropagation();
            if (size(region) < 2) {
                this.props.onError(DIGIT_MESSAGE)
            }
        } else {
            this.props.onError(null)
        }

        if (e.key === 'Enter') {
            this.props.onEnterPress();
        }
    };

    handleOnPaste = (e) => {
        const {onRegionChange, number, onNumberChange} = this.props;
        const text = e.clipboardData.getData('Text') || '';
        if (!includes(LETTERS, toUpper(text[0]))
            || !includes(DIGITS, toUpper(text[1]))
            || !includes(DIGITS, toUpper(text[2]))
            || !includes(DIGITS, toUpper(text[3]))
            || !includes(LETTERS, toUpper(text[4]))
            || !includes(LETTERS, toUpper(text[5]))) {
            e.preventDefault();
            return;
        }
        if (size(number) > 0) {
            e.preventDefault();
            onNumberChange(text.slice(0, 6));
        }
        this.props.onError(null)
        if (size(text) > 6) {
            const region = text.slice(6);
            if (/^\d+$/.test(region)) {
                onRegionChange(region.slice(0, 3));
            }
        }
    };

    handleOnRegionPaste = (e) => {
        const {onRegionChange} = this.props;
        const text = e.clipboardData.getData('Text') || '';
        if (!includes(DIGITS, toUpper(text[0]))
            || !includes(DIGITS, toUpper(text[1]))
            || (!!text[2] && /[^0-9]/.test(text[2]))) {
            e.preventDefault();
            return;
        }
        this.props.onError(null)
        if (/^\d+$/.test(text)) {
            e.preventDefault();
            onRegionChange(text.slice(0, 3));
        }
    };

    handleRegionBlur = () => {
        this.props.onError(null)
        this.setFocused(false)
    };

    setFocused = focused => {
        this.setState({focused});
    };

    render() {
        const {number, region, readonly, inputStyle} = this.props;
        const {focused} = this.state;

        const modifiers = [
            this.props.error ? 'error' : null,
            inputStyle ? inputStyle : null,
            focused ? 'focused' : null,
            readonly ? 'readonly' : null,
        ]

        return (
            <div {...classes(null, modifiers)}>
                <EllipseSvg {...classes('left-ellipse')}/>
                <input {...classes('number-input')}
                       ref={this.numberRef}
                       onChange={this.handleNumberChange}
                       maxLength="6"
                       inputMode={size(number) >= 1 && size(number) < 4 ? 'decimal' : 'text'}
                       onFocus={() => this.setFocused(true)}
                       onBlur={() =>this.setFocused(false)}
                       onKeyDown={this.handleNumberKeyDown}
                       onPaste={this.handleOnPaste}
                       disabled={readonly}
                       value={number}/>
                <div {...classes('number')} onClick={this.handleNumberClick}>
                    <div {...classes('character', ['small', number[0] ? 'active' : null])}>
                        {number[0] ? number[0] : 'a'}
                    </div>
                    <div {...classes('digits-row')}>
                        <div {...classes('character', ['big', number[1] ? 'active' : null])}>
                            {number[1] ? number[1] : '1'}
                        </div>
                        <div {...classes('character', ['big', number[2] ? 'active' : null])}>
                            {number[2] ? number[2] : '2'}
                        </div>
                        <div {...classes('character', ['big', number[3] ? 'active' : null])}>
                            {number[3] ? number[3] : '3'}
                        </div>
                    </div>
                    <div {...classes('character', ['small', number[4] ? 'active' : null])}>
                        {number[4] ? number[4] : 'a'}
                    </div>
                    <div {...classes('character', ['small', number[5] ? 'active' : null])}>
                        {number[5] ? number[5] : 'a'}
                    </div>
                </div>
                <span {...classes('number', 'hidden')} ref={this.numberHiddenInputRef}>
          {number}
        </span>
                <div  {...classes('region-container', 'small')}>
                    <input {...classes('region-input')}
                           value={region}
                           type="text"
                           maxLength={3}
                           placeholder="123"
                           onKeyPress={this.handleRegionKeyPress}
                           ref={this.regionInputRef}
                           disabled={readonly}
                           inputMode="decimal"
                           onFocus={() => this.setFocused(true)}
                           onBlur={this.handleRegionBlur}
                           onChange={this.handleRegionChange}
                           onPaste={this.handleOnRegionPaste}
                    />
                    <RusSvg {...classes('rus')}/>
                </div>
                <EllipseSvg {...classes('right-ellipse')}/>
            </div>
        );
    }

}

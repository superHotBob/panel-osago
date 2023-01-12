import React from 'react';
import './phone-number.scss';
import {func, string, bool} from 'prop-types';
import size from 'lodash/size';
import {BemHelper, className} from "../../utils/class-helper";
import {startsWith} from "lodash";
import {Typography, TypographyColor, TypographyType} from "../typography/Typography";

const classes = new BemHelper({name: 'phone-number'});

function disableSelection(el) {
    el.addEventListener('select', function () {
        this.selectionStart = this.selectionEnd;
    }, false)
}

const MIN_MASKED_VALUE_LENGTH = 4
const SYMBOLS_TO_SKIP = ['7', '8']

export class PhoneNumber extends React.Component {

    static propTypes = {
        onNumberChange: func,
        onEnter: func,
        number: string,
        focused: bool,
        disabled: bool
    };

    static defaultProps = {
        onNumberChange() {
        },
        onEnter() {
        }
    };

    state = {
        focus: false,
        // приводит "+7(" в состояние, как будто она введена
        isFieldActive: !!this.props.number,
    };

    numberInputRef = React.createRef();
    numberHiddenInputRef = React.createRef();

    componentDidMount() {
        disableSelection(this.numberInputRef.current)
    }

    componentDidUpdate(prevProps) {
        if (this.props.number !== prevProps.number && this.props.number.length > 0) {
            this.setState({
                isFieldActive: true,
            })
        }
        if (this.props.focused !== prevProps.focused && this.props.focused) {
            this.setState({
                focus: true,
            })
            this.handleNumberClick()
        }
    }

    getLastTypedSymbol = e => {
        const {value, selectionStart} = e.target
        switch (true) {
            case selectionStart === 3:
                return value.slice(2, 3)
            case selectionStart < 3:
                return value[selectionStart - 1]
            default:
                return e.target.value[size(e.target.value) - 1]
        }
    }

    checkShouldSkipSymbol = (e) => {
        const lastTyped = this.getLastTypedSymbol(e)
        const {value} = e.target
        if (!this.state.isFieldActive) {
            if (value.length >= MIN_MASKED_VALUE_LENGTH) {
                this.setState({
                    isFieldActive: true
                })
                // Если в инпуте минимальное количество символов и последний находится в списке, заменяющих 7
                // то этот символ нужно пропускать
                return SYMBOLS_TO_SKIP.includes(lastTyped) && value.length === MIN_MASKED_VALUE_LENGTH
            }
        }
    }

    handleNumberChange = (e, substrEndPos = 10) => {
        e.persist()
        const {onNumberChange} = this.props;
        const value = e.target.value || '';
        const numbersArray = value.match(/\d/g) || [];
        let number = numbersArray.join('') || '';
        const lastTypedSymbol = this.getLastTypedSymbol(e)
        if (this.checkShouldSkipSymbol(e)) return
        // Если курсор стоит в + или 7, то нужно взять первый введенный символ,
        // который будет перед 7 и поставить его вместо 7
        if (this.numberInputRef.current.selectionStart <= 3) {
            number = `${lastTypedSymbol}`
        } else {
            // режет 7 в начале
            number = number.slice(1)
        }

        return onNumberChange(number.substring(0, substrEndPos));
    };

    handleNumberClick = () => {
        this.numberInputRef.current.focus();
    };

    handleNumberKeyDown = (e) => {
        const vKey = 86;
        const {number} = this.props
        if (e.key === 'Backspace') {
            e.preventDefault()
            this.setState({isFieldActive: number.length > 1})
            this.handleNumberChange(e, number.length - 1)
        }

        if (
            (e.keyCode < 48 || e.keyCode > 57) &&
            e.keyCode !== 46 &&
            e.keyCode !== 8 &&
            e.key !== 'Enter' &&
            // allows ctrl-v
            !((e.ctrlKey || e.cmdKey) && e.keyCode === vKey) &&
            // allows numpad
            !(e.keyCode >= 96 && e.keyCode <= 105)
        ) {
            e.preventDefault();
        }
    };

    handleKeyPress = (e) => {
        const {onEnter} = this.props;
        if (e.key === 'Enter') {
            onEnter();
        }
    };

    renderChar(number, emptyChar) {
        return (
            <Typography
                color={number ? TypographyColor.BLACK : TypographyColor.GRAY}
                type={TypographyType.SUBHEAD}
            >
                {number ? number : emptyChar || '*'}
            </Typography>
        )
    }

    renderHolder(number, holder) {
        return (
            <Typography color={number ? TypographyColor.BLACK : TypographyColor.GRAY} type={TypographyType.SUBHEAD}>
                {holder}
            </Typography>
        )
    }

    handleFocus = () => {
        this.setState({focus: true, isFieldActive: !!this.props.number});
    };

    handleBlur = () => {
        this.setState({focus: false});

        if (this.props.onBlur) {
            this.props.onBlur(this.props.number);
        }
    };

    handlePaste = (e) => {
        e.preventDefault()
        const val = e.clipboardData.getData('text/plain')
        if (val) {
            let numberVal = val.replace(/[^0-9]/g, '')
            if (startsWith(numberVal, '8') || startsWith(numberVal, '7')) {
                numberVal = numberVal.slice(1)
            }

            this.setState({
                isFieldActive: !!numberVal
            })

            this.props.onNumberChange(numberVal);
        }
    }

    maskNumber(number) {
        const length = number.toString().length

        if (!length && !this.state.focus) return ''

        let res = '+7('

        switch (true) {
            case (length === 3):
                return `${res}${number})`
            case (length > 3 && length <= 5):
                return `${res}${number.substring(0, 3)})${number.substring(3, 5)}`
            case (length > 5 && length <= 7):
                return `${res}${number.substring(0, 3)})${number.substring(3, 6)}-${number.substring(6, 7)}`
            case (length > 7):
                return `${res}${number.substring(0, 3)})${number.substring(3, 6)}-${number.substring(6, 8)}-${number.substring(8, 10)}`
            default:
                return `${res}${number}`
        }
    }

    render() {
        const {number, disabled} = this.props;
        const {focus, isFieldActive} = this.state;

        return (
            <div {...classes(null, disabled ? 'disabled' : '', [className('form-control', true)])}>
                <input className='mustins-input'
                       ref={this.numberInputRef}
                       inputMode="tel"
                       disabled={disabled}
                       name="phone"
                       onChange={this.handleNumberChange}
                       onKeyPress={this.handleKeyPress}
                       onFocus={this.handleFocus}
                       onPaste={this.handlePaste}
                       onBlur={this.handleBlur}
                       placeholder={focus ? '' : '+7(***)***-**-**'}
                       onKeyDown={this.handleNumberKeyDown}
                       value={this.maskNumber(number)}
                />

                <div {...classes('number', (focus || size(number)) ? 'focused' : '')} onClick={this.handleNumberClick}>
                    <div {...classes('digits-row')}>
                        {this.renderHolder(isFieldActive, '+')}
                        {this.renderHolder(isFieldActive, '7')}
                        {this.renderHolder(isFieldActive, '(')}

                        {this.renderChar(number[0])}
                        {this.renderChar(number[1])}
                        {this.renderChar(number[2])}

                        {this.renderHolder(number[2], ')')}

                        {this.renderChar(number[3])}
                        {this.renderChar(number[4])}
                        {this.renderChar(number[5])}

                        {this.renderHolder(number[5], '-')}

                        {this.renderChar(number[6])}
                        {this.renderChar(number[7])}

                        {this.renderHolder(number[7], '-')}

                        {this.renderChar(number[8])}
                        {this.renderChar(number[9])}
                    </div>
                    <span {...classes('number', 'hidden')} ref={this.numberHiddenInputRef}>
            {number}
          </span>
                </div>
            </div>
        );
    }
}

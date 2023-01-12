import React from 'react';
import {bool, func, string} from 'prop-types';

export class Email extends React.Component {

    static propTypes = {
        email: string,
        onEmailChange: func,
        onEnter: func,
        disabled: bool,
        placeholder: string,
    };

    static defaultProps = {
        onEmailChange() {
        },
        onEnter() {

        }
    };

    handleEmailChange = (e) => {
        const value = e.target.value;
        const {onEmailChange} = this.props;
        onEmailChange(value);
    };

    handleKeyPress = (e) => {
        const {onEnter} = this.props;
        if (e.key === 'Enter') {
            onEnter();
        }
    };

    handleBlur = () => {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    render() {
        const {email, disabled, inputRef, placeholder} = this.props;
        return (
            <input
                className='mustins-input'
                value={email}
                ref={inputRef}
                type="email"
                name="email"
                onBlur={this.handleBlur}
                disabled={disabled}
                onChange={this.handleEmailChange}
                onKeyPress={this.handleKeyPress}
                inputMode="email"
                placeholder={placeholder || "Введи свой email..."}
            />
        );
    }

}

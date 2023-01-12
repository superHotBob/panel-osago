import React from 'react';
import './sms-code.scss';
import { func, string, bool } from 'prop-types';
import {BemHelper, className} from "../../utils/class-helper";

const classes = new BemHelper({name: 'sms-code'});

export class SmsCode extends React.Component {

  static propTypes = {
    onSmsCodeChange: func,
    onEnter: func,
    smsCode: string,
    disabled: bool
  };

  static defaultProps = {
    onSmsCodeChange() {
    },
    onEnter() {
    }
  };

  smsCodeInputRef = React.createRef();

  componentDidMount() {
      this.smsCodeInputRef.current.focus()
  }

  handleSmsCodeChange = (e) => {
    const { onSmsCodeChange } = this.props;
    const smsCode = e.target.value;
    onSmsCodeChange(smsCode);
  };

  handleSmsCodeKeyDown = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 46 && e.keyCode !== 8 && e.key !== 'Enter' && !(e.keyCode >= 96 && e.keyCode <= 105)) {
      e.preventDefault();
    }
  };

  handleOnPaste = e => {
      const val = e.clipboardData.getData('text/plain')
      if (val) {
          let numberVal = val.replace( /[^0-9]/g, '').slice(0, 4)
          this.props.onSmsCodeChange(numberVal);
      }
  }

  handleKeyPress = (e) => {
    const {onEnter} = this.props;
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  render() {
    const { smsCode, disabled = false } = this.props;
    return (
      <div {...classes(null, null, [className('form-control', true)])}>
        <input {...classes('input')}
          ref={this.smsCodeInputRef}
          disabled={disabled}
          onChange={this.handleSmsCodeChange}
          onKeyPress={this.handleKeyPress}
          onPaste={this.handleOnPaste}
          onFocus={this.onFocus}
          inputMode="decimal"
           name="smscode"
          maxLength="4"
          placeholder="1234"
          onKeyDown={this.handleSmsCodeKeyDown}
          value={smsCode} />
      </div>
    );
  }
}

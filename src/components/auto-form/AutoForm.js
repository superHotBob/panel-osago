import React from 'react';
import './auto-form.scss';
import {bool, func, string} from 'prop-types';
import ManSvg from 'svg/man.svg';
import {CarNumber} from '../car-number/CarNumber';
import {Text, TextColor, TextSize} from '../text/Text';
import {Email} from '../email/Email';
import {Button} from '../button/Button';
import {Checkbox} from '../checkbox/Checkbox';
import size from 'lodash/size';
import {isCarNumberValid} from 'validation/isCarNumberValid';
import {selectAuth} from "../../redux/authReducer";
import {connect} from "react-redux";
import {agreementValidator, emailValidator} from "../../validators";
import {withFormHook} from "../../hoc/withFormHook";
import {FormGroup} from "../form-group/FormGroup";
import {carNumberValidator} from "../../validators";
import {selectLoading} from "../../redux/loadingReducer";
import {className} from "../../utils/class-helper";

function shouldFocusOnEmail(number, region) {
    return isCarNumberValid(number, region) && size(region) === 3;
}

class AutoFormComponent extends React.Component {
    emailInputRef = React.createRef();

    static propTypes = {
        onFormUpdate: func,
        onButtonClick: func,
        number: string,
        fullNumber: string,
        region: string,
        email: string,
        checked: bool,
        onNumberChange: func,
        onRegionChange: func,
        onEmailChange: func,
        onCheckedChange: func,
        disabled: bool
    };

    state = {
        carNumberError: null
    }

    componentDidMount() {
        const {register} = this.props

        register(...carNumberValidator('fullNumber'))
        register(...agreementValidator())

        if (!this.props.isLoggedIn) {
            this.props.register(...emailValidator())
        }

        this.props.setValue('agreement', true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.unregister('email')
        } else if (prevProps.isLoggedIn && !this.props.isLoggedIn) {
            this.props.register(...emailValidator())
            this.props.setValueAndClearError('email', '')
        }
    }

    handleNumberChange = number => {
        const {region, onNumberChange, email} = this.props;
        onNumberChange(number);

        if (shouldFocusOnEmail(number, region) && (this.props.errors.email || !email)) {
            setTimeout(() => {
                if (this.emailInputRef && this.emailInputRef.current) {
                    this.emailInputRef.current.focus();
                }
            }, 100)

        }
    };

    handleRegionChange = region => {
        const {number, onRegionChange, email} = this.props;
        onRegionChange(region);

        if (shouldFocusOnEmail(number, region) && (this.props.errors.email || !email)) {
            setTimeout(() => {
                if (this.emailInputRef && this.emailInputRef.current) {
                    this.emailInputRef.current.focus();
                }
            }, 100)
        }
    };

    handleEmailChange = email => {
        const {onEmailChange} = this.props;
        onEmailChange(email);
        this.props.setValueAndClearError('email', email)
    };

    onAgreementChange = () => {
        const {onCheckedChange, checked} = this.props;

        this.props.setValueAndClearError('agreement', !checked)
        onCheckedChange(!checked);
    };

    handleEnter = () => {
        const {onButtonClick} = this.props;

        if (this.props.isFormValid()) {
            onButtonClick();
        }
    };

    onCarNumberError = errorText => {
        this.setState({carNumberError: errorText})
    }

    render() {
        const {number, region, email, checked, disabled, numberRef} = this.props;
        return (
            <form className="auto-form" noValidate={true}>
                <div className="auto-form__man">
                    <ManSvg className="auto-form__man-svg"/>
                </div>
                <div>
                    <FormGroup error={this.props.errors.fullNumber || this.state.carNumberError}
                               label={'Введи гос. номер грузовика'}>
                        <CarNumber number={number}
                                   error={this.props.errors.fullNumber}
                                   onError={this.onCarNumberError}
                                   numberRef={numberRef}
                                   region={region}
                                   onNumberChange={this.handleNumberChange}
                                   readonly={disabled}
                                   onRegionChange={this.handleRegionChange}/>
                    </FormGroup>
                </div>

                {
                    !this.props.user &&
                    (
                        <div>
                            <FormGroup error={this.props.errors.email} label={'Ваш email для отчета'}>
                                <Email
                                    inputRef={this.emailInputRef}
                                    email={email}
                                    onEmailChange={this.handleEmailChange}
                                    onEnter={this.handleEnter}
                                />
                            </FormGroup>
                        </div>
                    )
                }

                <div {...className(['mt-12', 'mb-24'])}>
                    <Button
                        loading={this.props.loading.accidentPredictionInit}
                        onClick={this.props.handleSubmit(this.handleEnter)}>Узнать
                        вероятность ДТП</Button>
                </div>

                <FormGroup error={this.props.errors.agreement} showError={false}>
                    <Checkbox name="agreement"
                              checked={checked}
                              onChange={this.onAgreementChange}
                              labelAsFootnote={true}
                              label='Я согласен на обработку моих персональных данных в целях расчета'/>
                </FormGroup>
            </form>
        );
    }

}

const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export const AutoForm = connect(mapStateToProps)(withFormHook(AutoFormComponent, ['fullNumber']))

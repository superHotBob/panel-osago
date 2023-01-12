import React from 'react';
import {func, bool, number} from 'prop-types';
import {AccidentErrorView} from './AccidentErrorView';
import {AccidentSuccessView} from './AccidentSuccessView';
import {Modal} from "../modal/Modal";
import {selectLoading} from "../../redux/loadingReducer";
import {connect} from "react-redux";
import AuthContainer from "../auth/AuthContainer";
import {apply} from "./MainPanelModel";

class AccidentFormComponent extends React.Component {
    static propTypes = {
        onErrorHide: func,
        closeModal: func,
        showModal: bool,
        predictionId: number
    };

    state = {
        number: '',
        smsCode: '',
        name: '',
        errorCode: '',
        error: '',
        phoneNumber: '',
        otpState: null,
        countdown: 1,
        innerView: 'initial'
    }

    headerColor = () => {
        const {errorCode} = this.state;
        if (!errorCode)
            return '';

        switch (errorCode) {
            case 1102:
            case 1103:
            case 1204:
                return 'yellow';
            case 1201:
            case 1202:
            case 1203:
            case 1301:
                return 'red';
            default:
                return '';
        }
    }

    headerText = () => {
        const {innerView, errorCode, phoneNumber} = this.state;
        if (errorCode) {
            switch (errorCode) {
                case 1102:
                case 1103:
                case 1204:
                    return <span> гос.номер содержит ошибки <br/>или принадлежит <br/>легковому автомобилю</span>;
                case 1201:
                case 1202:
                case 1203:
                case 1301:
                    return <span> расчёт вероятности ДТП<br/> для указанного гос. номера<br/> не доступен</span>;
                default:
                    return <span> расчёт вероятности ДТП<br/> для указанного гос. номера<br/> не доступен</span>;
            }
        }

        switch (innerView) {
            case 'initial':
                return <span>оставь свои данные<br/>и я назначу тебе <br/> страхового агента</span>;
            case 'smsCode':
                return <span>мы отправили СМС с кодом<br/>на номер +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>;
            case 'success':
                return <span>я назначил тебе страхового <br/>агента, он позвонит<br/>в ближайшее время</span>;
            default:
                return <span>оставь свои данные<br/>и я назначу тебе <br/> страхового агента</span>;
        }
    }

    setSmsCodeView = () => {
        this.setState({
            innerView: 'smsCode',
            errorCode: null,
            error: null
        });
    }

    onPhoneConfirmed = async () => {
        const applyResponse = await apply(this.props.predictionId, this.state.name);
        if (applyResponse.status === 200) {
            this.setSuccessInnerView()
        }
    }

    setSuccessInnerView = () => {
        this.setState({
            innerView: 'success',
            errorCode: null,
            error: null
        });
    }

    onNumberChange = (number) => {
        this.setState({number: number});
    }

    onOtpStateChange = (phoneNumber, name) => {
        name = name || this.state.name;
        this.setState({
            phoneNumber: phoneNumber,
            name: name
        });

        this.setSmsCodeView();
    }

    handleErrorClick = () => {
        this.hide();
        this.props.onErrorHide();
    };

    renderInnerView() {
        const {innerView, errorCode, error, phoneNumber} = this.state;
        switch (innerView) {
            case 'initial':
                return (
                    <AuthContainer
                        shortRegistrationMode
                        canSwitchForm={false}
                        initialStep='registration'
                        onCodeSent={this.onOtpStateChange}
                        buttonText='ПОЛУЧИТЬ ОСАГО'
                        loginLabelText=''
                    />
                )
            case 'smsCode':
                return (
                    <AuthContainer
                        initialPhoneNumber={phoneNumber}
                        initialStep='sms'
                        onPhoneConfirmed={this.onPhoneConfirmed}
                        onCodeSent={this.onOtpStateChange}
                    />
                );
            case 'success':
                return <AccidentSuccessView closeModal={this.props.closeModal}/>;
            case 'error':
                return <AccidentErrorView errorCode={errorCode} error={error} onClick={this.handleErrorClick}/>;

            default:
                return (
                    <AuthContainer
                        shortMode
                        canSwitchForm={false}
                        initialStep='registration'
                        onCodeSent={this.onOtpStateChange}
                        buttonText='ПОЛУЧИТЬ ОСАГО'
                    />
                );
        }
    }

    render() {
        const {showModal} = this.props;
        return (
            <Modal
                loading={this.props.loading.submitSmsCode || this.props.loading.resendCode}
                isOpened={showModal}
                title={<span>Привет, я Штурман,<br/>твой электронный помощник.</span>}
                description={this.headerText()}
                color={this.headerColor()}
                onClose={this.props.closeModal}>
                {this.renderInnerView()}
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    loading: selectLoading(state)
})

export const AccidentForm = connect(mapStateToProps)(AccidentFormComponent)

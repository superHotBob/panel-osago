import React, {Component} from 'react';

import {SmsCode} from 'components/sms-code/SmsCode';
import {Text, TextColor, TextFont, TextSize} from 'components/text/Text';
import {Countdown} from 'components/countdown/Countdown';
import {Button} from 'components/button/Button';
import {apply, initOtp, login} from "./MainPanelModel";
import errorCodes from "utils/errorCodes";
import api from "api";
import {selectAuth} from "../../redux/authReducer";
import {connect} from "react-redux";
import {Modal} from "../modal/Modal";
import {bool, func, number} from "prop-types";
import {endLoadingAction, selectLoading, startLoadingAction} from "../../redux/loadingReducer";
import AuthContainer from "../auth/AuthContainer";

class AccidentBuyOsago extends Component {
    static propTypes = {
        isShowPopup: bool,
        closeModal: func,
        predictionId: number
    };

    state = {
        otpState: '',
        countdown: 1,
        error: null,
        smsCode: '',
        isSuccess: false,
    };

    onSuccess = async () => {
        const {
            firstName,
        } = this.props.user;

        this.props.dispatch(startLoadingAction('accidentLoggedInSubmitCode'))

        const {predictionId} = this.props;
        const response = await api('/prediction/apply', 'POST', {
            predictionId,
            name: firstName,
        });

        if (response.status === 200) {
            this.setState({
                isSuccess: true,
            });
        }
        this.props.dispatch(endLoadingAction('accidentLoggedInSubmitCode'))

    };

    render() {
        if (!this.props.user) {
            return null;
        }

        const {phone} = this.props.user;
        const {
            isSuccess,
        } = this.state;

        const successTitle = <span>Все сделано!<br/>Благодарю, за выбор MUSTINS.RU</span>
        const headerText = phone
            ? <span>мы отправили СМС с кодом<br/>на номер +7({phone.substr(2, 3)})***-**-{phone.substr(-2)}</span>
            : '';
        const headerTitle = phone ? <span>Нужно подтвердить<br/>твой номер телефона</span> : ''
        // const successText = <span>я назначил тебе страхового <br />агента, он позвонит<br />в ближайшее время</span>;
        const successText = <span>я назначил тебе страхового <br/> агента, он позвонит<br/> в ближайшее время</span>;

        return (
            <Modal
                isOpened={this.props.isShowPopup}
                title={isSuccess ? successTitle : headerTitle}
                description={isSuccess ? successText : headerText}
                loading={this.props.loading.submitSmsCode || this.props.loading.resendCode}
                onClose={this.props.closeModal}>
                {
                    this.state.isSuccess ?
                        <Button onClick={this.props.closeModal}>Спасибо, ожидаю</Button> :
                        <AuthContainer
                            initialStep='sms'
                            onPhoneConfirmed={this.onSuccess}
                            initialPhoneNumber={phone.slice(2)}
                        />
                }
            </Modal>
        )
    }
}


const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export default connect(mapStateToProps)(AccidentBuyOsago)

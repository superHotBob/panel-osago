import React, { PureComponent } from 'react';

import {IconSprite} from 'components/icon-sprite/IconSprite';
import AuthContainer from "../auth/AuthContainer";

import './registration.scss';
import {selectAuth} from "../../redux/authReducer";
import {connect} from "react-redux";
import {selectLoading} from '../../redux/loadingReducer'

class Registration extends PureComponent {
	state = {
		isShowPopup: false,
	};

	onSuccess = () => () => {
		this.setState({
			isShowPopup: false,
		});
	};

	toggleRegistrationPopup = () => {
		this.setState((state) => ({
			isShowPopup: !state.isShowPopup,
		}));
	};

	render() {
		const {
			isShowPopup,
		} = this.state;

		return (
			<>
                <div className="registration">
                    <button
                            onClick={ this.toggleRegistrationPopup }
                            className="registration__button"
                            id={'registationBtn'}
                            type="button"
                    >
                        <span className="registration__button-text">Я новый пользователь</span>
                        <span className="registration__button-icon">
										<IconSprite name="right-arrow"/>
									</span>
                    </button>
                </div>
                {isShowPopup && (
                        <AuthContainer
                                resetToInitialStepAfterClosed
                                loginLabelText='Телефон, если есть личный кабинет'
                                smsLabelStep='03'
                                onClose={() => this.setState({ isShowPopup: false })}
                                initialStep='registration'
                                shortRegistrationMode={this.props.shortMode}
                                isOpened
                                onPhoneConfirmed={this.onSuccess}
                                renderModal
                        />
                )
                }
			</>
		)
	}
}

const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export default connect(mapStateToProps)(Registration)

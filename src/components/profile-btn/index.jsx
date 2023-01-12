import React, { PureComponent } from 'react';
import routes from "../../routes";
import AppContext from "../../store/context";
import AuthContainer from "../auth/AuthContainer";

import {getUserInfo, profileLogout} from "../main-panel/MainPanelModel";
import {IconSprite} from 'components/icon-sprite/IconSprite';

import './profile-btn.scss';
import {connect} from "react-redux";
import {logoutAction, selectAuth, setAuthUserAction} from '../../redux/authReducer';
import { withRouter } from 'react-router-dom'
import {withRouter as withRouterHoc} from '../../hoc/withRouter'
import {selectLoading} from '../../redux/loadingReducer'

class ProfileBtn extends PureComponent {
    state = {
        isShowPopup: false,
    }

	logout = async (e) => {
        e.preventDefault();

        await profileLogout();

        this.props.dispatch(logoutAction())

        if (this.context.widgetId === 'must-accident') {
            // Если находимся в открытой части, то редиректить не нужно
            if (routes
                    .filter(r => r.isPrivate)
                    .some(r => r.path === this.props.location.pathname)) {
                this.props.history.push('/')
            }
        } else {
            if (window.location.pathname !== '/') window.location.href = '/'
        }
    }

    setUserName = async () => {
        if (this.props.isLoggedIn) {
            const response = await getUserInfo();

            if (response.status === 200) {
                const user = await response.json();

                this.props.dispatch(setAuthUserAction(user))
            }
        }
    };

    onSuccess = () => {
        this.setUserName();

        this.setState({
            isShowPopup: false,
        });
    };

	toggleLoginPopup = () => {
		this.setState((state) => ({
			isShowPopup: !state.isShowPopup,
		}));
	};

	render() {
		const {
			isShowPopup,
		} = this.state;

		if (this.props.user) {
			return (
				<div className="profile-btn">
					<a
						href='/profile'
						className="profile-btn__button"
					>
						<span className="profile-btn__icon">
							<IconSprite name="empty-user"/>
						</span>
						<span className="profile-btn__name">{ this.props.user.firstName || this.props.user.phone }</span>
					</a>

					<div className="profile-btn__popup">
						<div className="profile-btn__popup-item">
							<a
								href='/profile'
								className='profile-btn__popup-link profile-btn__popup-link_main'
							>
								<span>Мой профиль</span>
								<span className='profile-btn__popup-link-icon'>
									<IconSprite name="right-arrow"/>
								</span>
							</a>
						</div>

						<div className="profile-btn__popup-item">
                            <a
                                href='#'
                                className='profile-btn__popup-link'
                                onClick={ this.logout }
                            >Выйти</a>
						</div>
					</div>
				</div>
			)
		}

		return (
			<>
				<div className="profile-btn">
					<button
						onClick={ this.toggleLoginPopup }
						className="profile-btn__button"
						type="button"
					>
						<div className="profile-btn__icon">
							<IconSprite name="empty-user"/>
						</div>
						<div className="profile-btn__name" id={'loginBtn'}>Войти</div>
					</button>
				</div>
                {isShowPopup && (
                        <AuthContainer
                                resetToInitialStepAfterClosed
                                isOpened
                                onClose={() => this.setState({ isShowPopup: false })}
                                onPhoneConfirmed={this.onSuccess}
                                loginLabelText='Телефон, если есть личный кабинет'
                                renderModal
                        />
                )}
			</>
		)
	}
}

ProfileBtn.contextType = AppContext

const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export default withRouterHoc(withRouter(connect(mapStateToProps)(ProfileBtn)))

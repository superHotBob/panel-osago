import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import cn from 'classnames'
import isEqual from 'lodash/isEqual'

import api from 'api'
import errorCodes from 'utils/errorCodes'
import FlatBlock from 'components/flat-block'
import {Text, TextColor} from 'components/text/Text'
import {PhoneNumber} from 'components/phone-number/PhoneNumber'
import {Email} from 'components/email/Email'
import AppContext from 'store/context'
import {Button} from 'components/button/Button'
import SuccessLogo from 'svg/success.svg'
import {getUserInfo, initOtp} from 'components/main-panel/MainPanelModel'

import './profile.scss'
import {connect} from 'react-redux'
import AuthContainer from "../../components/auth/AuthContainer";
import withWidgetAuth from "../../hoc/withWidgetAuth";
import {selectAuth, setAuthUserAction, setOtpStateAction} from '../../redux/authReducer'
import {Modal} from '../../components/modal/Modal'
import {FormGroup} from '../../components/form-group/FormGroup'
import {emailValidator, nameValidator, phoneValidator} from '../../validators'
import {withFormHook} from '../../hoc/withFormHook'
import {endLoadingAction, selectLoading, startLoadingAction} from '../../redux/loadingReducer'
import {Sprite} from '../../components/sprite/Sprite';

let waiter
let changeWaiter

class ProfilePage extends Component {
    state = {
        firstName: (this.props.user && this.props.user.firstName) || '',
        lastName: (this.props.user && this.props.user.lastName) || '',
        phoneNumber: (this.props.user && this.props.user.phone && this.props.user.phone.substr(2)) || '',
        email: (this.props.user && this.props.user.email) || '',
        user: this.props.user,
        isFirstRender: true,
        isNameChange: false,
        isLastNameChange: false,
        isEmailChange: false,
        isShowPhonePopup: false,
        isShowEmailPopup: false,
        isWaitSms: false,
        otpState: '',
        error: null,
    }

    componentDidMount() {
        const {register} = this.props

        register(...emailValidator())
        register(...phoneValidator())
        register(...nameValidator('fname'))
        register(...nameValidator('lname', 'фамилия'))
    }

    setNewData = async ({firstName, lastName, email}, isFromLastName = false, isFromEmail = false) => {
        let dataToRefresh = {}

        if (firstName) {
            dataToRefresh = {
                firstName,
            }
        }

        if (lastName) {
            dataToRefresh = {
                ...dataToRefresh,
                lastName,
            }
        }

        if (email) {
            dataToRefresh = {
                ...dataToRefresh,
                email,
            }
        }

        const response = await api('/profile', 'POST', {
            ...dataToRefresh,
        })

        if (response.status === 200) {
            const user = await response.json()

            clearTimeout(changeWaiter)
            changeWaiter = this.setState({
                isNameChange: !isFromLastName && !isFromEmail,
                isLastNameChange: isFromLastName && !isFromEmail,
                isEmailChange: isFromEmail,
            }, () => {
                changeWaiter = setTimeout(() => {
                    this.setState({
                        isNameChange: false,
                        isLastNameChange: false,
                        isEmailChange: false,
                    })
                }, 2000)
            })

            this.props.dispatch(setAuthUserAction(user))
        }
    }

    handleNameChange = (e) => {
        this.props.setValueAndValidate('fname', e.target.value)

        this.setState({
            firstName: e.target.value,
        }, () => {
            clearTimeout(waiter)
            waiter = setTimeout(() => {
                if (this.props.errors.fname) {
                    return
                }
                this.setNewData({
                    firstName: this.state.firstName,
                })
            }, 500)
        })
    }

    handleSurNameChange = (e) => {
        this.props.setValueAndValidate('lname', e.target.value)

        this.setState({
            lastName: e.target.value,
        }, () => {
            clearTimeout(waiter)
            waiter = setTimeout(() => {
                if (this.props.errors.lname) {
                    return
                }
                this.setNewData({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                }, true)
            }, 500)
        })
    }

    handleNumberChange = async phoneNumber => {
        this.setState({phoneNumber})
        await this.props.setValueAndValidate('phone', phoneNumber)
    }

    handleNumberEnter = async () => {
        await this.props.setValueAndValidate('phone', this.state.phoneNumber)

        if (this.props.user) {
            if (
                    this.props.user.phone !== `+7${this.state.phoneNumber}`
                    && !this.props.errors.phone
            ) {
                this.setState({
                    isShowPhonePopup: true,
                })
            } else {
                this.setState({
                    phoneNumber: this.props.user.phone.substr(2),
                })
            }
        }
    }

    onPhonePopupClose = () => {
        this.setState({
            isShowPhonePopup: false,
            isWaitSms: false,
        })
    }

    sendSMS = async () => {
        this.props.dispatch(startLoadingAction('profileChangePhoneRequestCode'))
        const response = await initOtp('+7' + this.state.phoneNumber)
        const data = await response.json()

        if (data) {
            if (data.otpState) {
                this.props.dispatch(setOtpStateAction(data.otpState))
                this.setState({
                    isWaitSms: true,
                })
            } else {
                const error = errorCodes(data.errorCode)

                this.setState({
                    error,
                })
            }
        }
        this.props.dispatch(endLoadingAction('profileChangePhoneRequestCode'))

    }

    handleEmailChange = async email => {
        this.setState({email})
        await this.props.setValueAndValidate('email', email)
    }

    handleEmailEnter = async () => {
        await this.props.setValueAndValidate('email', this.state.email)

        if (this.props.user && this.props.user.email !== this.state.email && !this.props.errors.email) {
            this.setState({
                isShowEmailPopup: true,
            })
        }
    }

    onEmailChange = () => {
        this.setNewData({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
        }, false, true)

        this.setState({
            isShowEmailPopup: false,
        })
    }

    onEmailPopupClose = () => {
        this.setState({
            isShowEmailPopup: false,
        })
    }

    componentDidUpdate(prevProps) {
        if (
                this.state.isFirstRender
                && this.props.user
                && !isEqual(this.state.user, this.props.user)
        ) {
            const {
                firstName = '',
                lastName = '',
                email = '',
                phone = '',
            } = this.props.user

            this.setState({
                firstName,
                lastName,
                email,
                phoneNumber: phone && phone.length > 2 ? phone.substr(2) : '',
                isFirstRender: false,
            })
        }

        // if we logout from profile page
        if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn && window.location.pathname !== '/') {
            window.location.href = '/'
        }
    }

    setNewUser = async () => {
        if (this.props.isLoggedIn) {
            const response = await getUserInfo()

            if (response.status === 200) {
                const user = await response.json()

                this.props.dispatch(setAuthUserAction(user))
            }
        }
    }

    onPhoneSuccess = () => {
        this.setNewUser()

        this.setState({
            isShowPhonePopup: false,
            isWaitSms: false,
        })
    }

    render() {
        const {
            firstName,
            lastName,
            phoneNumber,
            email,
            isWaitSms,
            error,
        } = this.state

        return (
                <>
                    <div className="page page-profile__page">
                        <div className="wrapper">
                            {
                                this.props.isLoggedIn
                                        ? null
                                        : <Redirect to="/"/>
                            }
                            {
                                !this.props.user
                                        ? null
                                        : (
                                                <FlatBlock blockType='overflow'>
                                                    <div className="page-profile__main">
                                                        <div className="page-profile-column">
                                                            <div className="page-profile-column__item">

                                                                <div className="page-profile__input">
                                                                    <FormGroup error={this.props.errors.fname} label={'Имя'}>
                                                                        <input
                                                                                value={firstName}
                                                                                onChange={this.handleNameChange}
                                                                                className="mustins-input"
                                                                                placeholder="Введите свое имя..."
                                                                                name="fname"
                                                                        />
                                                                    </FormGroup>
                                                                    <SuccessLogo
                                                                            className={cn(
                                                                                    'page-profile__input-svg',
                                                                                    {'page-profile__input-svg_active': this.state.isNameChange}
                                                                            )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="page-profile-column__item">
                                                                <div className="page-profile__input">
                                                                    <FormGroup error={this.props.errors.lname}
                                                                               label={'Фамилия'}>
                                                                        <input
                                                                                value={lastName}
                                                                                onChange={this.handleSurNameChange}
                                                                                className="mustins-input"
                                                                                placeholder="Введи свою фамилию..."
                                                                                name="lname"
                                                                        />
                                                                    </FormGroup>

                                                                    <SuccessLogo
                                                                            className={cn(
                                                                                    'page-profile__input-svg',
                                                                                    {'page-profile__input-svg_active': this.state.isLastNameChange}
                                                                            )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="page-profile-column">
                                                            <div className="page-profile-column__item">
                                                                <FormGroup error={this.props.errors.phone} label={'Телефон'}>
                                                                    <PhoneNumber
                                                                            onNumberChange={this.handleNumberChange}
                                                                            onEnter={this.handleNumberEnter}
                                                                            number={phoneNumber}
                                                                            onBlur={this.handleNumberEnter}
                                                                    />
                                                                </FormGroup>


                                                                <Modal
                                                                        loading={this.props.loading.profileChangePhoneSubmitCode || this.props.loading.profileChangePhoneRequestCode}
                                                                        isOpened={this.state.isShowPhonePopup}
                                                                        title={(
                                                                                <span>вы обновляете телефон,<br/>мы отправим СМС с кодом<br/>на номер +7({phoneNumber.substr(0, 3)})***-**-{phoneNumber.substr(8, 2)}</span>)}
                                                                        onClose={this.onPhonePopupClose}
                                                                >
                                                                    {
                                                                        isWaitSms
                                                                                ? <AuthContainer
                                                                                        initialStep='sms'
                                                                                        onPhoneConfirmed={this.onPhoneSuccess}
                                                                                        initialPhoneNumber={phoneNumber}
                                                                                        type='migratePhone'
                                                                                />
                                                                                :
                                                                                <>
                                                                                    <div className="page-profile__btn">
                                                                                        <Button onClick={this.sendSMS}>Да, я
                                                                                            хочу изменить телефон</Button>
                                                                                    </div>
                                                                                    {
                                                                                        error
                                                                                                ?
                                                                                                <div className="mustins-modal__row">
                                                                                                    <Text color={TextColor.RED}>{error}</Text>
                                                                                                </div>
                                                                                                : null
                                                                                    }
                                                                                </>
                                                                    }
                                                                </Modal>
                                                            </div>

                                                            <div className="page-profile-column__item">
                                                                <FormGroup error={this.props.errors.email} label={'Email'}>
                                                                    <Email
                                                                            email={email}
                                                                            onEmailChange={this.handleEmailChange}
                                                                            onEnter={this.handleEmailEnter}
                                                                            onBlur={this.handleEmailEnter}
                                                                    />
                                                                </FormGroup>


                                                                <Modal
                                                                        isOpened={this.state.isShowEmailPopup}
                                                                        title={(
                                                                                <span>мы отправим письмо<br/>с подтверждением<br/>на новый email</span>)}
                                                                        onClose={this.onEmailPopupClose}
                                                                >
                                                                    <div className="page-profile__btn">
                                                                        <Button onClick={this.onEmailChange}>Да, я хочу изменить
                                                                            email</Button>
                                                                    </div>
                                                                </Modal>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </FlatBlock>
                                        )
                            }
                        </div>
                    </div>
                    <Sprite/>
                </>
        )
    }
}

ProfilePage.contextType = AppContext

const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export default connect(mapStateToProps)(withWidgetAuth(withFormHook(ProfilePage)))

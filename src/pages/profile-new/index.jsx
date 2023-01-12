import React, { Component, createRef, useRef } from "react";
import { Redirect } from "react-router-dom";
import api from "api";
import errorCodes from "utils/errorCodes";
import { PhoneNumber } from "components/phone-number/PhoneNumber";
import { Email } from "components/email/Email";
import AppContext from "store/context";
import { Text, TextColor } from "components/text/Text";
import { Button } from "components/button/Button";
import { getUserInfo, initOtp } from "components/main-panel/MainPanelModel";
import "./profile.scss";
import { connect } from "react-redux";
import withWidgetAuth from "../../hoc/withWidgetAuth";
import { selectAuth, setAuthUserAction, setOtpStateAction } from "../../redux/authReducer";
import { FormGroup } from "../../components/form-group/FormGroup";
import { withFormHook } from "../../hoc/withFormHook";
import { endLoadingAction, selectLoading, startLoadingAction } from "../../redux/loadingReducer";
import { Sprite } from "../../components/sprite/Sprite";
import { SubHeader } from "../../components/sub-header/sub-header";
import DateInput from "../../components/DateInput";
import DefaultSelect from "../../components/select";
import InputInnAutoComplete from "../../components/input-autocomplete/InputInnAutoComplete";
import { GENDER_OPTIONS_FULL, USER_ROLES } from "../../constants/osago";
import "../../components/insurance-form/autocomplete.scss";
import { Modal } from "../../components/modal/Modal";
import AuthContainer from "../../components/auth/AuthContainer";
import { emailValidator, nameValidator, phoneValidator } from '../../validators';
import {DateTime} from 'luxon';
import { GlobalAlert } from "../../components/global-alert/global-alert";

let waiter;
let changeWaiter;

class ProfileNewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            userId: this.props?.user?.userId || null,
            phone: this.props?.user?.phone || "",
            signedUpAt: this.props?.user?.signedUpAt || "",
            firstName: this.props?.user?.firstName || "",
            patronymic: this.props?.user?.patronymic || "",
            lastName: this.props?.user?.lastName || "",
            email: this.props?.user?.email || "",
            bornOn: this.props?.user?.bornOn || "",
            gender: this.props?.user?.gender || "",
            inn: this.props?.user?.inn || "",
            kpp: this.props?.user?.kpp || "",
            position: this.props?.user?.position || "",
            userType: this.props?.user?.userType || "",
            legalEntity: {
                title: this.props?.user?.legalEntity?.title || "",
                inn: this.props?.user?.legalEntity?.inn || "",
                kpp: this.props?.user?.legalEntity?.kpp || "",
                ogrn: this.props?.user?.legalEntity?.ogrn || "",
                series: this.props?.user?.legalEntity?.kpp || "",
                number: this.props?.user?.legalEntity?.number || "",
                issuedAt: this.props?.user?.legalEntity?.issuedAt || new Date(),
                legalAddress: {
                    cityFiasId: this.props?.user?.legalEntity?.legalAddress?.cityFiasId || "",
                    street: this.props?.user?.legalEntity?.legalAddress?.street || "",
                    streetKladrId: this.props?.user?.legalEntity?.legalAddress?.streetKladrId || "",
                    house: this.props?.user?.legalEntity?.legalAddress?.house || "",
                    building: this.props?.user?.legalEntity?.legalAddress?.building || "",
                    apartment: this.props?.user?.legalEntity?.legalAddress?.apartment || "",
                    zip: this.props?.user?.legalEntity?.legalAddress?.zip || "",
                    fullAddress: this.props?.user?.legalEntity?.legalAddress?.fullAddress || "",
                },
            },
            isConfirmedTermsOfService: this.props?.user?.isConfirmedTermsOfService || "",
            isAuthorizedPersonalDataProcessing: this.props?.user?.isAuthorizedPersonalDataProcessing || "",
            accidentPredictions: this.props?.user?.isAuthorizedPersonalDataProcessing || [],

            phoneStatic: null,
        };
        this.alertRef = createRef();
    }

    componentDidMount() {
        const { register } = this.props;
        this.getCurrentUserInfo();

        register(...emailValidator())
        register(...phoneValidator())
        register(...nameValidator('fname'))
        register(...nameValidator('lname', 'фамилия'))
    }

    getCurrentUserInfo = async () => {
        if (this.props.isLoggedIn) {
            const userInfoResponse = await getUserInfo();

            if (userInfoResponse.status === 200) {
                const userInfo = await userInfoResponse.json();

                this.state.phoneStatic = userInfo.phone;

                // Set to local state
                this.setProfileInfo(userInfo);

                // Set to global state
                this.props.dispatch(setAuthUserAction(userInfo));

                this.setState({
                    isLoad: true
                })
            }
        }
    };

    handleEmailEnter = async () => {
        // await this.props.setValueAndValidate('email', this.state.email)
        // && !this.props.errors.email
        if (this.props.user && this.props.user.email !== this.state.email) {
            this.setState({
                isShowEmailPopup: true,
            });
        }
    };

    setProfileInfo(user) {
        Object.keys(user).forEach((key) => {
            if (key === "phone") {
                this.stateInfoChange(key, user[key].substr(2));
            } else {
                this.stateInfoChange(key, user[key]);
            }
        });
    }

    stateInfoChange(field, value) {
        const newField = {};
        if (field === "bornOn") {
            const dateFormated = new Date(value);
            newField[field] = dateFormated;
            this.setState(newField);
        } else if (field === "phone") {
            newField[field] = value;

            this.props.setValueAndValidate(field, value);

            this.setState(newField, () => {
                this.handleNumberEnter();
            });
        } else {
            newField[field] = value;
            this.setState(newField);
        }
    }

    onEmailPopupClose = () => {
        this.setState({
            isShowEmailPopup: false,
        });
    };

    saveUpdateData = async () => {
        const updateDate = {
            firstName: this.state.firstName,
        };
        this.state.patronymic && (updateDate.patronymic = this.state.patronymic);
        this.state.lastName && (updateDate.lastName = this.state.lastName);
        this.state.position && (updateDate.position = this.state.position);
        this.state.email && (updateDate.email = this.state.email);
        this.state.bornOn && (updateDate.bornOn = this.state.bornOn);
        this.state.gender && (updateDate.gender = this.state.gender);
        this.state.inn && (updateDate.inn = this.state.inn);
        this.state.kpp && (updateDate.kpp = this.state.kpp);
        this.state.userType && (updateDate.userType = this.state.userType.value);

        const response = await api("/profile", "POST", updateDate);

        if (response.status === 200) {
            this.getCurrentUserInfo();
            this.alertRef.current.showAlert('Изменения сохранены');
        }
    };

    onEmailChange = () => {
        this.setNewData(
            {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
            },
            false,
            true
        );

        this.setState({
            isShowEmailPopup: false,
        });
    };

    setNewData = async ({ firstName, lastName, email }, isFromLastName = false, isFromEmail = false) => {
        let dataToRefresh = {};

        if (firstName) {
            dataToRefresh = {
                firstName,
            };
        }

        if (lastName) {
            dataToRefresh = {
                ...dataToRefresh,
                lastName,
            };
        }

        if (email) {
            dataToRefresh = {
                ...dataToRefresh,
                email,
            };
        }

        const response = await api("/profile", "POST", {
            ...dataToRefresh,
        });

        if (response.status === 200) {
            const user = await response.json();

            clearTimeout(changeWaiter);
            changeWaiter = this.setState(
                {
                    isNameChange: !isFromLastName && !isFromEmail,
                    isLastNameChange: isFromLastName && !isFromEmail,
                    isEmailChange: isFromEmail,
                },
                () => {
                    changeWaiter = setTimeout(() => {
                        this.setState({
                            isNameChange: false,
                            isLastNameChange: false,
                            isEmailChange: false,
                        });
                    }, 2000);
                }
            );

            this.props.dispatch(setAuthUserAction(user));
        }
    };

    openConfirmPhoneModal() {
        this.setState({
            isShowPhonePopup: true,
        });
    }

    handleNumberEnter = async () => {
        // await this.props.setValueAndValidate("phone", this.state.phoneNumber);

        if (this.props.user && this.state.phone.toString().length === 10) {
            // && !this.props.errors.phone
            if (this.props.user.phone !== `+7${this.state.phone}`) {
                this.stateInfoChange("showConfirmButton", true);
            } else {
                this.stateInfoChange("showConfirmButton", false);
            }
            // else {
            //     this.setState({
            //         phoneNumber: this.props.user.phone.substr(2),
            //     });
            // }
        }
    };

    onPhonePopupClose = () => {
        this.setState({
            isShowPhonePopup: false,
            isWaitSms: false,
        });
    };

    sendSMS = async () => {
        this.props.dispatch(startLoadingAction("profileChangePhoneRequestCode"));
        const response = await initOtp("+7" + this.state.phone);
        const data = await response.json();

        if (data) {
            if (data.otpState) {
                this.props.dispatch(setOtpStateAction(data.otpState));
                this.setState({
                    isWaitSms: true,
                });
            } else {
                const error = errorCodes(data.errorCode);

                this.setState({
                    error,
                });
            }
        }
        this.props.dispatch(endLoadingAction("profileChangePhoneRequestCode"));
    };

    onPhoneSuccess = () => {
        this.getCurrentUserInfo();
        this.alertRef.current.showAlert('Изменения сохранены');

        this.setState({
            isShowPhonePopup: false,
            isWaitSms: false,
        });
    };

    render() {
        const { isLoad } = this.state;
        const { active, isLoggedIn, user } = this.props;
        const isNeededData = user && (!user?.firstName && !user?.lastName && !user?.patronymic && !user?.bornOn)

        // if(isNeededData) window.location.href = '/?showRegistration'

        return isLoad && (
            !isLoggedIn
            ? <Redirect to="/" />
            : <>
                <GlobalAlert ref={this.alertRef} />
                <div className="profile-new">
                    {/* Global alert */}
                    <GlobalAlert text="Изменения сохранены!" />
                    {/* Header */}
                    <SubHeader />
                    <h1 className="profile-new__title">Профиль</h1>

                    {/* Body */}
                    <div className="profile-new__body">
                        <h3 className="profile-new__subtitle">Личные данные</h3>
                        {/* Form */}
                        <form className="form">
                            <div className="profile-new__block profile-new--with-border-bottom mustins-row">
                                {/* Last Name */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.lastName}
                                        label={"Фамилия"}
                                        className="mustins-col-4"
                                    >
                                        <input
                                            type="text"
                                            onChange={(e) => this.stateInfoChange("lastName", e.target.value)}
                                            value={this.state.lastName}
                                            className="mustins-input profile-new__input"
                                            placeholder="Введите свою фамилию"
                                            name="lastName"
                                        />
                                    </FormGroup>
                                </div>
                                {/* First Name */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.firstName}
                                        label={"Имя"}
                                        className="mustins-col-4"
                                    >
                                        <input
                                            type="text"
                                            onChange={(e) => this.stateInfoChange("firstName", e.target.value)}
                                            value={this.state.firstName}
                                            className="mustins-input profile-new__input"
                                            placeholder="Введите своe имя"
                                            name="firstName"
                                        />
                                    </FormGroup>
                                </div>
                                {/* Patronymic */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.patronymic}
                                        label={"Отчество"}
                                        className="mustins-col-4"
                                    >
                                        <input
                                            type="text"
                                            value={this.state.patronymic}
                                            onChange={(e) => this.stateInfoChange("patronymic", e.target.value)}
                                            className="mustins-input profile-new__input"
                                            placeholder="Введите свое отчество"
                                            name="patronymic"
                                        />
                                    </FormGroup>
                                </div>
                                {/* Birth Day */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.birth}
                                        label={"Дата рождения"}
                                        className="mustins-col-4"
                                    >
                                        <DateInput
                                            val={this.state.bornOn}
                                            onChange={(e) => this.stateInfoChange("bornOn", e)}
                                            placeholder="12 12 2012"
                                            minDate={"01.01.1971"}
                                            maxDate={DateTime.local().minus({years: 18}).toJSDate()}
                                            minDate={null}
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={60}
                                            className="profile-new__datepicker"
                                        />
                                    </FormGroup>
                                </div>
                                {/* Gender */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.gender}
                                        label={"Пол"}
                                        className="mustins-col-4"
                                    >
                                        <DefaultSelect
                                            onChange={(e) => this.stateInfoChange("gender", e.value)}
                                            className="fill-primary"
                                            darkArrow="true"
                                            selectedOption={
                                                GENDER_OPTIONS_FULL.filter(
                                                    (option) => option.value === this.state.gender
                                                )[0] || GENDER_OPTIONS_FULL[0]
                                            }
                                            options={GENDER_OPTIONS_FULL}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <h3 className="profile-new__subtitle">Специализация</h3>
                            <div className="profile-new__block profile-new--with-border-bottom mustins-row">
                                {/* Role */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.role}
                                        label={"Роль в индустрии перевозок"}
                                        className="mustins-col-4"
                                    >
                                        <DefaultSelect
                                            onChange={(e) => this.stateInfoChange("userType", e.value)}
                                            darkArrow="true"
                                            selectedOption={
                                                USER_ROLES.filter((option) => option.value === this.state.userType)[0]
                                            }
                                            options={USER_ROLES}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="profile-new__form__item mustins-col-4"></div>
                                <div className="profile-new__form__item mustins-col-4"></div>
                                {/* OrganizationTIN */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.organizationTIN}
                                        label={"ИНН организации"}
                                        className="mustins-col-4"
                                    >
                                        <InputInnAutoComplete
                                            initialValue={{ inn: this.state.inn }}
                                            withDetail={true}
                                            onSelect={(e) => {
                                                this.stateInfoChange("legalEntity", e);
                                                this.stateInfoChange("inn", e.inn);
                                                this.stateInfoChange("kpp", e.kpp);
                                            }}
                                        />
                                    </FormGroup>
                                </div>
                                {/* OrganizationName */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.organizationName}
                                        label={"Название организации"}
                                        className="mustins-col-4"
                                    >
                                        <input
                                            type="text"
                                            value={this.state.legalEntity.title}
                                            disabled
                                            className="mustins-input profile-new__input"
                                            placeholder="Введите название организации"
                                            name="legalEntityTitle"
                                        />
                                    </FormGroup>
                                </div>
                                {/* Position */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.organizationName}
                                        label={"Должность"}
                                        className="mustins-col-4"
                                    >
                                        <input
                                            type="text"
                                            value={this.state.position}
                                            onChange={(e) => this.stateInfoChange("position", e.target.value)}
                                            className="mustins-input profile-new__input"
                                            placeholder="Введите должность"
                                            name="position"
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <h3 className="profile-new__subtitle">Контакты</h3>
                            <div className="profile-new__block mustins-row">
                                {/* Email */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.email}
                                        label={"Email"}
                                        className="mustins-col-4"
                                    >
                                        <Email
                                            onEmailChange={(e) => this.stateInfoChange("email", e)}
                                            email={this.state.email}
                                            placeholder={"Email"}
                                        />
                                    </FormGroup>
                                    {this.props.user && this.props.user.email !== this.state.email && (
                                        <span className="profile-new__link" onClick={() => this.handleEmailEnter()}>
                                            Подтвердить Email
                                        </span>
                                    )}

                                    <Modal
                                        isOpened={this.state.isShowEmailPopup}
                                        title={
                                            <span>
                                                мы отправим письмо
                                                <br />с подтверждением
                                                <br />
                                                на новый email
                                            </span>
                                        }
                                        onClose={this.onEmailPopupClose}
                                    >
                                        <div className="page-profile__btn">
                                            <Button onClick={this.onEmailChange}>Да, я хочу изменить email</Button>
                                        </div>
                                    </Modal>
                                </div>
                                {/* Phone */}
                                <div className="profile-new__form__item mustins-col-4">
                                    <FormGroup
                                        // error={this.props.errors.email}
                                        label={"Телефон"}
                                        className="mustins-col-4"
                                    >
                                        <PhoneNumber
                                            onNumberChange={(e) => {
                                                this.stateInfoChange("phone", e);
                                            }}
                                            number={this.state.phone}
                                        />
                                    </FormGroup>
                                    {this.state.showConfirmButton && (
                                        <span
                                            className="profile-new__link"
                                            onClick={() => this.openConfirmPhoneModal()}
                                        >
                                            Подтвердить Телефон
                                        </span>
                                    )}

                                    <Modal
                                        loading={
                                            this.props.loading.profileChangePhoneSubmitCode ||
                                            this.props.loading.profileChangePhoneRequestCode
                                        }
                                        isOpened={this.state.isShowPhonePopup}
                                        title={
                                            <span>
                                                вы обновляете телефон,
                                                <br />
                                                мы отправим СМС с кодом
                                                <br />
                                                на номер +7({this.state.phone.substr(0, 3)})***-**-
                                                {this.state.phone.substr(8, 2)}
                                            </span>
                                        }
                                        onClose={this.onPhonePopupClose}
                                    >
                                        {this.state.isWaitSms ? (
                                            <AuthContainer
                                                initialStep="sms"
                                                onPhoneConfirmed={this.onPhoneSuccess}
                                                initialPhoneNumber={this.state.phone}
                                                type="migratePhone"
                                            />
                                        ) : (
                                            <>
                                                <div className="page-profile__btn">
                                                    <Button onClick={this.sendSMS}>Да, я хочу изменить телефон</Button>
                                                </div>
                                                {this.state.error ? (
                                                    <div className="mustins-modal__row">
                                                        <Text color={TextColor.RED}>{this.state.error}</Text>
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </Modal>
                                </div>
                            </div>
                            <div className="profile-new__form__footer">
                                <Button type="submit" onClick={this.saveUpdateData}>
                                    Сохранить
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <Sprite />
            </>
        )
    }
}

ProfileNewPage.contextType = AppContext;

const mapStateToProps = (state) => ({
    ...selectAuth(state),
    loading: selectLoading(state),

});

export default connect(mapStateToProps)(withWidgetAuth(withFormHook(ProfileNewPage)));

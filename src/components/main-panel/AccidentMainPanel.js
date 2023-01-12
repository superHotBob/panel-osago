import React from 'react';
import './main-panel.scss';
import {ScoreGraph} from '../score-graph/ScoreGraph';
import {AutoForm} from '../auto-form/AutoForm';
import classNames from 'classnames';
import {AutoData} from '../auto-data/AutoData';
import {Button} from 'components/button/Button';
import {Text, TextColor, TextSize} from 'components/text/Text';
import LogoSvg from 'svg/logo-small.svg';
import LogoIngosSvg from 'svg/logo-ingos-small.svg';
import {isCarNumberValid} from 'validation/isCarNumberValid';
import {isEmailValid} from 'validation/isEmailValid';
import {getPredictionStatus} from './MainPanelModel';
import api from 'api';
import AccidentBuyOsago from './AccidentBuyOsago';
import {selectAuth, sendSmsCodeAction} from "../../redux/authReducer";
import {connect} from "react-redux";
import {AccidentForm} from "./AccidentForm";
import {endLoadingAction, selectLoading, startLoadingAction} from "../../redux/loadingReducer";
import qs from 'qs'

function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

class MainPanelComponent extends React.Component {
    state = {
        formAnimation: false,
        scoreAnimation: false,
        score: null,
        number: this.props.number || '',
        region: this.props.region || '',
        email: this.props.email || '',
        checked: true,
        predictionId: '',
        isShowPopup: false,
        showAccidentForm: false,
        errorCode: null,
        error: null
    };

    numberRef = React.createRef();
    mainPanelRef = React.createRef()

    componentDidMount() {
        const parsedSearch = qs.parse((window.location.search).slice(1))
        if (parsedSearch.focusAccidentBlock) {
            document.documentElement.scrollTop = 240
        }
    }

    handleHistoryRefresh = () => {
        this.props.refreshHistory();
    };

    handleButtonClick = async () => {
        const {number, region, email} = this.state;
        this.setState({
            scoreAnimation: true,
            score: null
        });
        if (isMobile()) {
            window.scrollTo(0, 280);
            window.scrollTo(0, 300);
        }

        this.props.dispatch(startLoadingAction('accidentPredictionInit'))

        const response = await api('/prediction/init', 'POST', {
            plates: `${number}${region}`,
            email,
        });

        const data = await response.json();
        if (data && data.predictionId) {
            const predictionId = data.predictionId;
            this.setState({predictionId: data.predictionId});
            const interval = setInterval(async () => {
                const response = await getPredictionStatus(predictionId);
                const data = await response.json();
                if (data && data.isCompleted) {
                    if (!data.isFaulted) {
                        this.setState({score: (data.info.rate * 100).toFixed(2)});
                        this.setState({
                            info: data.info
                        });

                        this.handleHistoryRefresh();
                    } else {
                        this.setState({
                            errorCode: data.errorCode,
                            error: data.error,
                            scoreAnimation: false,
                            number: '',
                            region: ''
                        });
                        this.props.dispatch(endLoadingAction('accidentPredictionInit'))
                    }
                    clearInterval(interval);
                }
            }, 1000)
        } else {
            this.setState({
                errorCode: data.errorCode,
                error: data.error,
                scoreAnimation: false,
                number: '',
                region: ''
            });
            this.props.dispatch(endLoadingAction('accidentPredictionInit'))
        }
    };

    handleNumberChange = (number) => {
        this.setState({number});
    };

    handleRegionChange = (region) => {
        this.setState({region});
    };

    handleEmailChange = (email) => {
        this.setState({email});
    };

    handleCheckedChange = (checked) => {
        this.setState({checked});
    };

    drawUpOsago = () => {
        if (this.props.user && this.props.user.phone) {
            this.showOsagoAuth();
        } else {
            this.setState({
                showAccidentForm: true
            })
        }
    };

    getHelpText() {
        const {number, region, email, checked, score, scoreAnimation} = this.state;
        if (!isCarNumberValid(number, region)) {
            return <>заполните<br/>данные</>
        } else if (!isEmailValid(email)) {
            return <>введи<br/>почту</>
        } else if (!checked) {
            return <>дай<br/>согласие</>
        } else if (!score && !scoreAnimation) {
            return <>система<br/>готова</>
        } else if (scoreAnimation) {
            return <>вычисляем</>
        } else {
            return '';
        }
    }

    handleAnimationFinished = () => {
        this.setState({formAnimation: true, helpText: '', scoreAnimation: false});
        this.props.dispatch(endLoadingAction('accidentPredictionInit'))
    };

    handleErrorHide = () => {
        this.numberRef.current.focus();
    };

    handleAcceptClick = () => {
        this.setState({
            isShowPopup: false,
        });
    };

    showOsagoAuth = async () => {
        await this.props.dispatch(sendSmsCodeAction(this.props.user.phone.slice(2)))
        this.setState({
            isShowPopup: true,
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.email !== this.props.email && this.props.user && this.props.user.email) {
            this.setState({
                email: this.props.user.email,
            })
        }

    }

    closeAccidentForm = () => {
        this.setState({
            showAccidentForm: false,
        });
    }

    render() {
        const {
            formAnimation, score, scoreAnimation, number, region, email, checked,
            info = {}, predictionId, showAccidentForm, error, errorCode
        } = this.state;
        const {make, model, manufacturedOn, vin} = info;
        return (
            <div className={classNames('main-panel', score ? 'main-panel_score' : '')} ref={this.mainPanelRef}>
                <AccidentForm
                    errorCode={errorCode}
                    error={error}
                    predictionId={predictionId}
                    closeModal={this.closeAccidentForm}
                    showModal={showAccidentForm}/>
                <div className="main-panel__row">
                    <ScoreGraph loading={scoreAnimation}
                                score={score}
                                number={number}
                                region={region}
                                onAnimationFinished={this.handleAnimationFinished}
                                helpText={this.getHelpText()}/>
                    <div
                        className={classNames('main-panel__form-container', formAnimation ? 'main-panel__form-container_animated' : '')}>
                        <AutoForm number={number}
                                  region={region}
                                  fullNumber={`${number}${region}`}
                                  email={email}
                                  checked={checked}
                                  numberRef={this.numberRef}
                                  disabled={scoreAnimation}
                                  onNumberChange={this.handleNumberChange}
                                  onRegionChange={this.handleRegionChange}
                                  onEmailChange={this.handleEmailChange}
                                  onCheckedChange={this.handleCheckedChange}
                                  onButtonClick={this.handleButtonClick}/>
                    </div>
                    <div
                        className={classNames('main-panel__data-container', formAnimation ? 'main-panel__data-container_animated' : '')}>
                        <AutoData number={number} region={region} make={make} model={model}
                                  manufacturedOn={manufacturedOn} vin={vin}/>
                    </div>
                    <div
                        className={classNames('main-panel__mobile-data-container', formAnimation ? 'main-panel__mobile-data-container_animated' : '')}>
                        <AutoData withoutCarNumber={true} className="main-panel__mobile-auto-data" number={number}
                                  region={region} make={make} model={model} manufacturedOn={manufacturedOn} vin={vin}/>
                        <Button onClick={this.drawUpOsago}>Оформить полис ОСАГО</Button>
                    </div>
                </div>

                <div
                    className={classNames('main-panel__osago-container', formAnimation ? 'main-panel__osago-container_animated' : '')}>
                    <div className="main-panel__osago">
                        <Button onClick={this.drawUpOsago}>Оформить полис ОСАГО</Button>
                        <div className="score-graph__technologies main-panel__technologies">
                            <Text size={TextSize.S_16} color={TextColor.DARK_GRAY}>На основе технологий </Text>
                            <LogoSvg className="score-graph__logo"/>
                            <Text size={TextSize.S_16} color={TextColor.DARK_GRAY}>и Искусственного Интеллекта</Text>
                        </div>
                    </div>
                </div>
                <div className="main-panel__mobile-osago-container">
                    <Text size={TextSize.S_16} color={TextColor.DARK_GRAY}>На основе технологий </Text>
                    <div className="main-panel__mobile-osago-row">
                        <LogoSvg className="score-graph__logo"/>
                        <Text size={TextSize.S_16} color={TextColor.DARK_GRAY}>и</Text>
                        <Text size={TextSize.S_16} className="main-panel__ai-logo" color={TextColor.DARK_GRAY}>Искусственного Интеллекта</Text>
                    </div>
                </div>

                {
                    this.state.isShowPopup &&
                    <AccidentBuyOsago
                        isShowPopup={this.state.isShowPopup}
                        predictionId={this.state.predictionId}
                        closeModal={this.handleAcceptClick}
                    />
                }

            </div>
        );
    }

}

const mapStateToProps = state => ({
    ...selectAuth(state),
    loading: selectLoading(state)
})

export const AccidentMainPanel = connect(mapStateToProps)(MainPanelComponent)

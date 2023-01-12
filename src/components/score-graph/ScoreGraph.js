import React from 'react';
import './score-graph.scss';

import Pointer from 'svg/pointer.svg';
import {Speedo} from '../speedo/Speedo';
import {bool, func, number, string, object, oneOfType} from 'prop-types';
import {Typography, TypographyColor, TypographyDisplay, TypographyType} from "../typography/Typography";
import classNames from 'classnames';
import {ScoringPeriod} from "../../pages/accident-prediction/accident/AccidentPage";
import {AccidentPredictionLevel} from '../../pages/accident-prediction/AccidentPredictionModel';
import {ScoreGraphSvg} from './ScoreGraphSvg';
import { AddTrack, CustomEventName } from '../../modules/tracking';

const getDegBordersByLevel = (level) => {
    switch (level) {
        case AccidentPredictionLevel.NORMA:
            return {
                minDeg: -105,
                maxDeg: -62,
            }
        case AccidentPredictionLevel.ACCIDENT_RISK:
            return {
                minDeg: -59,
                maxDeg: 18,
            }
        case AccidentPredictionLevel.ACCIDENT:
            return {
                minDeg: 20,
                maxDeg: 104,
            }
    }
}

export class ScoreGraph extends React.Component {
    static propTypes = {
        loading: bool,
        helpText: string,
        score: oneOfType([ number, null ]),
        onAnimationFinished: func,
        number: string,
        region: string,
        scoringPeriod: string,
        onScoringPeriodChange: func,
        level: string,
        levelBorders: object
    };

    static defaultProps = {
        loading: false,
        helpText: '',
        score: null,
    };

    state = {
        speedoShown: !!this.props.score,
        animationFinished: false,
        tabsShown: false,
    };

    pointerRef = React.createRef();
    timer = null;
    angle = 180 * Math.PI / 180;

    setPointerDeg = (deg, time, timingFunction) => {
        this.pointerRef.current.style = `
     -moz-transform: rotate(${deg}deg); 
     -webkit-transform: rotate(${deg}deg);
     -webkit-transform: rotate(${deg}deg); 
     transform:rotate(${deg}deg); 
     transition: ${time}s;
     transition-timing-function: ${timingFunction};
     `;
    };

    getDeg = () => {
        const {score, level, levelBorders} = this.props;
        const {min, max} = levelBorders;
        const {minDeg, maxDeg} = getDegBordersByLevel(level);
        return minDeg + ((score - min * 100) / (max * 100 - min * 100)) * Math.abs(maxDeg - minDeg);
    };

    componentDidMount() {
        console.log(this.props.score);
        if (this.props.score) {
            this.setState({speedoShown: true});
            this.setState({tabsShown: true});
            this.setPointerDeg(this.getDeg(), 1, 'cubic-bezier(0, 0, 0.2, 1)');
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {onAnimationFinished} = this.props;
        if (!prevProps.loading && this.props.loading) {
            this.setState({speedoShown: false});
            let deg = 104;
            this.setPointerDeg(deg, 1, 'cubic-bezier(0, 0, 0.2, 1)');
            setTimeout(() => {
                deg = -105;
                this.setPointerDeg(deg, 1.6, 'cubic-bezier(0, 0, 0.2, 1)');
                const interval = setInterval(() => {
                    if (!this.props.loading) {
                        clearInterval(interval);
                        this.setPointerDeg(0, 0, 'cubic-bezier(0, 0, 0.2, 1)');
                        return;
                    }
                    if (this.props.score && deg === -105) {
                        clearInterval(interval);
                        this.setState({speedoShown: true});
                        this.setState({tabsShown: true});
                        setTimeout(() => {
                            onAnimationFinished();
                            this.setState({animationFinished: true});
                        }, 2500);
                        this.setPointerDeg(this.getDeg(), 2.5, 'cubic-bezier(0, 0, 0.2, 1)');
                    } else {
                        deg = -1 * deg;
                        if (deg > 0) {
                            this.setPointerDeg(deg, 1.6, 'ease');
                        } else {
                            this.setPointerDeg(deg, 1.6, 'cubic-bezier(0, 0, 0.2, 1)');
                        }
                    }
                }, 1600)
            }, 1000);
        }
        if (prevProps.score && prevProps.score !== this.props.score || prevProps.level && prevProps.level !== this.props.level) {
            if (this.props.score){
                this.setState({speedoShown: false});
                this.setPointerDeg(104, 1, 'cubic-bezier(0, 0, 0.2, 1)');
                setTimeout(() =>{
                    this.setPointerDeg(-105, 1, 'cubic-bezier(0, 0, 0.2, 1)');
                    setTimeout(() =>{
                        this.setState({speedoShown: true});
                        this.setPointerDeg(this.getDeg(), 2.5, 'cubic-bezier(0, 0, 0.2, 1)');
                    }, 1000)
                }, 1000)
            }

        }
    }

    render() {

        const {
            loading,
            helpText,
            score,
            number,
            region,
            norm,
            scoringPeriod,
            onScoringPeriodChange
        } = this.props;
        const {speedoShown, animationFinished, tabsShown} = this.state;

        const renderTabs = () => {
            return (
                <div className="score-graph__tabs">
                    <div
                        className={classNames('score-graph__tab', scoringPeriod === ScoringPeriod.SIX_MONTHS ? 'score-graph__tab--active' : '')}
                        onClick={() => {onScoringPeriodChange(ScoringPeriod.SIX_MONTHS); AddTrack(CustomEventName.SIX_MONTHS);}}>
                        <Typography type={TypographyType.BODY}
                                    color={scoringPeriod === ScoringPeriod.SIX_MONTHS ? TypographyColor.MUST_100 : TypographyColor.MUST_900}>
                            6 мес
                        </Typography>
                    </div>
                    <div
                        className={classNames('score-graph__tab', scoringPeriod === ScoringPeriod.YEAR ? 'score-graph__tab--active' : '')}
                        onClick={() => {onScoringPeriodChange(ScoringPeriod.YEAR); AddTrack(CustomEventName.ONE_YEAR)}}>
                        <Typography type={TypographyType.BODY}
                                    color={scoringPeriod === ScoringPeriod.YEAR ? TypographyColor.MUST_100 : TypographyColor.MUST_900}>
                            1 год
                        </Typography>
                    </div>
                </div>
            )
        }

        return (
            <>
                <div className="score-graph">
                    <div>
                        <div className='score-graph__svg-container'>
                            <ScoreGraphSvg className="score-graph__main-svg"/>
                            <Pointer ref={this.pointerRef} className='score-graph__arrow-with-circle-svg'/>

                            <div className='score-graph__text-group'>
                                <div className="score-graph__title">
                                    <Typography type={TypographyType.FOOTNOTE}
                                                display={TypographyDisplay.BLOCK}
                                                bigDesktopType={TypographyType.CAPTION}>Вероятность ДТП</Typography>
                                </div>
                                <Speedo end={speedoShown && score}/>
                                <div className="score-graph__norm">
                                    <Typography type={TypographyType.FOOTNOTE}
                                                display={TypographyDisplay.BLOCK}
                                                color={TypographyColor.MUST_100}>Норма
                                        до {speedoShown && norm ? `${norm}%` : '...'}</Typography>
                                </div>
                            </div>
                            {tabsShown &&
                            <div className="score-graph__score-period-container">
                                {renderTabs()}
                            </div>}
                        </div>
                    </div>
                </div>
                {tabsShown &&
                <div className="score-graph__score-period-container-mobile">
                    {renderTabs()}
                </div>}
            </>
        );
    }
}

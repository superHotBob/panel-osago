import React from 'react';
import './speedo.scss';
import {Typography, TypographyType} from "../typography/Typography";

export class Speedo extends React.Component {
    state = {
        current: 0,
    }

    static propTypes = {
        start: Number,
        duration: Number,
        defaultStepCount: Number,
        end: Number
    };

    static defaultProps = {
        start: 0,
        defaultStepCount: 100,
        duration: 2500
    };

    getStepCount = (start, defaultStepCount) => {
        const {end} = this.props;
        const step = parseFloat(((end - start) / defaultStepCount).toFixed(3));
        if (Math.abs(step) < 0.01) {
            return Math.abs(end - start) / 0.01;
        }
        return defaultStepCount;
    };

    componentDidMount() {
        const {end} = this.props;
        if (end) {
            this.setState({current: parseFloat(parseFloat(end).toFixed(2))})
        }
    }

    async componentDidUpdate(prevProps) {
        let {start, duration, end, defaultStepCount} = this.props;
        if (prevProps.end !== end) {
            if (this.myInterval) {
                clearInterval(this.myInterval);
            }
            if (prevProps.end) {
                this.setState(() => ({current: null}))
                await new Promise(r => setTimeout(r, 2000));
            }
            if (!end) {
                this.setState(() => ({current: end}))
                return;
            }

            const increasing = true; //end > prevProps.end || !prevProps.end;
            if (prevProps.end) {
                start = 0;//prevProps.end;
                duration = 2500;
            }
            let stepCount = this.getStepCount(start, prevProps.end ? 50 : defaultStepCount);
            const interval = Math.abs(duration / stepCount);
            const step = parseFloat(parseFloat(((end - start) / stepCount).toFixed(3)));
            this.myInterval = setInterval(() => {
                const {current} = this.state;
                const newCurrent = parseFloat(parseFloat(+current + +step).toFixed(2));
                this.setState(({current}) => {
                    if (increasing) {
                        return {
                            current: newCurrent < end ? newCurrent : end
                        }
                    } else {
                        return {
                            current: newCurrent > end ? newCurrent : end
                        }
                    }
                })

                if (Math.abs(end - current) <= Math.abs(step)) {
                    clearInterval(this.myInterval);
                }

            }, interval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const {current} = this.state;
        return (
            <div className="speedo">
                <Typography type={TypographyType.H2}
                            bigDesktopType={TypographyType.H1}>
                    {current ? `${Number(current).toFixed(2)}%` : '...'}
                </Typography>
            </div>
        )
    }
}

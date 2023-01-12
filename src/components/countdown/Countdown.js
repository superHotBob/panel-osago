import React from 'react';
import './countdown.scss';
import { func, number } from 'prop-types';
import {BemHelper} from "../../utils/class-helper";

const classes = new BemHelper({name: 'countdown'});

export class Countdown extends React.Component {
    state = {
        seconds: this.props.timeLeft || 30
    }

    static propTypes = {
        onTimeOver: func,
        timeLeft: number
    };

    componentDidMount() {
        const { onTimeOver } = this.props;
        this.myInterval = setInterval(() => {
            const { seconds } = this.state;
            this.setState(({ seconds }) => ({
                seconds: seconds - 1
            }))

            if (seconds <= 1) {
                clearInterval(this.myInterval);
                onTimeOver();
            }

        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { seconds } = this.state
        return (<span {...classes()}>{seconds}</span>)
    }
}

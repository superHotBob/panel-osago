import React, {Fragment} from 'react';
import {Text, TextSize, TextFont, TextAlign} from '/components/text/Text';
import {Button} from '/components/button/Button';
import {bool, func, string} from 'prop-types';

export class AccidentErrorView extends React.Component {
    static propTypes = {
        errorCode: Number,
        error: String,
        onClick: func
    }

    getErrorText() {
        const {errorCode, error} = this.props;
        switch (errorCode) {
            case 1102:
            case 1103:
            case 1204:
                return 'Наш сервис создан специально для владельцев грузовиков!';

            case 1201:
            case 1202:
            case 1203:
            case 1301:
                return 'Данные для расчета вероятности ДТП по вашему грузовику не доступны.';

            default:
                return error;
        }
    }

    render() {
        const {onClick} = this.props;
        return (
            <Fragment>
                <div className="mustins-modal__row">
                    <Text size={TextSize.S_16} font={TextFont.UBUNTU}
                          textAlign={TextAlign.CENTER}>{this.getErrorText()}</Text>
                </div>
                <div className="mustins-modal__row">
                    <Button onClick={onClick}>Ввести другой номер</Button>
                </div>
            </Fragment>
        );
    }
}

import React from 'react';
import {Button} from '/components/button/Button';
import {bool, func, string} from 'prop-types';

export class AccidentSuccessView extends React.Component {

    static propTypes = {
        closeModal: func
    }

    render() {
        const {closeModal} = this.props;
        return (
            <div className="mustins-modal__row">
                <Button onClick={closeModal}>Спасибо, ожидаю</Button>
            </div>
        );
    }
}

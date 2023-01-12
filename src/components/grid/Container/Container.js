import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import '../grid.scss';

export class Container extends React.Component {
    static propTypes = {
        /**
         * Allow the Container to fill all of it's availble horizontal space.
         */
        fluid: PropTypes.bool,

        className: PropTypes.string
    };

    static defaultProps = {
        fluid: false,
    };

    render() {
        const {fluid, className, forwardedRef, ...props} = this.props;
        return (
            <div {...props}
                 ref={forwardedRef}
                 className={classNames(
                     className,
                     fluid ? 'mustins-container-fluid' : 'mustins-container',
                 )}
            />
        );
    }
}

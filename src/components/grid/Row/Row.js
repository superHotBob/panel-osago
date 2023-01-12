import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import '../grid.scss';

export class Row extends React.Component {
  static propTypes = {
    /** Removes the gutter spacing between `Col`s as well as any added negative margins. */
    noGutters: PropTypes.bool.isRequired,

    className: PropTypes.string
  };

  static defaultProps = {
    noGutters: false,
  };

  render() {
    const {
      noGutters,
      className,
      ...props
    } = this.props;

    return (
      <div {...props}
           className={classNames(className, 'mustins-row', noGutters && 'mustins-no-gutters')}
      />
    );
  }
}

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import '../grid.scss';

const DEVICE_SIZES = ['xl', 'lg', 'md', 'sm', 'xs'];
const colSize = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
  PropTypes.oneOf(['auto'])
]);

const stringOrNumber = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string
]);

const column = PropTypes.oneOfType([
  colSize,
  PropTypes.shape({
    size: colSize,
    order: stringOrNumber,
    offset: stringOrNumber
  })
]);

export class Col extends React.Component {
  static propTypes = {
    /**
     * The number of columns to span on sxtra small devices (<576px)
     *
     * @type {(true|"auto"|number|{ span: true|"auto"|number, offset: number, order: number })}
     */
    xs: column,

    /**
     * The number of columns to span on small devices (≥576px)
     *
     * @type {(true|"auto"|number|{ span: true|"auto"|number, offset: number, order: number })}
     */
    sm: column,

    /**
     * The number of columns to span on medium devices (≥768px)
     *
     * @type {(true|"auto"|number|{ span: true|"auto"|number, offset: number, order: number })}
     */
    md: column,

    /**
     * The number of columns to span on large devices (≥992px)
     *
     * @type {(true|"auto"|number|{ span: true|"auto"|number, offset: number, order: number })}
     */
    lg: column,

    /**
     * The number of columns to span on extra large devices (≥1200px)
     *
     * @type {(true|"auto"|number|{ span: true|"auto"|number, offset: number, order: number })}
     */
    xl: column,

    className: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const {className, ...props} = this.props;

    const spans = [];
    const classes = [];

    const bsPrefix = 'mustins-col';

    DEVICE_SIZES.forEach((brkPoint) => {
      const propValue = props[brkPoint];
      delete props[brkPoint];

      let size;
      let offset;
      let order;
      if (propValue != null && typeof propValue === 'object') {
        ({size = true, offset, order} = propValue);
      } else {
        size = propValue;
      }

      const infix = brkPoint !== 'xs' ? `-${brkPoint}` : '';

      if (size != null) {
        spans.push(
          size === true ? `${bsPrefix}${infix}` : `${bsPrefix}${infix}-${size}`,
        );
      }

      if (order != null) classes.push(`mustins-order${infix}-${order}`);
      if (offset != null) classes.push(`mustins-offset${infix}-${offset}`);
    });
    if (!spans.length) {
      spans.push(bsPrefix);
    }

    return (
      <div {...props}
           className={classNames(className, ...spans, ...classes)}
      />
    );
  }
}

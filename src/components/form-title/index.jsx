import React from 'react';
import cn from 'classnames';

import './form-title.scss';
import {BemHelper} from '../../utils/class-helper'

const classes = new BemHelper({name: 'form-title'});

const FormTitle = ({
  digit,
  wide,
  isGray,
  children,
}) => {
  if (!digit && !children) {
    return;
  }

  return (
    <div {...classes(null, [
        wide ? 'wide': null,
        !!digit ? 'both': null,
        !!isGray ? 'gray': null,
    ])}>
      {
        digit
          ? <div {...classes('digit')}>{ digit }</div>
          : null
      }

      <div {...classes('text')}>{ children }</div>
    </div>
  )
};

export default FormTitle;

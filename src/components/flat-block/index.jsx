import React from 'react';
import { oneOf, node } from 'prop-types';

import './flat-block.scss';
import {BemHelper} from '../../utils/class-helper'

const classes = new BemHelper({name: 'flat-block'});

const FlatBlock = ({
  blockType,
  children,
}) => {
  return (
    <div {...classes(null, blockType ? `type-${ blockType }` : null)}>{ children }</div>
  )
};

FlatBlock.propTypes = {
  blockType: oneOf(['center', 'overflow']),
  children: node,
};

export default FlatBlock;

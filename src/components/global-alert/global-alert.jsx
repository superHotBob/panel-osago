import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { BemHelper } from '../../utils/class-helper';

// Styles
import './global-alert.scss';

// Classes
const classes = new BemHelper({ name: 'global-alert' });

export const GlobalAlert = forwardRef(({ color = '#fff', bgColor = '#27b4b8' }, ref) => {
  const [height, setHeight] = useState(0),
  [message, setMessage] = useState(0);
  // Style
  const style = {
    // backgroundColor: bgColor,
    color: color,
    height: height + 'px'
  }
  // Show alert function
  const showAlert = (msg) => {
    setMessage(msg);
    setHeight(46);
    setTimeout(() => {
      setHeight(0);
    }, 5000)
  };
  // Export show alert function
  useImperativeHandle(ref, () => {
    return {
      showAlert: showAlert
    }
  });

  return (
    <div {...classes()} style={ style }>
      <span>
        { message }
      </span>
    </div>
  );
});
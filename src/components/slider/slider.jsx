import React, { memo, useCallback, useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import useEffectWithSkipDidMount from '../../hooks/useEffectWithSkipDidMount';
import { BemHelper } from '../../utils/class-helper';

// Styles
import './slider.scss';

// Classes
const classes = new BemHelper({name: 'slider'});

// Components
export const Slider = memo(({ min, max, initialValue, step = 1, onInputValue, getValue }) =>{
  const [value, setValue] = useState(initialValue);
  const percent = Number(((value - min) * 100) / (max - min));
  const circlAlign = 32 * percent / 100;
  const circleStyle = {
    left: percent + '%',
    marginLeft: -circlAlign + 'px'
  };
  const progressStyle = {
    width: percent + '%'
  }

  useEffect(() => void setValue(initialValue), [initialValue]);

  // scenario to handle only the last value
  const debouncedValue = useDebounce(value, 500);
  const handleOnChange = useCallback(() => {
    getValue(value);
  }, [debouncedValue]);
  useEffectWithSkipDidMount(handleOnChange, [debouncedValue]);

  const handleOnInput = useCallback(e => {
    const val = parseInt(e.target.value, 10);
    setValue(val);
    onInputValue(val);
  }, []);

  return (
    <div {...classes()}>
      <input
        min={ min }
        max={ max }
        value={ value }
        step={ step }
        type="range"
        {...classes('input')}
        onChange={handleOnInput}
      />
      <div {...classes('wrapper')}>
        <div {...classes('circle')} style={ circleStyle }></div>
        <div {...classes('progress')} style={ progressStyle }></div>
      </div>
    </div>
  )
});
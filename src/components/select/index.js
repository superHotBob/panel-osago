import React, { useContext } from 'react'

import FormTitle from "../form-title";
import Select, {components} from 'react-select';
import DownSvg from 'svg/down.svg';
import DownDisabledSvg from 'svg/down-disabled.svg';
import './select.scss'
import getDefaultStyle from './style'
import {BemHelper, className} from "../../utils/class-helper";
import { ThemeContext } from '../../hoc/withTheme';

const classes = new BemHelper({name: 'select-ctn'});

const DropdownIndicator = props => {
    return (
        <components.DropdownIndicator {...props}>
            <div {...classes('indicator')}>
                <DownSvg/>
            </div>
        </components.DropdownIndicator>
    );
};

const DropdownIndicatorDisabled = props => {
    return (
        <components.DropdownIndicator {...props}>
            <div {...classes('indicator')}>
                <DownDisabledSvg/>
            </div>
        </components.DropdownIndicator>
    );
};

const DropdownIndicatorDark = props => {
    return (
        <components.DropdownIndicator {...props}>
            <div {...classes('dark')}>
                <DownSvg/>
            </div>
        </components.DropdownIndicator>
    );
};

const DefaultSelect = ({label, onChange, options, disabled, error, selectedOption, placeholder, darkArrow, ...props}) => {
    const themeContext = useContext(ThemeContext);

    const indicator = disabled ? DropdownIndicatorDisabled : darkArrow ? DropdownIndicatorDark : DropdownIndicator;

    return (
        <label {...classes(null, [
            error ? 'error' : '',
            !selectedOption?.value ? 'empty' : ''
        ], [className('input-wrap', true)])}>
            {label && <FormTitle>
                {label}
            </FormTitle>}
            <Select
                noOptionsMessage={'Ничего не выбрано'}
                value={selectedOption}
                placeholder={placeholder || ''}
                onChange={onChange}
                options={options}
                classNamePrefix={'mustins-select'}
                isDisabled={disabled}
                isSearchable={false}
                components={{DropdownIndicator: indicator}}
                styles={getDefaultStyle(themeContext)}
                {...props} />
        </label>
    )
}

export default DefaultSelect

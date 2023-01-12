import {withDefaults} from 'react-bem-helper';

export const BemHelper = withDefaults({
    prefix: 'mustins-',
});

export const className = (classes, string = false) => {
    let result = ''
    if (typeof classes === 'string') {
        result = `mustins-${classes}`
    } else {
        result = classes.filter(c => c).map(c => `mustins-${c}`).join(' ')
    }

    return string ? result : {className: result}
};

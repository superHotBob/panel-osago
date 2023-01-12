import isEmpty from "lodash/isEmpty";

const isPhoneValid = value => {
    let cleaned = value.replace( /[^0-9]/g, '')
    return cleaned.length === 10
}

export const phoneValidator = (name = 'phone', required = true)  => [
    {name}, {
        required: required ? 'Заполни поле телефон': false,
        validate: value => (isEmpty(value) || isPhoneValid(value)) ? true : 'Исправь ошибки в номере телефона'
    }
]

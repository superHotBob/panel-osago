import {isEmailValid} from "../common/validation/isEmailValid";
import isEmpty from 'lodash/isEmpty';

export const emailValidator = (name = 'email', required = true)  => [
    {name}, {
        required: required ? 'Заполни поле email': false,
        validate: value => (isEmpty(value) || isEmailValid(value)) ? true : 'Исправь ошибки в адресе email'
    }
]

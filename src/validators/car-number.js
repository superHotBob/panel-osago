const isCarNumberValid = value => {
    return /^[АВЕКМНОРСТУХABEKMHOPCTYX](?!000)\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}(?!00)\d{2,3}$/ui.test(value)
}

export const carNumberValidator = (name = 'number')  => [
    {name}, {
        required: 'Введи гос. номер своего грузовика',
        validate: value => isCarNumberValid(value) ? true : 'Исправь ошибки в гос. номере'
    }
]

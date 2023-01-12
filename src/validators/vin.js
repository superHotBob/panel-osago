
const isVinValid = value => {
    return /^\w{17}$/i.test(value)
}

export const vinValidator = (name = 'phone')  => [
    {name}, {
        required: 'Заполни поле VIN-номер',
        validate: value => isVinValid(value) ? true : 'Исправь ошибки в VIN-номере'
    }
]

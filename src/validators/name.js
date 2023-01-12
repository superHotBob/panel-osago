export const nameValidator = (name = 'name', text = 'имя')  => [
    {name}, {
        required: `Заполни поле ${text}`,
        validate: value => value.trim() === "" ? `Заполни поле ${text}` : true
    }
]

const errorCodes = (errorCode) => ({
	1001 : 'Несуществующий телефонный номер',
	1002 : 'Неправильный телефонный номер',
	1003 : 'Слишком много запросов. Попробуйте через 20 минут.',
	1004 : 'Слишком много запросов. Повторите попытку через 30 секунд.',
	1005 : 'Введен неверный код из смс',
	1006 : 'Данный номер уже существует',
}[errorCode] || 'Что то пошло не так, попробуйте еще раз');

export default errorCodes;

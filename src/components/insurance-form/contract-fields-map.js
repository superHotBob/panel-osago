import {DateTime} from "luxon";
import {DRIVER_COUNT_OPTIONS, GENDER_OPTIONS, ORGANIZATION_TYPE_LEGAL} from "../../constants/osago";
import {birthdayValidator, passportIssuedOnValidator} from "../../validators";
import {getTodayEnd, getTodayStart} from "../../utils/get-today-date";
import {noop} from "lodash";
import {getAgeDateObject, validateEighteen} from "../../validators/birthday";
import {isEmailValid} from "../../common/validation/isEmailValid";
import lodashGet from 'lodash/get';
import map from 'lodash/map';

export const VehicleDocTypes = {
    vehiclePassport: 'ПТС',
    registrationCertificate: 'СТС',
    eVehiclePassport: 'еПТС'
}

export const VEHICLE_DOC_TYPE_TAB_RELATION = {
    11: 'registrationCertificate',
    12: 'vehiclePassport',
}

const getCommonFields = (getValues) => ({
    title: '',
    fields: [
        {
            label: 'Дата начала действия нового полиса',
            name: 'policyStartOn',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: getTodayStart().plus({days: 45}).toJSDate(),
            minDate: getTodayStart().plus({days: 4}).toJSDate(),
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                validate: (fieldName, value) => {
                    const to = DateTime.fromISO(value).minus({days: 3})

                    const diff = to.diff(getTodayStart(), ['days']).toObject();
                    return diff.days > 0 ? true : 'Активация полиса минимум через 3 дня'
                }
            }
        },
        {
            label: 'Период страхования',
            name: 'policyDurationInMonths',
            editable: false,
            required: true,
            value: null,
            type: 'number',
            formatter: value => `${value} месяцев`,
            validator: null
        },
        {
            label: 'Количество водителей',
            name: 'driverCount',
            editable: false,
            required: false,
            value: null,
            type: 'text',
            options: DRIVER_COUNT_OPTIONS,
            formatter: value => {
                return DRIVER_COUNT_OPTIONS.find(o => (o.value ?? 'no-restrictions') == value)?.label;
            },
            validator: null
        },
        {
            label: 'Номер предыдущего полиса',
            name: 'prevPolicyNumber',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Тип перевозимых грузов',
            name: 'cargoType', // vehicle.isStandardCargo, vehicle.isHighRiskCargo
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value === 'isStandardCargo' ? 'Перевозка стандартных грузов' : 'Перевозка опасных грузов',
            validator: null
        },
        {
            label: 'Используется с прицепом',
            name: 'vehicle.hasTrailer',
            editable: false,
            required: false,
            value: false,
            type: 'bool',
            formatter: value => value ? 'Да' : 'Нет',
            validator: null
        }
    ]
});
const getTransportFields = (getValues) => ({
    title: 'Транспортное средство',
    fields: [
        {
            name: 'vehicle.plates',
            label: 'Гос.номер',
            editable: true,
            required: false,
            value: '',
            type: 'plates',
            formatter: value => value,
            validator: null
        },
        {
            label: 'VIN',
            name: 'vehicle.vin',
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Марка ТС',
            name: 'vehicle.make',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => /[a-zA-Zа-яА-Я]+/.test(value) ? true : 'Неверный формат'
            }
        },
        {
            label: 'Модель ТС',
            name: 'vehicle.model',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Категория ТС',
            name: 'vehicle.category',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Год выпуска ТС',
            name: 'vehicle.yearManufacturedOn',
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Шасси №',
            name: 'vehicle.chassisNumber',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Кузов №',
            name: 'vehicle.bodyNumber',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Цвет ТС',
            name: 'vehicle.color',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: () => {
            }
        },
        {
            label: 'Мощность двигателя, л.с.',
            name: 'vehicle.enginePowerHp',
            editable: false,
            required: true,
            value: 0,
            type: 'number',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Разрешенная max масса, кг.',
            name: 'vehicle.weightGross',
            editable: false,
            required: true,
            value: 0,
            type: 'number',
            formatter: value => value,
            validator: null
        },
        {
            label: 'Масса без нагрузки, кг.',
            name: 'vehicle.weightEmpty',
            editable: false,
            required: true,
            value: 0,
            type: 'number',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Тип документа на грузовик',
            name: 'vehicle.document.type',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => VehicleDocTypes[value],
            validator: null,
            hide: true
        },
        {
            label: 'Серия',
            name: 'vehicle.document.series',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Номер',
            name: 'vehicle.document.number',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null,
            hide: true
        },
        {
            label: 'Дата выдачи',
            name: 'vehicle.document.issuedAt',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: getTodayEnd().toJSDate(),
            minDate: ({yearManufacturedOn}) => {
                if (yearManufacturedOn) return DateTime.local(yearManufacturedOn).toJSDate()
                return null
            },
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                validate: (fieldName, value) => {
                    const yearManufacturedOn = getValues()?.[`vehicle.yearManufacturedOn`]
                    if (!yearManufacturedOn || !value) {
                        return true
                    }

                    const diff = DateTime.local(yearManufacturedOn)
                        .diff(DateTime.fromISO(value), ['days']).toObject();
                    return diff.days <= 0 ? true : 'Дата выдачи не ранее года выпуска ТС'
                }
            },
            hide:true
        }
    ],
});
const getDiagnosticCardFields = (getValues) => ({
    title: 'Диагностическая карта',
    fields: [
        {
            label: 'Номер ДК',
            name: 'vehicle.technicalInspection.number',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '000000000000000', //15
            formatter: value => value,
            validator: {
                validate: (fieldName, value = '') => {
                    if (value.length !== 15) return 'Номер ДК должен состоять из 15 символов'
                    return true
                }
            }
        },
        {
            label: 'Дата начала действия ДК',
            name: 'vehicle.technicalInspection.startOn',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: ({techInspectionEndOn}) => {
                if (techInspectionEndOn) {
                    return DateTime.fromISO(techInspectionEndOn).toJSDate()
                }
                return null
            },
            minDate: null,
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: null
        },
        {
            label: 'Дата окончания действия ДК',
            name: 'vehicle.technicalInspection.endOn',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: null,
            minDate: ({techInspectionStartOn}) => {
                if (techInspectionStartOn) {
                    return DateTime.fromISO(techInspectionStartOn).toJSDate()
                }
                return null
            },
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: null
        },
    ]
});
const getInsurerIndividualFields = (getValues) => ({
    title: 'Страхователь',
    fields: [
        {
            name: 'insurer.individual.lastName',
            label: 'Фамилия',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.individual.firstName',
            label: 'Имя',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.individual.patronymic',
            label: 'Отчество',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.individual.gender',
            label: 'Пол',
            editable: true,
            required: false,
            value: 'male',
            type: 'dropdown',
            options: GENDER_OPTIONS,
            formatter: value => GENDER_OPTIONS.find(o => o.value === value)?.label,
            validator: null
        },
        {
            name: 'insurer.individual.bornOn',
            label: 'Дата рождения',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            maxDate: DateTime.local().minus({years: 18}).toJSDate(),
            minDate: null,
            validator: {
                ...birthdayValidator()[1]
            }
        },
        {
            name: 'documentType',
            label: 'Тип документа',
            editable: false,
            required: false,
            value: 'Паспорт',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.individual.passport.series',
            label: 'Серия паспорта',
            editable: true,
            required: true,
            value: '',
            mask: '00 00',
            type: 'masked',
            formatter: value => `${value.slice(0, 2)} ${value.slice(2, 4)}`,
            validator: {
                validate: (fieldName, value) => value?.length === 4 ? true : 'Серия паспорта должна состоять из 4-х цифр',
            }
        },
        {
            name: 'insurer.individual.passport.number',
            label: 'Номер паспорта',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '000000',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => value?.length === 6 ? true : 'Номер паспорта должен состоять из 6-ти цифр'
            }
        },
        {
            name: 'insurer.individual.passport.issuedOn',
            label: 'Когда выдан',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: getTodayEnd().toJSDate(),
            minDate: ({driverBornOnValue}) => {
                if (driverBornOnValue) return getAgeDateObject(driverBornOnValue, 14).toJSDate()
                return null
            },
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                ...passportIssuedOnValidator(null, getValues)[1]
            }
        },
        {
            name: 'insurer.individual.passport.departmentCode',
            label: 'Код подразделения',
            editable: true,
            required: false,
            value: '',
            type: 'masked',
            mask: '000-000',
            formatter: value => `${value.slice(0, 3)}-${value.slice(3, 6)}`,
            validator: {
                validate: (fieldName, value) => value?.length === 6 ? true : 'Код подразделения должен состоять из 6-ти цифр'
            }
        },
        {
            name: 'insurer.individual.passport.issuer',
            label: 'Кем выдан',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.individual.address',
            label: 'Адрес регистрации',
            editable: true,
            required: true,
            value: '',
            type: 'address',
            formatter: value => value.fullAddress || '',
            validator: {
                validate: (fieldName, value) => {
                    if (!value.fullAddress) return 'Поле обязательно для заполнения'
                    if (value.fiasLevel < 8) return 'Неверный формат'

                    return true
                },
            }
        },
        {
            name: 'insurer.individual.phone',
            label: 'Мобильный телефон',
            editable: true,
            required: true,
            value: '',
            type: 'phone',
            formatter: value => `+7${value}`,
            validator: {
                validate: (fieldName, value) => {
                    if (!value) return true
                    if (value.length < 10) {
                        return 'Некорректный номер телефона'
                    }
                }
            }
        },
        {
            name: 'insurer.individual.email',
            label: 'E-mail',
            editable: true,
            required: true,
            value: '',
            type: 'email',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => {
                    if (!value) return true
                    if (!isEmailValid(value)) {
                        return 'E-mail указан некорректно'
                    }
                }
            }
        },
    ]
});
const getOwnerIndividualFields = (getValues) => ({
    title: 'Собственник ТС',
    fields: [
        {
            name: 'owner.individual.lastName',
            label: 'Фамилия',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.individual.firstName',
            label: 'Имя',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.individual.patronymic',
            label: 'Отчество',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.individual.gender',
            label: 'Пол',
            editable: true,
            required: false,
            value: 'male',
            type: 'dropdown',
            options: GENDER_OPTIONS,
            formatter: value => GENDER_OPTIONS.find(o => o.value === value)?.label,
            validator: null
        },
        {
            name: 'owner.individual.bornOn',
            label: 'Дата рождения',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            maxDate: DateTime.local().minus({years: 18}).toJSDate(),
            minDate: null,
            validator: {
                ...birthdayValidator()[1]
            }
        },
        {
            name: 'documentType',
            label: 'Тип документа',
            editable: false,
            required: false,
            value: 'Паспорт',
            type: 'text',
            excludeApi: true,
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.individual.passport.series',
            label: 'Серия паспорта',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '00 00',
            formatter: value => `${value.slice(0, 2)} ${value.slice(2, 4)}`,
            validator: {
                validate: (fieldName, value) => value?.length === 4 ? true : 'Серия паспорта должна состоять из 4-х цифр',
            }
        },
        {
            name: 'owner.individual.passport.number',
            label: 'Номер паспорта',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '000000',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => value?.length === 6 ? true : 'Номер паспорта должен состоять из 6-и цифр',
            }
        },
        {
            name: 'owner.individual.passport.issuedOn',
            label: 'Когда выдан',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            maxDate: getTodayEnd().toJSDate(),
            minDate: ({driverBornOnValue}) => {
                if (driverBornOnValue) return getAgeDateObject(driverBornOnValue, 14).toJSDate()
                return null
            },
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                ...passportIssuedOnValidator(null, getValues)[1]
            }
        },
        {
            name: 'owner.individual.passport.departmentCode',
            label: 'Код подразделения',
            editable: true,
            required: false,
            value: '',
            type: 'masked',
            mask: '000-000',
            formatter: value => `${value.slice(0, 3)}-${value.slice(3, 6)}`,
            validator: {
                validate: (fieldName, value) => value?.length === 6 ? true : 'Код подразделения должен состоять из 6-и цифр',
            }
        },
        {
            name: 'owner.individual.passport.issuer',
            label: 'Кем выдан',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.individual.address',
            label: 'Адрес регистрации',
            editable: true,
            required: true,
            value: '',
            type: 'address',
            formatter: value => value.fullAddress || '',
            validator: {
                validate: (fieldName, value) => {
                    if (!value.fullAddress) return 'Поле обязательно для заполнения'
                    if (value.fiasLevel < 8) return 'Неверный формат'

                    return value
                },
            }
        },
        {
            name: 'owner.individual.phone',
            label: 'Мобильный телефон',
            editable: true,
            required: true,
            value: '',
            type: 'phone',
            formatter: value => `+7${value}`,
            validator: {
                validate: (fieldName, value) => {
                    if (!value) return true
                    if (value.length < 10) {
                        return 'Некорректный номер телефона'
                    }
                }
            }
        },
        {
            name: 'owner.individual.email',
            label: 'E-mail',
            editable: true,
            required: true,
            value: '',
            type: 'email',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => {
                    if (!value) return true
                    if (!isEmailValid(value)) {
                        return 'E-mail указан некорректно'
                    }
                }
            }
        },
    ]
});
const getInsurerLegalEntityFields = (getValues) => ({
    title: 'Страхователь',
    name: 'legalEntityInsurer',
    fields: [
        {
            name: 'insurer.legalEntity',
            label: 'ИНН организации',
            editable: false,
            required: true,
            value: '',
            type: 'inn',
            formatter: value => value.inn,
            validator: null
        },
        {
            name: 'insurer.legalEntity.kpp',
            label: 'КПП',
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.legalEntity.title',
            label: 'Наименование организации',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'insurer.legalEntity.legalAddress',
            label: 'Юридический адрес',
            editable: false,
            required: false,
            value: '',
            type: 'address',
            formatter: value => value.fullAddress || '',
            validator: null
        },
        {
            name: 'insurer.legalEntity.issuedAt',
            hide: true,
            validator: null
        },
        {
            name: 'insurer.legalEntity.number',
            hide: true,
            validator: null
        },
        {
            name: 'insurer.legalEntity.series',
            hide: true,
            validator: null
        },
        {
            name: 'insurer.legalEntity.ogrn',
            hide: true,
            validator: null
        }
    ]
});
const getOwnerLegalEntityFields = (getValues) => ({
    title: 'Собственник ТС',
    fields: [
        {
            name: 'owner.legalEntity.inn',
            label: 'ИНН организации',
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.legalEntity',
            hide: true,
            validator: null
        },
        {
            name: 'owner.legalEntity.kpp',
            label: 'КПП',
            editable: false,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.legalEntity.title',
            label: 'Наименование организации',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'owner.legalEntity.legalAddress',
            label: 'Юридический адрес',
            editable: false,
            required: false,
            value: '',
            type: 'address',
            formatter: value => value.fullAddress || '',
            validator: null
        },
        {
            name: 'owner.legalEntity.issuedAt',
            hide: true,
            validator: null
        },
        {
            name: 'owner.legalEntity.number',
            hide: true,
            validator: null
        },
        {
            name: 'owner.legalEntity.series',
            hide: true,
            validator: null
        },
        {
            name: 'owner.legalEntity.ogrn',
            hide: true,
            validator: null
        }
    ]
});
const getDriversFields = (getValues) => ({
    title: 'Водитель [0]',
    name: 'drivers',
    fields: [
        {
            name: 'drivers[0].individual.lastName',
            label: 'Фамилия',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'drivers[0].individual.firstName',
            label: 'Имя',
            editable: true,
            required: true,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'drivers[0].individual.patronymic',
            label: 'Отчество',
            editable: true,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value,
            validator: null
        },
        {
            name: 'drivers[0].individual.gender',
            label: 'Пол',
            editable: true,
            required: false,
            value: 'male',
            type: 'dropdown',
            options: GENDER_OPTIONS,
            formatter: value => GENDER_OPTIONS.find(o => o.value === value)?.label,
            validator: null
        },
        {
            name: 'drivers[0].individual.bornOn',
            label: 'Дата рождения',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            maxDate: DateTime.local().minus({years: 18}).toJSDate(),
            minDate: null,
            validator: {
                ...birthdayValidator()[1]
            }
        },
        {
            name: 'drivers[0].driverLicense.countryCodeIso',
            label: 'Тип водительского удостоверения',
            editable: false,
            required: false,
            value: '',
            type: 'text',
            formatter: value => value === 'RUS' ? 'Российское' : 'Иностранное',
            validator: null
        },
        {
            name: 'drivers[0].driverLicense.series',
            label: 'Серия ВУ',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '0000',
            formatter: value => value,
            validator: null
        },
        {
            name: 'drivers[0].driverLicense.number',
            label: 'Номер ВУ',
            editable: true,
            required: true,
            value: '',
            type: 'masked',
            mask: '000000',
            formatter: value => value,
            validator: null
        },
        {
            name: 'drivers[0].driverLicense.issuedOn',
            label: 'Дата выдачи ВУ',
            editable: true,
            required: true,
            value: null,
            type: 'date',
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            minDate: ({driverBornOnValue}) => {
                let driverSixTeenDateObject, minDate
                const licenceMinValidDateObject = DateTime.local().minus({year: 11})
                if (!driverBornOnValue) {
                    minDate = licenceMinValidDateObject
                } else {
                    driverSixTeenDateObject = getAgeDateObject(driverBornOnValue, 16)
                    // calculate event that comes later => this will be our minDate
                    if (driverSixTeenDateObject.toMillis() - licenceMinValidDateObject.toMillis() > 0) {
                        minDate = driverSixTeenDateObject
                    } else {
                        minDate = licenceMinValidDateObject
                    }
                }

                return minDate.toJSDate()
            },
            maxDate: DateTime.local().toJSDate(),
            validator: {
                validate: (fieldName, value) => {
                    const driversBornOnFieldName = `${fieldName.split('.')[0]}.individual.bornOn`
                    const licenceMinValidDateObject = DateTime.local().minus({year: 11})
                    const driverBornOnValue = getValues(driversBornOnFieldName)
                    let driverSixTeenDateObject
                    if (driverBornOnValue) {
                        driverSixTeenDateObject = getAgeDateObject(driverBornOnValue, 16)
                    }
                    let minDate;
                    let valueDate;
                    if (!driverBornOnValue) {
                        minDate = licenceMinValidDateObject
                    } else {
                        // calculate event that comes later => this will be our minDate
                        if (driverSixTeenDateObject.toMillis() - licenceMinValidDateObject.toMillis() > 0) {
                            minDate = driverSixTeenDateObject
                        } else {
                            minDate = licenceMinValidDateObject
                        }
                    }

                    if (value) {
                        valueDate = DateTime.fromISO(value)
                    }
                    // if value is later this is ok
                    if (valueDate.toMillis() - minDate.toMillis() > 0) {
                        return true
                    }

                    if (minDate === licenceMinValidDateObject) {
                        return 'Дата должна быть не ранее 11 лет от сегодня'
                    }

                    return 'Дата должна быть не ранее 16 лет от даты рождения'
                }
            }
        },
        {
            name: 'drivers[0].firstLicenseDateCategoryC',
            label: 'Дата получения категории "С"',
            editable: true,
            required: false,
            value: null,
            minDate: ({driverBornOnValue}) => {
                let driverEighteenDate = null
                if (driverBornOnValue) driverEighteenDate = getAgeDateObject(driverBornOnValue, 18).toJSDate()
                return driverEighteenDate
            },
            maxDate: DateTime.local().toJSDate(),
            type: 'date',
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                validate: (fieldName, value) => {
                    const driversBornOnFieldName = `${fieldName.split('.')[0]}.individual.bornOn`
                    return validateEighteen(getValues(driversBornOnFieldName), value)
                }
            }
        },
        {
            name: 'drivers[0].firstLicenseDateCategoryCE',
            label: 'Дата получения категории "СE"',
            editable: true,
            required: false,
            value: null,
            type: 'date',
            minDate: ({driverBornOnValue, firstLicenseDateCategoryC}) => {
                let driverNineteenDateObject, firstLicenseDateCategoryCPlusOneYearObject, resultMinDateObject
                if (driverBornOnValue) driverNineteenDateObject = getAgeDateObject(driverBornOnValue, 19)
                if (firstLicenseDateCategoryC) firstLicenseDateCategoryCPlusOneYearObject = getAgeDateObject(firstLicenseDateCategoryC, 1)

                if (driverNineteenDateObject && firstLicenseDateCategoryCPlusOneYearObject) {
                    resultMinDateObject = driverNineteenDateObject > firstLicenseDateCategoryCPlusOneYearObject
                        ? driverNineteenDateObject
                        : firstLicenseDateCategoryCPlusOneYearObject
                } else {
                    resultMinDateObject = firstLicenseDateCategoryCPlusOneYearObject || driverNineteenDateObject
                }

                return resultMinDateObject ? resultMinDateObject.toJSDate() : null
            },
            maxDate: DateTime.local().toJSDate(),
            formatter: value => value ? DateTime.fromISO(value).toFormat('dd.MM.yyyy') : null,
            validator: {
                validate: (fieldName, value) => {
                    let firstLicenseDateCategoryCPlusOneYearObject, driverNineteenDateObject

                    if (getValues('vehicle.hasTrailer') && !value) {
                        return 'Поле обязательно для заполнения'
                    }

                    if (value) {
                        const valueDateObject = getAgeDateObject(value, 0)
                        const driversBornOnFieldName = `${fieldName.split('.')[0]}.individual.bornOn`
                        const firstLicenseDateCategoryCFieldName = `${fieldName.split('.')[0]}.firstLicenseDateCategoryC`

                        if (getValues(firstLicenseDateCategoryCFieldName)) {
                            firstLicenseDateCategoryCPlusOneYearObject = getAgeDateObject(getValues(firstLicenseDateCategoryCFieldName), 1)
                        }

                        if (getValues(driversBornOnFieldName)) {
                            driverNineteenDateObject = getAgeDateObject(getValues(driversBornOnFieldName), 1)
                        }

                        if (firstLicenseDateCategoryCPlusOneYearObject) {
                            if (valueDateObject <= firstLicenseDateCategoryCPlusOneYearObject) {
                                return 'С момента получения категории "С" должен пройти 1 год'
                            }
                        }

                        if (driverNineteenDateObject) {
                            if (valueDateObject <= driverNineteenDateObject) {
                                return 'Дата должна быть не ранее, чем 19 лет со дня рождения'
                            }
                        }

                        return true
                    }

                    return true
                }
            }
        },
        {
            name: 'drivers[0].prevDriverLicense.series',
            label: 'Серия предыдущего ВУ',
            editable: true,
            required: false,
            value: '',
            type: 'masked',
            mask: '0000',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => {
                    if (!getValues(`${fieldName.split('.')[0]}.prevDriverLicense.number`)) {
                        return true
                    }

                    return value ? true : 'Поле обязательно для заполнения'
                }
            }
        },
        {
            name: 'drivers[0].prevDriverLicense.number',
            label: 'Номер предыдущего ВУ',
            editable: true,
            required: false,
            value: '',
            type: 'masked',
            mask: '000000',
            formatter: value => value,
            validator: {
                validate: (fieldName, value) => {
                    if (!getValues(`${fieldName.split('.')[0]}.prevDriverLicense.series`)) {
                        return true
                    }

                    return value ? true : 'Поле обязательно для заполнения'
                }
            }
        },
    ]
});

export const ContractDataFieldsMap = (getValues, ownerType) => {
    const fields = [
        getCommonFields(getValues),
        getTransportFields(getValues),
        getDiagnosticCardFields(getValues),
    ]
    if (ownerType === ORGANIZATION_TYPE_LEGAL) {
        fields.push(getOwnerLegalEntityFields(getValues));
        fields.push(getInsurerLegalEntityFields(getValues));
    } else {
        fields.push(getInsurerIndividualFields(getValues));
        fields.push(getOwnerIndividualFields(getValues));
        fields.push(getDriversFields(getValues));
    }
    return map(fields, f => ({...f, editable: false}))
}

const getValue = (data, name) => lodashGet(data, name);

export const getContractDataValue = (data, name) => {
    let value = getValue(data, name)
    switch (name) {
        case 'cargoType':
            value = data?.vehicle?.isStandardCargo ? 'isStandardCargo' : 'isHighRiskCargo'
            break;
        case 'owner.individual.address':
            value = getValue(data, `${name}.fullAddress`) || ''
            break;
    }

    return value
}

const getStateFields = (fields, driverIndex) => {
    let result = {}
    fields.forEach(field => {
        const stateField = {
            ref: {current: null},
            type: field.type,
            value: field.value,
            shouldConfirm: false,
            editable: field.editable,
            name: field.name.replace('[0]', `[${driverIndex}]`),
        }
        result[stateField.name] = stateField
    })
    return result
}

export const getContractDataInitialState =
    (driversCount, ownerType) => ContractDataFieldsMap(noop, ownerType).reduce((acc, block) => {
        if (block.name === 'drivers') {
            for (let i = 0; i < driversCount; i++) {
                acc = {...acc, ...getStateFields(block.fields, i)}
            }
        } else {
            acc = {...acc, ...getStateFields(block.fields)}
        }
        return acc
    }, {})

const getKeysForObject = key => key
    .toString()
    .replace(/\[/g, '.')
    .replace(/]/g, '')

const fillMultidimensionalObject = (obj, key, value) => {
    const match = getKeysForObject(key).match(/^([a-z0-9]+)\.?([a-z0-9.]+)?$/i)
    const root = match?.[1]

    if (!root) {
        return
    }
    if (!match?.[2]) {
        obj[root] = value
        return
    }
    if (!obj[root]) {
        obj[root] = {}
    }

    fillMultidimensionalObject(obj[root], match?.[2], value)
}

export const mapContractFieldsToApi = (contractData, driversCount, ownerType) => {
    let requestData = {}
    Object.values(contractData).forEach(field => {
        fillMultidimensionalObject(requestData, field.name, field.value)
    })

    if (driversCount > 0) {
        requestData.drivers = Object.values(requestData.drivers)
        requestData.drivers.forEach(driver => {
            if (!driver.prevDriverLicense.number && !driver.prevDriverLicense.series) {
                driver.prevDriverLicense = null
            } else {
                driver.prevDriverLicense.countryCodeIso = 'RUS'
            }
        })
    } else {
        delete requestData.drivers
    }

    requestData.isRestricted = !!requestData.driverCount
    requestData.vehicle.isStandardCargo = requestData.cargoType === 'isStandardCargo'
    requestData.vehicle.isHighRiskCargo = requestData.cargoType === 'isHighRiskCargo'
    requestData.insurer.type = ownerType
    requestData.owner.type = ownerType

    return requestData
}

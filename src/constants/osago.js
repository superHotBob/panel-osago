import React from "react";
import {DateTime} from "luxon";

export const ORGANIZATION_TYPE_INDIVIDUAL = 'individual'
export const ORGANIZATION_TYPE_LEGAL = 'legalEntity'
export const ORGANIZATION_TYPE_PRIVATE_ENTREPRENEUR = 'privateEntrepreneur'

export const ROLE_TYPE_AGENT = 'agent'
export const ROLE_TYPE_OTHER = 'other'
export const ROLE_TYPE_OWNER = 'owner'
export const ROLE_TYPE_OWNER_REPRESENTATIVE = 'ownerRepresentative'

export const HELP_TYPE_AGENT = 'operator'
export const HELP_TYPE_OPERATOR = 'operator'
export const HELP_TYPE_OWNER = 'myself'

export const PAYMENT_TYPE_CARD = 'PAYMENT_TYPE_CARD'
export const PAYMENT_TYPE_BILL = 'PAYMENT_TYPE_BILL'

export const OSAGO_SOURCE_VALUE = 'f65b8984-f321-455c-bca4-8eac349dffa1'
export const E100_SOURCE_VALUE = '1af7ee5b-a68d-4f4e-9c3c-e8c664aab083'
export const ELPOLIS_SOURCE_VALUE = '88cc9f26-d156-4835-940f-7304ade326a5'
export const AGENT_BROKER_SOURCE_VALUE = '6481d719-e635-480b-8f45-c5b1621bfcd2'
export const OBOZ_SOURCE_VALUE = 'a4f2723f-6f72-4dab-847c-054aaf6cf741'
export const INFULL_SOURCE_VALUE = 'ea556cde-6330-4a0e-b7b0-1f1f71ec86d9'
export const POLIS_ONLINE_SOURCE_VALUE = 'ea556cde-6330-4a0e-b7b0-1f1f71ec86d9'
export const EUROGARANT_SOURCE_VALUE = 'ce46d363-2166-4686-a223-46b85a1c523d'
export const GPNREGION_SOURCE_VALUE = 'a90224e7-20cd-45a2-b462-788027f09349'
export const KAMAZ_FLEET_STAGE_SOURCE_VALUE = 'd33cbd9e-7423-4d70-97dc-6dd624cd7e4f'
export const KAMAZ_FLEET_DEV_SOURCE_VALUE = 'c3f667db-95aa-432a-a2e2-e2e4e226fb53'
export const KAMAZ_FLEET_PROD_SOURCE_VALUE = 'df290f83-d5d6-4260-a732-3ba4450b962b'
export const IPOLIS_SOURCE_VALUE = '9f82cce5-7372-4d11-99eb-4f15e0bceeff'

export const OSAGO_NUMBER_TYPE_VIN = 'VIN'
export const OSAGO_NUMBER_TYPE_GOV = 'GOV'

export const DRIVER_COUNT_OPTIONS = [
    {value: 'no-restriction', label: 'Без ограничений'},
    {value: 1, label: '1 водитель'},
    {value: 2, label: '2 водителя'},
    {value: 3, label: '3 водителя'},
    {value: 4, label: '4 водителя'},
    {value: 5, label: '5 водителей'}
]

export const GENDER_OPTIONS = [
    {value: 'not', label: 'Н'},
    {value: 'male', label: 'М'},
    {value: 'female', label: 'Ж'}
]

export const GENDER_OPTIONS_FULL = [
    {value: 'not', label: 'Не определен'},
    {value: 'male', label: 'Мужчина'},
    {value: 'female', label: 'Женщина'}
]

export const USER_ROLES = [
    {value: 'vehicleOwner', label: 'Владелец Грузовика'},
    {value: 'vehicleRenter', label: 'Арендую Грузовик'},
    {value: 'vehicleDriver', label: 'Водитель'},
    {value: 'justCurious', label: 'Просто Любопытно'},
    {value: 'other', label: 'Другое'},
]

export const SUBSCRIPTION_TARIFFS = {
    [1]: 'Pro Drive',
    [2]: 'Extra Drive'
}


export const OsagoDocs = {
    carSection: 1,
    sts: 11,
    stsSide1: 111,
    stsSide2: 112,
    pts: 12,
    ptsSide1: 121,
    ptsSide2: 122,
    ownerSection: 2,
    ownerPassport: 22,
    ownerPassportSide1: 221,
    ownerPassportSide2: 222,
    insuredSection: 3,
    insuredPassport: 33,
    insuredPassportSide1: 331,
    insuredPassportSide2: 332,
    diagnosticCardFake: 9998,
    diagnosticCard: 4,
    driverLicenseFake: 9999,
    driverLicenseSection: [5, 6, 7, 8, 9],
    driverLicense: [51, 52, 61, 62, 71, 72, 81, 82, 91, 92]
}
const OsagoDocsData = {
    [OsagoDocs.carSection]: {
        preview: null,
        order: 90,
        title: 'Документ на Грузовик',
        view: 'tabs'
    },
    [OsagoDocs.sts]: {
        preview: null,
        order: 100,
        title: 'СТС',
    },
    [OsagoDocs.stsSide1]: {
        preview: 'sts-1',
        order: 110,
        title: <span><b>СТС сторона 1:</b> Тех. характеристики ТС</span>,
    },
    [OsagoDocs.stsSide2]: {
        preview: 'sts-2',
        order: 120,
        title: <span><b>СТС сторона 2:</b> Данные о собственнике</span>,
    },
    [OsagoDocs.pts]: {
        preview: null,
        order: 130,
        title: 'ПТС',
    },
    [OsagoDocs.ptsSide1]: {
        preview: 'pts-1',
        order: 140,
        title: <span><b>ПТС сторона 1:</b> Тех. характеристики ТС</span>,
    },
    [OsagoDocs.ptsSide2]: {
        preview: 'pts-2',
        order: 150,
        title: <span><b>ПТС сторона 2:</b> Данные о собственнике</span>,
    },
    [OsagoDocs.insuredSection]: {
        preview: null,
        order: 10,
        title: null,
    },
    [OsagoDocs.insuredPassport]: {
        preview: null,
        order: 20,
        title: 'Документы Страхователя',
    },
    [OsagoDocs.insuredPassportSide1]: {
        preview: 'passport-1',
        order: 30,
        title: <span><b>Паспорт страхователя:</b> Разворот с фото</span>,
    },
    [OsagoDocs.insuredPassportSide2]: {
        preview: 'passport-2',
        order: 40,
        title: <span><b>Паспорт страхователя:</b> Прописка</span>,
    },
    [OsagoDocs.ownerSection]: {
        preview: null,
        order: 50,
        title: null,
    },
    [OsagoDocs.ownerPassport]: {
        preview: null,
        order: 60,
        title: 'Документы Владельца ТС',
    },
    [OsagoDocs.ownerPassportSide1]: {
        preview: 'passport-1',
        order: 70,
        title: <span><b>Паспорт владельца ТС:</b> Разворот с фото</span>,
    },
    [OsagoDocs.ownerPassportSide2]: {
        preview: 'passport-2',
        order: 80,
        title: <span><b>Паспорт владельца ТС:</b> Прописка</span>,
    },
    [OsagoDocs.diagnosticCardFake]: {
        preview: 'diagnostic-card',
        order: 160,
        title: 'Диагностическая карта',
    },
    [OsagoDocs.diagnosticCard]: {
        preview: 'diagnostic-card',
        order: 160,
        title: 'Сторона с регистрационным номером ДК',
    },
    [OsagoDocs.driverLicenseFake]: {
        preview: null,
        order: 170,
        title: 'Водительское удостоверение допущенных к управлению',
    }
}

OsagoDocs.driverLicenseSection.forEach((id, i) => {
    OsagoDocsData[id] = {
        preview: null,
        order: 180 + i * 30,
        title: null,
    }
})

OsagoDocs.driverLicense.forEach((id, i) => {
    const side = id % 2 === 0 ? 2 : 1
    const driverNumber = Math.floor(i / 2) + 1
    OsagoDocsData[id] = {
        preview: `driver-license-${side}`,
        order: 180 + side * 10 + driverNumber * 30,
        title:
            <span><b>{`${driverNumber}-й водитель:`}</b> {`ВУ сторона ${side}` + (side === 2 ? ' - стаж' : '')}</span>,
    }
})

export {OsagoDocsData}

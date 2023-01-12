import {
    getAccidentUrl,
    getCargoUrl,
    getFaqUrl,
    getInjuryUrl,
    getLiabilityUrl,
    getOsagoUrl,
    getProDriveUrl
} from "../utils/urls";
import {IconName} from "../components/icon-sprite/IconSprite";

export const MAIN_MENU = [
    {
        label: 'Вероятность ДТП',
        icon: IconName.SCORE,
        url: getAccidentUrl(),
    },
    {
        label: 'ЕОСАГО',
        icon: IconName.SHIELD,
        url: getOsagoUrl(),
    },
    {
        label: 'ГОП',
        icon: IconName.TRUCK,
        // url: getLiabilityUrl(),
        disabledText: 'Страхование Гражданской Ответственности Перевозчика',
        startText: '1 квартал 2021'
    },
    {
        label: 'НС',
        icon: IconName.UMBRELLA,
        // url: getInjuryUrl(),
        disabledText: 'Страхование Водителя от Несчастного Случая',
        startText: '1 квартал 2021'
    },
    {
        label: 'Грузы',
        icon: IconName.PACK,
        // url: getCargoUrl(),
        disabledText: 'Страхование Грузов',
        startText: '2 квартал 2021'
    },
    {
        label: 'Турнир',
        icon: IconName.CUP,
        // url: getProDriveUrl(),
        disabledText: 'Международный Турнир Профессиональных Водителей',
        startText: '3 квартал 2021'
    },
    {
        label: 'FAQ',
        icon: IconName.FAQ,
        url: getFaqUrl(),
    },
];

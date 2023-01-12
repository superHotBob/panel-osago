import React, { useCallback, useEffect, useState } from 'react';
import { BemHelper } from '../../../utils/class-helper';
import { Slider } from '../../../components/slider/slider';
import { calculatorTrack, CustomEventName } from '../../../modules/tracking';

// Styles
import './subscriptions-calculation.scss';

// Classes
const classes = new BemHelper({ name: 'subscriptions-calculation' });

// Components
export const SubscriptionsCalculation = () => {
  const [carCounter, setCarCounter] = useState(5); // 20
  const [moneyCounter, setMoneyCounter] = useState(12000);
  const [priceSelect, setPriceSelect] = useState('min');
  const [profitMonth, setProfitMonth] = useState(3980);
  const [profitYear, setProfitYear] = useState(388800);
  const carSliderConfig = {
    min: 1,
    max: 100
  }
  const moneySliderConfig = {
    min: 0,
    max: 50000
  }
  const price = {
    min: 199,
    max: 599,
  }

  useEffect(() => {
    // Формула для калькулятора выгоды:
    // для Pro Drive
    // Profit = (Количество ТС  * 0,2 * 32 * Сумму выручки в день + 120.000 ) * 0,3

    // для Extra Drive
    // Profit = (Количество ТС  * 0,2 * 32 * Сумму выручки в день + 120.000 ) * 0,5

    // Расчет стоимости подписки
    // Цена тарифа * Количество ТС
    const profit = carCounter * (0.2 * 32 * moneyCounter + 120000) * (priceSelect === 'min' ? 0.3 : 0.5);
    const price = carCounter * (priceSelect === 'min' ? 199 : 599);

    setProfitYear(profit);
    setProfitMonth(price)

  }, [carCounter, moneyCounter, priceSelect]);

  const handleCarCounter = e => void setCarCounter(e);
  const handleMoneyCounter = e => void setMoneyCounter(e);
  const handleCalculatorTrack = () => void calculatorTrack(carCounter, moneyCounter);

  return (
    <div {...classes()}>
      <div {...classes('body')}>
        <h2 {...classes('title')}>
          Экономь с подпиской, Рассчитай свою выгоду
        </h2>
        <h3 {...classes('subtitle')}>
          Рассчитай сумму своей Выгоды от экономии, которую ты сможешь получить
          через снижение аварийности и уменьшение рисков ДТП для своего автопарка.
        </h3>
        <div {...classes('wrapper')}>
          <div {...classes('sliders')}>
            <div {...classes('sliders__item')}>
              <div {...classes('sliders__header')}>
                <span {...classes('sliders__header__title')}>Количество автомобилей</span>
                <span {...classes('sliders__header__info')}>{carCounter.toLocaleString('ru-RU')} авто</span>
              </div>
              <Slider
                min={carSliderConfig.min}
                max={carSliderConfig.max}
                initialValue={carCounter}
                getValue={handleCalculatorTrack}
                onInputValue={handleCarCounter}
              />
              <div {...classes('sliders__footer')}>
                <span>{carSliderConfig.min}</span>
                <span>{carSliderConfig.max}</span>
              </div>
            </div>
            <div {...classes('sliders__item')}>
              <div {...classes('sliders__header')}>
                <span {...classes('sliders__header__title')}>Средняя выручка в день на 1 (один) автомобиль</span>
                <span {...classes('sliders__header__info')}>{moneyCounter.toLocaleString('ru-RU')} ₽</span>
              </div>
              <Slider
                min={moneySliderConfig.min}
                max={moneySliderConfig.max}
                initialValue={moneyCounter}
                step={100}
                getValue={handleCalculatorTrack}
                onInputValue={handleMoneyCounter}
              />
              <div {...classes('sliders__footer')}>
                <span>{moneySliderConfig.min}</span>
                <span>{moneySliderConfig.max}</span>
              </div>
            </div>
          </div>
          <div {...classes('info')}>
            <div {...classes('info__head')}>
              <div {...classes('info__config')}>
                <button
                  type="button"
                  {...classes('config__item', priceSelect === 'min' ? 'active' : '')}
                  onClick={() => {setPriceSelect('min'); AddTrack(CustomEventName.PRICE_199_PER_MONTH)}}
                >
                  {price.min + ' ₽ / мес'}
                </button>
                <button
                  type="button"
                  {...classes('config__item', priceSelect === 'max' ? 'active' : '')}
                  onClick={() => {setPriceSelect('max'); AddTrack(CustomEventName.PRICE_599_PER_MONTH)}}
                >
                  {price.max + ' ₽ / мес'}
                </button>
              </div>
            </div>
            <div {...classes('info__content')}>
              <div {...classes('info__content__item')}>
                <div {...classes('info__title')}>
                  Выгода в год с <span {...classes('primary')}>Pro Drive</span>
                </div>
                <div {...classes('info__counter')}>
                  {profitYear.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div {...classes('info__content__item')}>
                <div {...classes('info__title', 'small')}>
                  Стоимость в месяц с <span {...classes('primary')}>Pro Drive</span>
                </div>
                <div {...classes('info__counter')}>
                  {profitMonth.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
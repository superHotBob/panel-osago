import React from 'react';
import { BemHelper } from '../../../utils/class-helper';

// SVG
import RoadAccident from '../../../svg/road-accident.svg';
import RoadAccident2 from '../../../svg/road-accident-2.svg';
import RoadAccident3 from '../../../svg/road-accident-3.svg';

// Styles
import './subsriptions-info.scss';

// Classes
const classes = new BemHelper({name: 'subscriptions-info'});

export const SubsciptionsInfo = ({
  showDivider,
  title,
  subTitle
}) =>{
  return (
    <>
      <div {...classes()}>
        <div {...classes('header')}>
          <h1 {...classes('header__title')}>{title}</h1>
          <h2 {...classes('header__subtitle')}>
            {subTitle}
          </h2>
        </div>
        <div {...classes('body')}>
          <div {...classes('item')}>
            <div {...classes('icon')}>
              <RoadAccident />
            </div>
            <div {...classes('title')}>
              Коммерческая техника и грузовики <b>попадают в ДТП</b> в среднем <br/><b>1 раз в 5 лет</b>
            </div>
          </div>
          <div {...classes('item')}>
            <div {...classes('icon')}>
              <RoadAccident2 />
            </div>
            <div {...classes('title')}>
              <b>Потери выручки</b> от простоев и расходы<br/>на ремонте <b>до 1 080 000 ₽</b><br/>на каждом ДТП
            </div>
          </div>
          <div {...classes('item')}>
            <div {...classes('icon')}>
              <RoadAccident3 />
            </div>
            <div {...classes('title')}>
              <b>Потери выручки + ремонты</b> после ДТП<br/>для автопарка из 20 автомобилей<br/><b>до 4 320 000 ₽</b> в год
            </div>
          </div>
        </div>
      </div>
      {showDivider && <div {...classes('divider')}></div>}
    </>
  );
}
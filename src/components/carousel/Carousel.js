import React from 'react';
import './carousel.scss';
import {CarouselItem} from '../carousel-item/CarouselItem';
import AlgorithmSvg from 'svg/algorithm.svg';
import Svg2 from 'svg/2.svg';
import Svg3 from 'svg/3.svg';

export class Carousel extends React.Component {

  render() {
    return (
      <div className="carousel">
        <CarouselItem svg={<AlgorithmSvg/>} text={<span>Высшая математика&nbsp;<br/>ИИ + машинное обучение</span>} subText="Расчеты и прогнозы основаны на самых инновационных методах"/>
          <CarouselItem svg={<Svg2/>} text={<span>Система анализирует 140+&nbsp;параметров авто</span>} subText="Данные из 24 официальных источников и открытых систем"/>
        <CarouselItem svg={<Svg3/>} text={<span>Сотни тысяч&nbsp;аварий<br/>Грузовиков по&nbsp;всей России</span>} subText="Детальный анализ причин, условий и обстоятельств ДТП Грузовиков"/>
      </div>
    );
  }

}

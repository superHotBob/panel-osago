import React from 'react';
import './auto-data.scss';
import {bool, string, number} from 'prop-types';
import classNames from 'classnames';
import {Text, TextColor, TextSize} from '../text/Text';
import {CarNumber} from '../car-number/CarNumber';

export class AutoData extends React.Component {

  static propTypes = {
    number: string,
    region: string,
    vin: string,
    make: string,
    model: string,
    manufacturedOn: number,
    className: string,
    withoutCarNumber: bool
  };

  render() {
    const {className, withoutCarNumber, number, region, vin = '', make, model, manufacturedOn} = this.props;
    return (
      <div className={classNames('auto-data', className)}>
        {!withoutCarNumber &&
        <>
          <div className="auto-data__title-container">
            <Text color={TextColor.ABSOLUTE_BLACK}
                  size={TextSize.S_14}
                  className="auto-data__title"
                  uppercase={true}>
              твой грузовик
            </Text>
          </div>
          <div className="auto-data__number-container">
            <Text size={TextSize.S_14}
                  className="auto-data__number-title"
                  color={TextColor.GRAY}
                  uppercase={true}>гос. номер грузовика</Text>
            <CarNumber number={number} region={region} readonly={true}/>
          </div>
        </>}
        <div className="auto-data__row">
          <div className="auto-data__column-1">
            <Text color={TextColor.GRAY}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              Марка тс
            </Text>
          </div>
          <div className="auto-data__column-2">
            <Text color={TextColor.ABSOLUTE_BLACK}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              {make}
            </Text>
          </div>
        </div>
        <div className="auto-data__row">
          <div className="auto-data__column-1">
            <Text color={TextColor.GRAY}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              Модель тс
            </Text>
          </div>
          <div className="auto-data__column-2">
            <Text color={TextColor.ABSOLUTE_BLACK}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              {model}
            </Text>
          </div>
        </div>
        <div className="auto-data__row">
          <div className="auto-data__column-1">
            <Text color={TextColor.GRAY}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              Год выпуска
            </Text>
          </div>
          <div className="auto-data__column-2">
            <Text color={TextColor.ABSOLUTE_BLACK}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              {manufacturedOn}
            </Text>
          </div>
        </div>
        <div className="auto-data__row">
          <div className="auto-data__column-1">
            <Text color={TextColor.GRAY}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              VIN номер
            </Text>
          </div>
          <div className="auto-data__column-2">
            <Text color={TextColor.ABSOLUTE_BLACK}
                  size={TextSize.S_12}
                  className="auto-data__title"
                  uppercase={true}>
              {vin}
            </Text>
          </div>
        </div>
      </div>
    );
  }

}

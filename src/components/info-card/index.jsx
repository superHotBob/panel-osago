import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import omit from 'lodash/omit';

import { CarNumber } from '../car-number/CarNumber';
import { Text, TextColor, TextSize } from '../text/Text';
import RateNote from './rateNote';
import {IconSprite} from 'components/icon-sprite/IconSprite';

import './info-card.scss';
import {Modal} from '../modal/Modal'

class InfoCard extends PureComponent {
  state = {
    isShowHistoryPopup: false,
  };

  hideFullHistory = () => {
    document.documentElement.classList.remove('is-fixed');

    this.setState({
      isShowHistoryPopup: false,
    });
  };

  showFullHistory = () => {
    document.documentElement.classList.add('is-fixed');

    this.setState({
      isShowHistoryPopup: true,
    });
  };

  render() {
    const { cards } = this.props;
    const {
      plates,
      make,
      model,
      yearManufacturedOn,
      vin,
    } = cards[0];
    const fields = [
      {
        title: 'Марка ТС',
        value: make,
      },
      {
        title: 'Модель ТС',
        value: model,
      },
      {
        title: 'Год выпуска',
        value: yearManufacturedOn,
      },
      {
        title: 'VIN номер',
        value: vin,
      },
    ];
    let groupedByDate = cards.reduce((acc, item, index) => {
      const rateDate = new Date(Date.parse(item.completedAt));
      const dateFormat = [
        rateDate.getFullYear(),
	      rateDate.getMonth(),
	      rateDate.getDate(),
      ].join('-');

      acc[dateFormat] = acc[dateFormat]
        ? [...acc[dateFormat], item]
        : [item];

      return acc;
    }, {});

    if (Object.keys(groupedByDate).length) {
      groupedByDate = omit(groupedByDate, Object.keys(groupedByDate).slice(3));
    }

    return (
      <div className="info-card">
        <div className='info-card__car-data'>
          <div className="info-card__num">
            <CarNumber
              number={ plates.substring(0, 6) }
              region={ plates.substring(6) }
              readonly={ true }
            />
          </div>

          <div className="info-card__about info-card__about_tablet">
            {
              fields.map(({ title, value }, index) => (
                <div
                  key={`fields-${ index }`}
                  className='info-card__car-data__item'
                >
                  <Text color={TextColor.GRAY}
                    size={TextSize.S_12}
                    className="info-card__car-data__item__title"
                    uppercase={true}
                  >{ title }</Text>

                  <Text color={TextColor.BLACK}
                    size={TextSize.S_14}
                    className="info-card__car-data__item__text"
                    uppercase={true}
                  >{ value }</Text>
                </div>
              ))
            }
          </div>
        </div>

        <div className="info-card__car-data">
          {
            map(groupedByDate, (card) => {
              const { id, rate, completedAt } = card[0];

              return (
                <RateNote
                  key={`info-card-note-${ id }`}
                  rate={rate}
                  completedAt={completedAt}
                />
              )
            })
          }

          <div className="info-card__foot">
            <div className="info-card__foot-item">
              <Link
                to={{
                  pathname: '/',
                  state: {
                    repeatPlate: plates.substring(0, 6),
                    repeatRegion: plates.substring(6),
                  }
                }}
                className="info-card__button"
              >
                <span className="info-card__button-text">Проверить еще раз</span>
              </Link>
            </div>

            <div className="info-card__foot-item">
              <button
                type="button"
                className="info-card__button"
                onClick={ this.showFullHistory }
                disabled={ cards.length < 3 }
              >
                <span className="info-card__button-icon">
                  <IconSprite name="history" />
                </span>
                <span className="info-card__button-text">История</span>
              </button>
            </div>

            <Modal
                  isOpened={this.state.isShowHistoryPopup && cards.length > 3}
                  description={<span>ваша история запросов</span>}
                  onClose={ this.hideFullHistory }>
                    <div className="info-card__history">
                      <div className="info-card__history-num">
                        <CarNumber
                          number={ plates.substring(0, 6) }
                          region={ plates.substring(6) }
                          readonly={ true }
                        />
                      </div>

                      <div className="info-card__history-list">
                        {
                          cards.map(({ id, rate, completedAt }) => (
                            <RateNote
                              key={`info-card-history-${ id }`}
                              rate={rate}
                              completedAt={completedAt}
                            />
                          ))
                        }
                      </div>
                    </div>
              </Modal>
          </div>



          <div className="info-card__about info-card__about_mobile">
            {
              fields.map(({ title, value }, index) => (
                <div
                  key={`fields-${ index }`}
                  className='info-card__car-data__item'
                >
                  <Text color={TextColor.GRAY}
                    size={TextSize.S_12}
                    className="info-card__car-data__item__title"
                    uppercase={true}
                  >{ title }</Text>

                  <Text color={TextColor.BLACK}
                    size={TextSize.S_14}
                    className="info-card__car-data__item__text"
                    uppercase={true}
                  >{ value }</Text>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const FakeCard = () => (
  <div className="info-card">
    <div className="info-card__car-data">
      <div className="info-card__fake-num" />
      <div className="info-card__fake-bar" />
      <div className="info-card__fake-bar" />
      <div className="info-card__fake-bar" />
      <div className="info-card__fake-bar" />
    </div>
    <div className="info-card__car-data">
      <div className="info-card__fake-bar info-card__fake-bar_history" />
      <div className="info-card__car-data-foot">
        <div className="info-card__fake-bar info-card__fake-bar_btn" />
      </div>
    </div>
  </div>
);

export default InfoCard;
export { FakeCard };

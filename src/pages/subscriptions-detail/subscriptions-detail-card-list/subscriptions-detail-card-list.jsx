import React, { useEffect, useState } from 'react';
import { BemHelper } from '../../../utils/class-helper';
import { Link } from 'react-router-dom';
import api from "../../../api";
// SVG
import VisaSvg from '../../../svg/visa.svg';
import MnrSvg from '../../../svg/mnr.svg';
// import MaestroSvg from '../../../svg/mnr.svg';
import MasterCardSvg from '../../../svg/Mastercard.svg';

// Classes
const classes = new BemHelper({ name: 'subscriptions-detail-card-list' });

// Styles
import './subscriptions-detail-card-list.scss';

// Component
export const SubscriptionsDetailCardList = () => {
  const [cards, setCardList] = useState([]),
    init = async () => {
      const cardList = await api(`/profile/cards`);

      if (cardList.status === 200) {
        const cardListJson = await cardList.json();
        setCardList(cardListJson.cards);
      }
    },
    insertCard = (card) => {
      return card.replace(/(.{4})/g, '$1 ').trim()
    };

  useEffect(() => {
    init();
  }, []);

  return (
    <div {...classes()}>
      <table {...classes('table')} cellPadding="0" border="0" cellSpacing="0">
        <tbody {...classes('body')}>
          {
            cards.reverse().map((card, key) => {
              return (
                <tr {...classes('row')} key={key}>
                  <td {...classes('define')}>
                    <div {...classes('icon')}>
                      {
                        card.cardType === 'Visa' &&
                        <div {...classes('icon')}>
                          <VisaSvg />
                        </div>
                      }
                      {
                        card.cardType === 'Mir' &&
                        <div {...classes('icon')}>
                          <MnrSvg />
                        </div>
                      }
                      {
                        card.cardType === 'Maestro' &&
                        <div {...classes('icon')}>
                          <MasterCardSvg />
                        </div>
                      }
                      {
                        card.cardType === 'MsterCard' &&
                        <div {...classes('icon')}>
                          <MasterCardSvg />
                        </div>
                      }
                    </div>
                  </td>
                  <td {...classes('define')}>
                    <span {...classes('title')}>
                      {insertCard(`${card.cardFirstSix}******${card.cardLastFour}`)}

                    </span>
                  </td>
                  <td {...classes('define', 'counter')}>
                    {card.cardExpDate}
                  </td>
                  {/* <td {...classes('define')}>
                    <Link to="#" {...classes('delete')}>Удалить</Link>
                  </td> */}
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
};

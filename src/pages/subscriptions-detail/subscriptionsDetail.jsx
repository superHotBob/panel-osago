import React, { useEffect } from 'react';
import { SubscriptionsDetailHistoryList } from './subscriptions-detail-history-list/SubscriptionsDetailHistoryList';
import { SubscriptionsDetailCardList } from './subscriptions-detail-card-list/subscriptions-detail-card-list';
import { SubscriptionsDetailItem } from './subscriptions-detail-item/subscriptions-detail-item';
import { SubHeader } from '../../components/sub-header/sub-header';
import { withWidgetId } from '../../hoc/withWidgetId';
import { BemHelper } from '../../utils/class-helper';

// SVG
import { IconName, IconSprite } from '../../components/icon-sprite/IconSprite';
import BurgerMenuBoxShieldSvg from '../../svg/burger-menu-box-shield.svg';

// Styles
import './subsriptions-detail.scss';

// Classes
const classes = new BemHelper({ name: 'subscriptions-detail' });

// Component
const SubscriptionsDetailPageComponent = ({
  free = 'Бесплатно для 3 авто',
  subscription,
  plans,
  refresh
}) => {
  const { current, hasActiveSubscription } = subscription,
  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('.');
  },
  insertCard = (card) => {
    return card.replace(/(.{4})/g, '$1 ').trim()
  },
  generateSubtitle = (active, id) => {
    if (active) {
      return `Оплаченный период закончится ${formatDate(current.expiresAt)}. Следующее продление ${formatDate(current.expiresAt)} за ${current.settings.price} руб. за ${current.settings.vehicleCount} авто картой ${insertCard(`${current.card.cardFirstSix}******${current.card.cardLastFour}`)}`;
    }
    return plans ? `${plans.plans.find(x => x.planId === id).amount} руб/мес за 1 авто` : '';
  };  

  useEffect(() => window.scrollTo({ top: 0 }), [])

  return (
    <div {...classes()}>
      <SubHeader />
      <h1 {...classes('title')}>
        Подписки и платежи
      </h1>
      <div {...classes('wrapper')}>
        <h3 {...classes('title-small')}>
          Подписки
        </h3>
        <h4 {...classes('subtitle')}>
          Управляйте вашими подписками и контролируйте продления
        </h4>
        <div {...classes('subscriptions')}>
          {/* settings */}
          {current && plans && <>
          
            <SubscriptionsDetailItem
              title="Pro Drive"
              subtitle={generateSubtitle(current.settings.planId === 1, 1)}
              active={current.settings.planId === 1}
              planId={1}
              price={plans.plans[0].amount}
              refresh={refresh}
              count={current.settings.vehicleCount}
            >
              <BurgerMenuBoxShieldSvg />
            </SubscriptionsDetailItem>

            <SubscriptionsDetailItem
              title="Extra Drive"
              subtitle={generateSubtitle(current.settings.planId === 2, 2)}
              active={current.settings.planId === 2}
              planId={2}
              price={plans.plans[1].amount}
              refresh={refresh}
              count={current.settings.vehicleCount}
            >
              <BurgerMenuBoxShieldSvg />
            </SubscriptionsDetailItem>
          </>}

          {/* <SubscriptionsDetailItem
            title="Free"
            subtitle={free}
            active={!hasActiveSubscription || current.settings.planId === 0}
            planId={0}
            price={0}
            refresh={refresh}
          >
            <BurgerMenuBoxShieldSvg />
          </SubscriptionsDetailItem> */}
        </div>
        <div {...classes('cards')}>
          <h3 {...classes('title-small')}>
            Платежные данные
          </h3>
          <h4 {...classes('subtitle')}>
            <span>
              Управляй своими картами для быстрой оплаты подписки
            </span>
          </h4>
          <div {...classes('cards__list')}>
            <SubscriptionsDetailCardList />
          </div>
          <h3 {...classes('title-small')}>
            История платежей
          </h3>
          <h4 {...classes('subtitle')}>
            Следите за историей подписок на MUST
          </h4>
          <div>
            <SubscriptionsDetailHistoryList />
          </div>
        </div>
      </div>
    </div>
  );
};


export const SubscriptionsDetailPage = withWidgetId(SubscriptionsDetailPageComponent);

import React, { useRef } from 'react';
import api from "../../../api";
import { BemHelper } from '../../../utils/class-helper';
import { Button } from '../../../components/button/Button';
import { GlobalAlert } from '../../../components/global-alert/global-alert';

// Classes
const classes = new BemHelper({ name: 'subscriptions-detail-item' });

// Styles
import './subscriptions-detail-item.scss';

// Component
export const SubscriptionsDetailItem = ({ title, subtitle, active, planId, price, refresh, count = 1, children }) => {
  // TODO improve this variable in future
  const COUNT = 1,
    alertRef = useRef(null),
    changeTariff = async () => {
      const change = window.confirm(`Изменить тариф на ${title} ?`);

      if (!change) return;

      const response = await api(
        "/subscription/update",
        "POST", {
        vehicleCount: count,
        planId: planId,
      });

      if (response.status === 200) {
        alertRef.current.showAlert(`Тариф был изминен на - "${title}"`);
        setTimeout(() => refresh(), 500);
      }

    },
    generateButton = () => {
      return <button
        // href="/payment"
        {...classes('button')}
        onClick={() => changeTariff()}
      >Подключить</button>
    },
    cancelPlan = async (comment) => {
      const response = await api(`/subscription/cancel`, "POST", { comment: comment });
      if (response.status === 200) {
        alertRef.current.showAlert(`Тариф "${title}" был отключен `);
        setTimeout(() => refresh(), 500);
      }
    };

  return (
    <div {...classes()}>
      <GlobalAlert ref={alertRef} />
      <div {...classes('wrapper')}>
        <div {...classes('content')}>
          <div {...classes('icon')}>
            {children}
          </div>
          <div {...classes('info')}>
            <h6 {...classes('title')}>
              {title}
            </h6>
            <p {...classes('subtitle')}>
              {subtitle}
            </p>
          </div>
        </div>
        {
          active ?
            <div {...classes('buttons')}>

              <Button
                type='button'
                onClick={() => cancelPlan('Отмена плана')}
                {...classes('button--transparent')}
              >
                Отключить
              </Button>
            </div>
            : generateButton()
        }


      </div>
    </div>
  )
};

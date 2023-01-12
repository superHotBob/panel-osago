import React, { useState, useCallback } from 'react';
import { BemHelper } from '../../../../utils/class-helper';
import { IconName, IconSprite } from '../../../../components/icon-sprite/IconSprite';
import { useSelector } from "react-redux";
import { selectAuthIsLoggedIn, selectAuthUser } from "../../../../redux/authReducer";

// Styles
import './subscriptions-tarif-item.scss';
import { AddTrack, CustomEventName } from '../../../../modules/tracking';

// Classes
const classes = new BemHelper({ name: 'subscriptions-tarif-item' });

// Components
export const SubscriptionsTarifItem = props => {
  const {
    headtext,
    title,
    price,
    planId,
    priceText,
    content = [],
    children,
    isFree = false,
    handleLoginClick
  } = props;
  const [count, setCount] = useState(1);
  const isLoggedIn = useSelector(selectAuthIsLoggedIn);

  const handleCount = useCallback((increase) => {
    const c = increase ? count + 1 : count - 1;
    setCount(c < 1 ? 1 : c);
  }, [count]);

  return (
    <div {...classes()}>
      {
        headtext ?
          <div {...classes('head', 'show')}>
            {headtext}
          </div>
          :
          <div {...classes('head')}></div>
      }
      <div {...classes('wrapper')}>
        <div {...classes('body')}>
          <div {...classes('title')}>
            {title}
          </div>
          <div {...classes('icon')}>
            {children}
          </div>
          <div {...classes('price')}>
            {price} ₽
          </div>
          <div {...classes('price-text')}>
            {priceText}
          </div>
          <ul {...classes('content')}>
            {
              content.map(item => {
                return (
                  <li
                    {...classes('content__item')}
                    key={item}
                  >
                    { item}
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div {...classes('footer')}>
          {!isFree && (
            <div {...classes('counter')}>
              <button {...classes('counter__minus')} onClick={() => { handleCount(false) }} type="button">
                <IconSprite
                  name={IconName.SIMPLE_MINUS}
                  {...classes('counter__icon')}
                />
              </button>
              <div {...classes('counter__value')}>{count}</div>
              <button {...classes('counter__plus')} onClick={() => { handleCount(true); AddTrack(CustomEventName.PLUS_PRO) }} type="button">
                <IconSprite
                  name={IconName.SIMPLE_PLUS}
                  {...classes('counter__icon')}
                />
              </button>
            </div>
          )}
          {isFree ? (
            <a
              href="#"
              {...classes('button_disabled')}
              onClick={(e) => e.preventDefault()}
            >
              ВКЛЮЧЕН
            </a>
          ) : (
            isLoggedIn
              ? <a
                href="/payment"
                {...classes('button')}
                onClick={() => {
                  AddTrack(CustomEventName.ADD_ITEM);
                  window.localStorage.setItem('osago-pay', JSON.stringify({ price, count, planId }))}
                }
              >
                ВКЛЮЧИТЬ - {price * count}&nbsp;<span {...classes('rouble')}>₽</span>
              </a>
              : <button
                {...classes('button')}
                onClick={()=> {
                  handleLoginClick();
                  AddTrack(CustomEventName.ADD_ITEM);
                }}
              >
                ВКЛЮЧИТЬ - {price * count}&nbsp;<span {...classes('rouble')}>₽</span>
              </button>
          )}
        </div>
      </div>
    </div>
  );
}
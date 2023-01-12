import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BemHelper } from '../../../utils/class-helper';
import api from "../../../api";
// SVG

// Classes
const classes = new BemHelper({ name: 'subscriptions-detail-history-list' });

// Styles
import './subscriptions-detail-history-list.scss';

// Component
export const SubscriptionsDetailHistoryList = () => {
  const [history, setHistory] = useState([]);
  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
      
    return [day, month, String(year).slice(2)].join('.');
  }

  const init = async () => {
    const historyList = await api(`/profile/wallet`);

    if (historyList.status === 200) {
      const historyListJson = await historyList.json();
      setHistory(historyListJson.operations);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <table {...classes()} cellPadding="0" border="0" cellSpacing="0">
      {/* Table Head */}
      <thead {...classes('head')}>
        <tr {...classes('row')}>
          <th {...classes('date', 'head')}>
            Дата
          </th>
          <th {...classes('head__item')}>
            Описание
          </th>
          <th></th>
          <th></th>
          <th {...classes('head__item')}>
            Сумма
          </th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody {...classes('body')}>
        {
          history.reverse().map((item, key) => {
            return (
              <tr {...classes('row')} key={key}>
                <td {...classes('date')}>
                  {formatDate(item.operationAt)}
                </td>
                <td {...classes('define')}>
                  {item.description}
                </td>
                <td {...classes('define', 'score')}>
                  {/* <Link to="#" {...classes('link')}>Счет</Link> */}
                </td>
                <td {...classes('define', 'receipt')}>
                  {/* <Link to="#" {...classes('link')}>Квитанция</Link> */}
                </td>
                <td {...classes('define', 'price')}>
                  {item.amount} руб.
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
};

import React from 'react';
import './legend.scss';

export class Legend extends React.Component {
  render() {
    return (
      <div className='score-graph__legend-container'>
        <span>
          <div className='score-graph__legend legend-red'></div>
          угроза ДТП
      </span>
        <span>
          <div className='score-graph__legend legend-orringe'></div>
          опасно
      </span>
        <span>
          <div className='score-graph__legend legend-yellow'></div>
          терпимо
      </span>
        <span>
          <div className='score-graph__legend legend-blue'></div>
          нормально
      </span>
        <span>
          <div className='score-graph__legend legend-green'></div>
          отлично
      </span>
      </div>
    );
  }
}
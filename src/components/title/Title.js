import React from 'react';
import './title.scss';

export class Title extends React.Component {

  render() {
    const {children} = this.props;
    return (
      <h1 className="title">
        {children}
      </h1>
    );
  }

}

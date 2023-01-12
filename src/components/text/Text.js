import React from 'react';
import './text.scss';
import {string, bool} from 'prop-types';
import {className} from "../../utils/class-helper";

export const TextSize = {
  S_12: 'text__s-12',
  S_14: 'text__s-14',
  S_16: 'text__s-16',
  S_20: 'text__s-20'
};

export const TextColor = {
  DARK_GRAY: 'text__dark-gray',
  GRAY: 'text__gray',
  RED: 'text__red',
  BLACK: 'text__black',
  ABSOLUTE_BLACK: 'text__absolute-black'
};

export const TextAlign = {
  CENTER: 'text__textAlignCenter'
};

export const TextFont = {
  SUPERMOLOT: 'text__supermolot',
  UBUNTU: 'text__ubuntu'
};

export class Text extends React.Component {

  static propTypes = {
    size: string,
    color: string,
    className: string,
    font: string,
    textAlign: string,
    uppercase: bool
  };

  static defaultProps = {
    font: TextFont.SUPERMOLOT
  };

  render() {
    const {children, size, color, font, uppercase, light, textAlign} = this.props;
    return (
      <div className={`${className([
          textAlign ? textAlign : '',
          font ? font : '',
          color ? color : '',
          size ? size : '',
          uppercase ? 'text__uppercase' : '',
          light ? 'text__light' : ''
      ], true)} ${this.props.className}`}>
        {children}
      </div>
    );
  }

}

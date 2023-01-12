import React from 'react';
import DTPLogo from 'svg/dtp.svg';
import './title-block.scss';
import {Title} from '../title/Title';
import {Text, TextColor, TextSize} from '../text/Text';

export class TitleBlock extends React.Component {

  render() {
    return (
      <div className="title-block">
        <DTPLogo className="title-block__logo"/>
        <div className="title-block__text">
          <Title>Узнай вероятность ДТП* для своего Грузовика</Title>
          <Text size={TextSize.S_12}
                color={TextColor.BLACK}
                className="title-block__op-80">
            * включая ситуации, когда виновником ДТП является третья сторона
          </Text>
        </div>
      </div>
    );
  }

}

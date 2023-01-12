import React from 'react';

export const IconName = {
    BURGER: 'burger',
    LOGO: 'logo',
    LOGO_TEXT: 'logo-text',
    SCORE: 'score',
    SHIELD: 'shield',
    TRUCK: 'truck',
    UMBRELLA: 'umbrella',
    PACK: 'pack',
    CUP: 'cup',
    FAQ: 'faq',
    RIGHT_ARROW: 'right-arrow',
    EMPTY_USER: 'empty-user',
    HISTORY: 'history',
    CLOSE: 'close',
    USER: 'user',
    GREEN_TRIANGLE: 'green-triangle',
    USER_BLACK: 'user-black',
    ENTER: 'enter',
    EXIT: 'exit',
    CHEVRON_DOWN: 'chevron-down',
    PLUS: 'plus',
    SIMPLE_PLUS: 'simple-plus',
    SIMPLE_MINUS: 'simple-minus',
    CIRKLE_PLUS: 'cirkle-plus',
    CIRKLE_TIME: 'cirkle-time',
    CHECK_WITH_CIRCLE: 'check-with-circle',    
}

export const IconSprite = ({
  className,
  name,
  ...clearProps
}) => {
  return (
    <svg
      className={ className }
      {...clearProps}
    >
      <use xlinkHref={`#sprite_svg__${ name }`} />
    </svg>
  );
};


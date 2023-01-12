import React, {useRef, useState} from 'react';
import './help-bubble.scss';
import {className} from '../../utils/class-helper';
import LookSvg from '../contract-data-field/look.svg';
import {useOnClickOutside} from '../../hooks/useOnClickOutside';
import TriangleSvg from '../../svg/triangle.svg'
import {Typography, TypographyType} from '../typography/Typography';

export const HelpBubble = ({text}) => {

    const [helpShown, setHelpShown] = useState(false);

    const ref = useRef();
    useOnClickOutside(ref, () => {
        helpShown && setHelpShown(false)
    });

    const handleLookSvgClick = () => {
        setHelpShown(!helpShown);
    }

    return (
        <div>
            <LookSvg {...className(['help-bubble__icon'])}
                     onClick={handleLookSvgClick}/>
            <div ref={ref} {...className(['help-bubble__bubble', helpShown ? 'help-bubble__bubble--shown' : ''])}>
                <TriangleSvg {...className(['help-bubble__triangle'])} />
                <div {...className(['help-bubble__text'])}>
                    <Typography type={TypographyType.CAPTION}>
                        {text}
                    </Typography>
                </div>
            </div>
        </div>
    )
}
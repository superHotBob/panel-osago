import React from 'react';
import './uploaded-document.scss';
import {BemHelper} from "../../../../../../utils/class-helper";
import NoSvg from "../../../../../contract-data-field/no.svg";
import OkSvg from "../../../../../contract-data-field/ok.svg";
import {Typography, TypographyColor, TypographyType} from "../../../../../typography/Typography";

const classes = new BemHelper({name: 'uploaded-document'});

export const UploadedDocument = ({title, text, error}) => {
    return (
        <div {...classes(null)}>
            <div {...classes('title-row')}>
                <div>
                    <Typography type={TypographyType.CAPTION}
                                color={error ? TypographyColor.RED : TypographyColor.MUST_800}>
                        {title}
                    </Typography>
                </div>
                {error ? <div ><NoSvg/></div> : <div {...classes('icon-ok')}><OkSvg/></div>}
            </div>
            <div>
                <Typography type={TypographyType.BODY}
                            color={error ? TypographyColor.RED : TypographyColor.MUST_900}>
                    {text}
                </Typography>
            </div>
        </div>
    );
}

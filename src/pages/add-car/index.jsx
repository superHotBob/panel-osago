import React from "react";
import { AccidentPage } from "../accident-prediction/accident/AccidentPage";
import { SubHeader } from "../../components/sub-header/sub-header";
import { Sprite } from '../../components/sprite/Sprite';
import withWidgetAuth from "../../hoc/withWidgetAuth";

export const AddCar = (props) => {
    return <>
        <SubHeader />
        <AccidentPage />
        <Sprite />
    </>
};

export const AddCarPage = withWidgetAuth(AddCar);

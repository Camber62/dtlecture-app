import React from 'react';
import {ControlItem} from "@components/core/controls/ControlItem";
import {useAppSelector} from "@hooks/useAppSelector";

export const ControlBar = () => {

    const {controllers} = useAppSelector(state => state.app)

    return (
        <div className="control-bar">
            {
                controllers.map((item, index) => (<ControlItem {...item} key={index}/>))
            }
        </div>
    )
};
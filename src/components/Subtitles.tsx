import React, {useMemo} from 'react';
import {useAppDispatch} from "@hooks/useAppDispatch";
import {useAppSelector} from "@hooks/useAppSelector";
import {appSliceActions} from "@features/appSlice";
import {AppSliceStateControllersItem} from "../types/features";

import {CloseIcon} from "@components/icons/CloseIcon"

interface SubtitlesProps {
    text: string;
}

const Subtitles: React.FC<SubtitlesProps> = ({text}) => {
    const dispatch = useAppDispatch();
    const {controllers} = useAppSelector(state => state.app);

    const isShow = useMemo(() => {
        const find = controllers.find((item: AppSliceStateControllersItem) => item.id === "subtitles")
        return find.active || false
    }, [controllers])

    return (
        isShow && (
            <div
                className={`position-absolute w-50 p-2 mt-3 d-flex justify-content-between rounded-4`}
                style={{
                    backgroundColor: "rgba(245,246,247,0.1)",
                    borderRadius: "10px",
                    transform: "",
                    minHeight: "100px",
                    right: 0
                }}
            >
                <div>
                    <p>{text}</p>
                </div>
                <div
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => dispatch(appSliceActions.setActiveControl({id: "subtitles", value: false}))}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "start",
                        backgroundColor: "rgba(12,15,18,0.8)",
                        borderRadius: "10px",
                        height: 'auto',
                        padding: "7px"
                    }}>
                        <CloseIcon/>
                    </div>
                </div>
            </div>
        )
    );
}

export default Subtitles;

import React, {useCallback, useEffect} from 'react';
import {SceneIcon} from "@components/icons/SceneIcon";
import {AppSliceStateControllersItem} from "../../../types/features";
import classNames from "classnames";
import {PauseIcon} from "@components/icons/PauseIcon";
import {TopicsIcon} from "@components/icons/TopicsIcon";
import {ChatIcon} from "@components/icons/ChatIcon";
import {SubtitlesIcon} from "@components/icons/SubtitlesIcon";
import {toast} from "react-toastify";
import {PlayIcon} from "@components/icons/PlayIcon";
import {appSliceActions} from "@features/appSlice";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {RestartLectureIcon} from "@components/icons/RestartLectureIcon";
import {useAppSelector} from "@hooks/useAppSelector";
import {SettingIcon} from "@components/icons/SettingIcon";
import {useTranslation} from "react-i18next";
import {RaiseHandIcon} from "@components/RaiseHand";

export const ControlItem = (props: AppSliceStateControllersItem) => {

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const {
        lectureIsPause,
        needAnswer
    } = useAppSelector(state => state.app);

    useEffect(() => {
        dispatch(appSliceActions.setDisabledControls({id: "pause", value: needAnswer}));
    }, [dispatch, needAnswer])

    const getIcon = useCallback(() => {
        switch (props.id) {
            case "scene":
                return <SceneIcon active={props.active}/>
            case "chat":
                return <ChatIcon active={props.active}/>
            case "settings":
                return <SettingIcon active={props.active}/>
            case "play":
                if (lectureIsPause) {
                    return <PlayIcon active={props.active} color="#74D414" background="#74D414"/>
                }
                return <PlayIcon active={props.active}/>
            case "pause":
                return <PauseIcon active={props.active}/>
            case "stop":
                if (lectureIsPause) {
                    return <RestartLectureIcon active={props.active} color="#74D414" background="#74D414"/>
                }
                return <RestartLectureIcon active={props.active} color="#74D414"/>
            case "subtitles":
                return <SubtitlesIcon active={props.active}/>
            case "topics":
                return <TopicsIcon active={props.active}/>
            case "raiseHand":
                return <RaiseHandIcon active={props.active}/>
        }
    }, [lectureIsPause, props.active, props.id])

    const handleClick = useCallback(() => {
        if (props.disabled) {
            toast.warning(t("control_unavailable"))
            return
        }

        switch (props.id) {
            case "play":
                dispatch(appSliceActions.playLecture());
                dispatch(appSliceActions.setEnabledAllControls());

                dispatch(appSliceActions.setActiveControl({id: "scene", value: true}));
                dispatch(appSliceActions.setActiveControl({id: "chat", value: true}))
                dispatch(appSliceActions.setShowControls({id: "play", value: false}));

                dispatch(appSliceActions.setActiveControl({id: "pause", value: false}));
                dispatch(appSliceActions.setShowControls({id: "pause", value: true}));
                dispatch(appSliceActions.setShowControls({id: "stop", value: false}));
                break;
            case "pause":
                dispatch(appSliceActions.pauseLecture());
                dispatch(appSliceActions.setShowControls({id: "pause", value: false}));
                dispatch(appSliceActions.setShowControls({id: "play", value: true}));
                dispatch(appSliceActions.setShowControls({id: "stop", value: true}));
                break;
            case "stop":
                dispatch(appSliceActions.stopLecture());
                dispatch(appSliceActions.setShowControls({id: "play", value: true}));
                dispatch(appSliceActions.setShowControls({id: "pause", value: false}));
                dispatch(appSliceActions.setShowControls({id: "stop", value: false}));
                break;

            case "subtitles":
            case "scene":
            case "chat":
            case "topics":
            case "settings":
                dispatch(appSliceActions.setActiveControl({id: props.id, value: !props.active}));
                break;
            case "raiseHand":
                dispatch(appSliceActions.setActiveControl({id: "raiseHand", value: true}));
                setTimeout(() => {
                    dispatch(appSliceActions.setActiveControl({id: "raiseHand", value: false}));
                }, 5000);

        }

    }, [dispatch, props])

    return (
        <>
            {
                props.show && (
                    <div style={{
                        position: "relative",
                    }}>
                        <div
                            className={classNames(
                                "control-item",
                                {
                                    "disabled": props.disabled,
                                    "active": props.active
                                }
                            )}
                            onClick={handleClick}
                        >
                            {getIcon()}
                            {
                                props.help && (
                                    <div className="help" style={{
                                        position: "absolute",
                                        right: "-180%",
                                        top: "50%",
                                         zIndex: 1025,
                                        transform: "translate(0, -50%)",
                                        background: "#F5F6F7CC",
                                        color: "#4F5257",
                                        padding: "2px 8px",
                                        borderRadius: "10px",
                                    }}>
                                        {t(props.help)}
                                    </div>
                                )
                            }
                        </div>

                    </div>
                )
            }
        </>
    )
};

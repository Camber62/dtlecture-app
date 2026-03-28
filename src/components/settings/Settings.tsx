import React, {useCallback} from "react"
import {appSliceActions} from "@features/appSlice";
import {CloseIcon} from "@components/icons/CloseIcon";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {useAppSelector} from "@hooks/useAppSelector";
import {playerSliceActions} from "@features/playerSlice";
import {useTranslation} from "react-i18next";

const speedList: number[] = [
    0.8,
    1,
    1.2,
    1.5,
    1.8,
    2,
];

export const Settings = () => {

    const dispatch = useAppDispatch();

    const {answerMode} = useAppSelector(state => state.app)
    const {speed} = useAppSelector(state => state.player);
    const { t } = useTranslation();

    const handleChangeAnswerMode = useCallback((mode: "voice" | "text") => {
        dispatch(appSliceActions.setAnswerMode(mode));
    }, [dispatch])

    return (
        <div className={'settings-container'}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: '.5rem 1rem'
                }}
            >
                <div>
                    {t("settings")}
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "start",
                    backgroundColor: "rgba(12,15,18,0.8)",
                    borderRadius: "50%",
                    height: 'auto',
                    padding: "8px",
                    cursor: "pointer"
                }}
                     onClick={() => {
                         dispatch(appSliceActions.setActiveControl({id: "settings", value: false}))
                     }}
                >
                    <CloseIcon/>
                </div>
            </div>
            <div className={'settings-type'}>
                <div style={{paddingTop: "6px"}}>
                    {t("interaction_type")}
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div>
                        <input
                            style={{marginLeft: 0}}
                            type="radio"
                            id="radio-check-voice"
                            checked={answerMode === "voice"}
                            onChange={() => handleChangeAnswerMode("voice")}
                        />
                        <label
                            htmlFor="radio-check-voice"
                            className={answerMode === "voice" ? "settings-text-active" : "settings-text"}

                            // style={{
                            //     color: answerMode === "voice" ? "#fff" : "#4F5257",
                            // }}
                        >
                            {t("microphone")}
                        </label>
                    </div>
                    <div>
                        <input
                            style={{marginLeft: 0}}
                            type="radio"
                            id="radio-check-text"
                            checked={answerMode === "text"}
                            onChange={() => handleChangeAnswerMode("text")}
                        />
                        <label
                            htmlFor="radio-check-text"
                            className={answerMode === "text" ? "settings-text-active" : "settings-text"}

                            // style={{
                            //     color: answerMode === "text" ? "#fff" : "#4F5257",
                            // }}
                        >
                            {t("manual_input")}
                        </label>
                    </div>
                </div>
            </div>
            <div className={'settings-type'}>
                <div style={{paddingTop: "6px"}}>
                    {t("pronunciation_speed")}
                </div>
                <div style={{
                    display: "flex",
                    gap: '.4rem'
                }}>
                    {
                        speedList.map((item, index) => (
                            <div
                                className={speed === item ? 'settings-speed-active' : 'settings-speed'}
                                style={{
                                    padding: "2px",
                                    borderRadius: "5px",
                                    width: "35px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                }}
                                key={index}
                                onClick={() => dispatch(playerSliceActions.setSpeed(item))}
                            >
                                {item}x
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

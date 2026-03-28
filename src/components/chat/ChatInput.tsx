import React, {useCallback, useEffect, useState} from "react"
import {useAppSelector} from "@hooks/useAppSelector";
import {toast} from "react-toastify";
import {appSliceActions, appSliceSelectors} from "@features/appSlice";
import {chatSliceActions} from "@features/chatSlice";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {SendIcon} from "@components/icons/SendIcon";
import {MicrophoneIcon} from "@components/icons/MicrophoneIcon";
import { useTranslation } from "react-i18next";

export const ChatInput = () => {

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const {needAnswer} = useAppSelector(state => state.app)
    const {isRecording, isRecognize} = useAppSelector(state => state.microphone);

    const answerMode = appSliceSelectors.getAnswerMode(useAppSelector(state => state.app))

    const [inputValue, setInputValue] = useState<string>("");
    const [hintText, setHintText] = useState<string>(t('chat_input.hint_text'));
    const [isColor, setIsColor] = useState<boolean>(false);

    const userAnswer = useCallback(() => {
        if (!inputValue) {
            toast.warning(t('chat_input.hint_warning'));
            return
        }
        dispatch(appSliceActions.setAnswerMessage(inputValue))
        dispatch(appSliceActions.setAnswerStatus("succeeded"))
        dispatch(chatSliceActions.addMessage({text: inputValue, system: false}))
        setInputValue("")

    }, [dispatch, inputValue, t])

    useEffect(() => {
        if (isRecording) {
            setIsColor(true)
            setHintText(t('chat_input.hint_text_2'));
        } else if (isRecognize) {
            setIsColor(true)
            setHintText(t('chat_input.hint_text_3'));
        } else if (!isRecording && !isRecognize) {
            setIsColor(false)
            setHintText(t('chat_input.hint_text'));
        }
    }, [isRecording, isRecognize, t]);

    return (
        <div style={{padding: "0 14px 14px 10px"}}>
            {
                answerMode === "text" && (
                    <div style={{
                        position: "relative"
                    }}>
                        <input
                            disabled={!needAnswer}
                            placeholder={t('chat_input.start_input')}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyUp={e => {
                                if (e.key === "Enter") {
                                    userAnswer()
                                }
                            }}
                            type="text"
                            className={'chat-input'}
                        />
                        <div style={{
                            position: "absolute",
                            right: "5%",
                            top: "50%",
                            transform: "translate(0, -60%)"
                        }}
                             onClick={() => userAnswer()}
                        >
                            <SendIcon/>
                        </div>
                    </div>
                )
            }

            {
                answerMode === "voice" && needAnswer && (
                    <div
                        style={{
                            backgroundColor: "#12151C",
                            minHeight: "40px",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0 1rem"
                        }}
                    >
                        <div style={{
                            color: isColor ? "#74D414" : "#9DA3AE"
                        }}>
                            {hintText}
                        </div>
                        <div style={{width: "12px"}}>
                            <MicrophoneIcon color={isColor ? "#74D414" : "#9DA3AE"}/>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

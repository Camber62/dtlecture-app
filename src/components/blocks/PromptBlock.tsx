import React, {useEffect, useState} from 'react'
import {useAppSelector} from "@hooks/useAppSelector";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {blockSliceActions} from "@features/blockSlice";
import {PromptBlockProps} from "../../types/block";
import {chatSliceActions} from "@features/chatSlice";
import {toast} from "react-toastify";
import { useTranslation } from 'react-i18next';

export const PromptBlock = (props: PromptBlockProps) => {

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const {currentBlock, isEnd, promptVariables} = useAppSelector(state => state.block);

    const [audioText, setAudioText] = useState<string>("")
    const [chatText, setChatText] = useState<string>("")

    useEffect(() => {
        dispatch(chatSliceActions.addMessageLoader(t('blocks.prompt.text_analysis_message')));
        dispatch(chatSliceActions.changeLoader(true))
        return () => {
            dispatch(chatSliceActions.addMessageLoader(''));
            dispatch(chatSliceActions.changeLoader(false))
        }
    }, [dispatch]);

    useEffect(() => {
        props.setAudioTextCB(audioText)
    }, [audioText, props])

    useEffect(() => {
        props.setChatTextCB(chatText)
    }, [chatText, props])

    useEffect(() => {
        const prompt = promptVariables[currentBlock.content.params.promptAnalyze.key];
        if (!prompt || !prompt.status) {
            toast.error(t('blocks.prompt.prompt_error_text'))
            dispatch(blockSliceActions.next(null))
            return;
        }
        if (prompt.status === "idle") {
            toast.warning(t('blocks.prompt.prompt_idle_text'))
        }
        if (prompt.status === "pending") {
            dispatch(chatSliceActions.addMessageLoader(t('blocks.prompt.prompt_pending_text1')));
            dispatch(chatSliceActions.changeLoader(true))
            toast.warning(t('blocks.prompt.prompt_pending_text2'))
        }
        if (prompt.status === "succeeded") {
            toast.warning(t('blocks.prompt.prompt_succeeded_text'))
            setAudioText(prompt.value)
            setChatText(prompt.value)
            dispatch(chatSliceActions.changeLoader(false))
            dispatch(chatSliceActions.addMessageLoader(''));
        }
        if (prompt.status === "failed") {
            dispatch(chatSliceActions.addMessageLoader(''));
            dispatch(chatSliceActions.changeLoader(false))
            toast.warning(t('blocks.prompt.prompt_failed_text'))
            setAudioText(prompt.value)
            setChatText(prompt.value)
        }
    }, [currentBlock.content.params.promptAnalyze.key, dispatch, promptVariables])

    useEffect(() => {
        if (isEnd) {
            dispatch(chatSliceActions.addMessageLoader(''));
            dispatch(blockSliceActions.next(null))
        }
    }, [currentBlock.content.params.promptAnalyze.key, dispatch, isEnd, promptVariables]);


    return <></>

}
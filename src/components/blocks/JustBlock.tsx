import React, {useEffect} from 'react'
import {useAppSelector} from "@hooks/useAppSelector";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {blockSliceActions} from "@features/blockSlice";
import {ReplacingVariables} from "@tools/ReplacingVariables";
import type {JustBlockProps} from "../../types/block";
import {chatSliceActions} from "@features/chatSlice";
import { useTranslation } from 'react-i18next';

export const JustBlock = (props: JustBlockProps) => {

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const {currentBlock, answerVariables, isEnd} = useAppSelector(state => state.block);

    useEffect(() => {
        dispatch(chatSliceActions.addMessageLoader(t('blocks.just.informationProcessingText')));
        dispatch(chatSliceActions.changeLoader(true))
        return () => {
            dispatch(chatSliceActions.addMessageLoader(''));
            dispatch(chatSliceActions.changeLoader(false))
        }
    }, [dispatch]);

    useEffect(() => {
        if (props.setAudioTextCB) {
            props.setAudioTextCB(ReplacingVariables(currentBlock.content.audio ? currentBlock.content.audio : currentBlock.content.text, answerVariables));
        }
        if (props.setChatTextCB) {
            props.setChatTextCB(ReplacingVariables(currentBlock.content.text, answerVariables).replaceAll("\n", "\n\r"));
        }
    }, [answerVariables, currentBlock.content.audio, currentBlock.content.text, props]);

    useEffect(() => {
        if (isEnd) {
            dispatch(blockSliceActions.next(null))
        }
    }, [dispatch, isEnd]);


    return <></>

}

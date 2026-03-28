import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useAppSelector} from "@hooks/useAppSelector";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {blockSliceActions, FetchDynamicQuestionAnswer, FetchPromptAnswer} from "@features/blockSlice";
import {ReplacingVariables} from "@tools/ReplacingVariables";
import {QuestionBlockProps} from "../../types/block";
import {chatSliceActions} from "@features/chatSlice";
import {API} from "../../api";
import {toast} from "react-toastify";
import {appSliceActions} from "@features/appSlice";
import { useTranslation } from 'react-i18next';

export const QuestionBlock = (props: QuestionBlockProps) => {

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const {answerMessage, lectureJWT, attemptId} = useAppSelector(state => state.app)
    const {currentBlock, answerVariables, isEnd} = useAppSelector(state => state.block)

    const loadingQuestion = useRef<boolean>(false)
    const refAnswer = useRef<string>("")

    const [localQuestion, setLocalQuestion] = useState<string>("")
    const [localQuestionId, setLocalQuestionId] = useState<string | null>(null)
    const [localTestId, setLocalTestId] = useState<string | null>(null)

    const [analyzeAnswerComplete, setAnalyzeAnalyzeComplete] = useState<boolean>(false)

    const answerAnalyzeCallback = useCallback(() => {
        if (currentBlock.content.params.answerAnalyze.endpoint) {
            API.FetchAnalyzeAnswer(lectureJWT, currentBlock.content.params.answerAnalyze.endpoint, refAnswer.current)
                .then(data => {
                    refAnswer.current = data.data.response
                    setAnalyzeAnalyzeComplete(true)
                })
                .catch(err => {
                    toast.error(err.message)
                    console.error("FetchAnalyzeAnswer", err)
                })
        }

    }, [currentBlock.content, lectureJWT])

    const promptAnalyzeCallback = useCallback(() => {
        dispatch(FetchPromptAnswer({
            endpoint: currentBlock.content.params.promptAnalyze.endpoint,
            question: ReplacingVariables(localQuestion, answerVariables),
            answer: refAnswer.current,
            questionId: localQuestionId,
            key: currentBlock.content.params.promptAnalyze.key
        }))
    }, [answerVariables, currentBlock.content.params.promptAnalyze.endpoint, currentBlock.content.params.promptAnalyze.key, dispatch, localQuestion, localQuestionId])

    const questionDynamicCompetence = useCallback(() => {
        dispatch(FetchDynamicQuestionAnswer({
            endpoint: currentBlock.content.params.questionDynamic.competenceEndpoint,
            question: ReplacingVariables(localQuestion, answerVariables),
            answer: refAnswer.current,
            questionId: localQuestionId,
            testId: localTestId
        }))
    }, [answerVariables, currentBlock.content.params, dispatch, localQuestion, localQuestionId, localTestId])

    const fetchQuestion = useCallback(async (endpoint: string) => {
        const response = await API.FetchBlockQuestionDynamic(lectureJWT, endpoint + (Math.floor(Math.random() * 1000000) + currentBlock.id) + "/")

        if (response.status !== 200) {
            toast.warning(response.statusText);
        }

        return response.data
    }, [currentBlock.id, lectureJWT])

    const saveUserAnswer = useCallback(() => {        
        API.SaveUserAnswer({
            question: localQuestion ?? currentBlock.content.text,
            endpoint: currentBlock.content.params?.saveAnswer?.analyze?.endpoint ?? "",
            attempt_id: attemptId,
            raw_answer: refAnswer.current.toString(),
            instructions: currentBlock.content.params?.saveAnswer?.analyze?.instructions ?? "",
            local_storage_key: currentBlock.content.params?.saveAnswer?.localStorageKey ?? null,
            global_storage_key: currentBlock.content.params?.saveAnswer?.globalStorageKey ?? null,
        })
            .then(data => {
                if (data.error) {
                    toast.error(t('blocks.question.save_question_error'))
                    return
                }


                if (currentBlock.content.params?.saveAnswer?.localStorageKey) {
                    dispatch(blockSliceActions.setAnswerVariables({
                        key: `##${currentBlock.content.params?.saveAnswer?.localStorageKey}##`,
                        value: data.data
                    }))
                }
                if (currentBlock.content.params?.saveAnswer?.globalStorageKey) {
                    dispatch(blockSliceActions.setAnswerVariables({
                        key: `##${currentBlock.content.params?.saveAnswer?.globalStorageKey}##`,
                        value: data.data
                    }))
                }

            })
            .catch(error => {
                console.error("API.SaveUserAnswer", error)
            })
    }, [
        localQuestion,
        attemptId,
        currentBlock.content.params?.saveAnswer?.analyze?.endpoint,
        currentBlock.content.params?.saveAnswer?.analyze?.instructions,
        currentBlock.content.params?.saveAnswer?.globalStorageKey,
        currentBlock.content.params?.saveAnswer?.localStorageKey,
        currentBlock.content.text,
        dispatch
    ])

    useEffect(() => {
        dispatch(chatSliceActions.addMessageLoader(t('blocks.question.upload_question_text')));
        dispatch(chatSliceActions.changeLoader(true))
        return () => {
            dispatch(chatSliceActions.addMessageLoader(''));
            dispatch(chatSliceActions.changeLoader(false))
        }
    }, [dispatch]);


    useEffect(() => {
        if (!currentBlock.content.params.questionDynamic) {
            const audioText = ReplacingVariables(currentBlock.content.audio ? currentBlock.content.audio : currentBlock.content.text, answerVariables);
            const messageText = ReplacingVariables(currentBlock.content.text, answerVariables);
            props.setAudioTextCB(audioText);
            props.setChatTextCB(messageText)
            setLocalQuestion(messageText)
            return;
        }

        if (!loadingQuestion.current) {
            loadingQuestion.current = true
            fetchQuestion(currentBlock.content.params.questionDynamic.endpoint)
                .then(response => {
                    const questions = response.questions as Array<{ id: string, text: string }>;
                    if (!questions.length) {
                        toast.warning(t('blocks.question.no_form_question'));
                        dispatch(blockSliceActions.next(null))
                        dispatch(chatSliceActions.addMessageLoader(''));
                        dispatch(chatSliceActions.changeLoader(false))
                        return
                    }
                    const question = questions[0];
                    props.setAudioTextCB(question.text)
                    props.setChatTextCB(question.text)
                    setLocalQuestion(question.text)
                    setLocalQuestionId(question.id)
                    setLocalTestId(response.id)
                })
                .catch(() => {
                    toast.error(t('blocks.question.form_question_error'))
                    dispatch(blockSliceActions.next(null))
                    dispatch(chatSliceActions.addMessageLoader(''));
                    dispatch(chatSliceActions.changeLoader(false))
                })
        }

    }, [
        answerVariables,
        currentBlock.content.audio,
        currentBlock.content.params.questionDynamic,
        currentBlock.content.text,
        dispatch,
        fetchQuestion,
        props
    ]);

    useEffect(() => {
        if (isEnd) {
            dispatch(appSliceActions.setNeedAnswer(true))
        }
    }, [dispatch, isEnd]);

    useEffect(() => {
        if (answerMessage) {
            refAnswer.current = answerMessage;
            if (currentBlock.content.params.answerAnalyze && currentBlock.content.params.answerAnalyze.endpoint) {
                answerAnalyzeCallback()
            } else {
                setAnalyzeAnalyzeComplete(true)
            }
        }
    }, [answerAnalyzeCallback, answerMessage, currentBlock.content.params.answerAnalyze]);

    useEffect(() => {
        if (analyzeAnswerComplete) {
            if (currentBlock.content.params.answerAnalyze && currentBlock.content.params.answerAnalyze.key) {
                const payload = {
                    key: currentBlock.content.params.answerAnalyze.key,
                    value: refAnswer.current
                };
                dispatch(blockSliceActions.setAnswerVariables(payload))
            }

            if (currentBlock.content.params.promptAnalyze) {
                promptAnalyzeCallback()
            }

            if (currentBlock.content.params.questionDynamic && currentBlock.content.params.questionDynamic.competenceEndpoint) {
                questionDynamicCompetence()
            }
            saveUserAnswer()
            dispatch(appSliceActions.setNeedAnswer(false))
            dispatch(blockSliceActions.next(null))
            setAnalyzeAnalyzeComplete(false)

        }
    }, [analyzeAnswerComplete, currentBlock.content.params.answerAnalyze, currentBlock.content.params.promptAnalyze, currentBlock.content.params.questionDynamic, dispatch, promptAnalyzeCallback, questionDynamicCompetence, saveUserAnswer])


    return <></>

}

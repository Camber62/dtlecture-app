import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BlockSliceState} from "../types/features";
import {AllBlocksItem} from "../types/block";
import {toast} from "react-toastify";
import {API} from "../api";
import {AxiosError} from "axios";
import {RootState} from "../store";

const initialState: BlockSliceState = {
    blocksStatus: 'idle',
    blocks: [],
    currentBlock: null,
    currentBlockId: null,
    currentBlockIndex: null,
    isEnd: false,
    answerVariables: {},
    promptVariables: {},
    videoEnded: false,
    audioEnded: false
}

export const FetchPromptAnswer = createAsyncThunk(
    "BlockSliceFetchPromptAnswer",
    async ({endpoint, question, answer, questionId, key}: {
        endpoint: string,
        question: string,
        answer: string,
        questionId: string | null,
        key: string
    }, {rejectWithValue, fulfillWithValue, getState}) => {

        const {app} = getState() as RootState;

        try {
            const response = await API.FetchBlockPrompt(app.lectureJWT, endpoint, question, answer, questionId);
            if (response.status !== 201 && response.status !== 200) {
                return rejectWithValue({})
            }
            return fulfillWithValue({
                key: key,
                data: response.data.feedback
            });
        } catch (e) {
            return rejectWithValue({})
        }
    }
)

export const FetchDynamicQuestionAnswer = createAsyncThunk(
    "BlockSliceFetchDynamicQuestionAnswer",
    async ({endpoint, question, answer, questionId, testId}: {
        endpoint: string,
        question: string,
        answer: string,
        questionId: string | null,
        testId: string | null
    }, {rejectWithValue, fulfillWithValue, getState}) => {
        try {

            const {app} = getState() as RootState;

            const response = await API.FetchDynamicQuestionAnswer(app.lectureJWT, endpoint, question, answer, questionId, testId)
            if (response.status !== 200) {
                return rejectWithValue(response.data?.detail?.message?.ru)
            }

            return fulfillWithValue(response.data.data);
        } catch (e) {
            console.error("Ошибка при обращение к сервису - FetchDynamicQuestionAnswer", e)
            if (e instanceof AxiosError) {
                return rejectWithValue(e.response.data?.detail?.message?.ru || "Ошибка при обращение к сервису")
            }
            return rejectWithValue("Ошибка при обращение к сервису")
        }
    }
)

export const blockSlice = createSlice({
    name: "block",
    initialState,
    reducers: {
        set: (state, action: PayloadAction<AllBlocksItem[]>) => {
            state.blocks = action.payload;
            state.blocksStatus = "succeeded";
            state.audioEnded = false;
            state.videoEnded = false;
        },
        next: (state, action: PayloadAction<string | null>) => {

            state.isEnd = false;
            state.audioEnded = false;
            state.videoEnded = false;
            if (state.blocksStatus !== "succeeded" || !state.blocks.length) {
                toast.error("Не усатовлены парамтеры для конфигурации")
                return
            }

            if (action.payload) {

                const block = state.blocks.find(block => parseInt(block.id) === parseInt(action.payload))
                const blockIndex = state.blocks.findIndex(block => parseInt(block.id) === parseInt(action.payload))

                if (block) {
                    state.currentBlock = block;
                    state.currentBlockId = block.id;
                    state.currentBlockIndex = blockIndex;
                } else {
                    toast.error("Не найден блок по идентификатору")
                }
            } else {
                if (state.currentBlockId) {
                    const blockIndex = state.blocks.findIndex(block => block.id === state.currentBlockId)
                    console.log('blockIndex', blockIndex);
                    if (state.blocks.length >= blockIndex + 1) {
                        state.currentBlock = state.blocks[blockIndex + 1];
                        state.currentBlockId = state.blocks[blockIndex + 1].id;
                        state.currentBlockIndex = blockIndex + 1;

                    } else {
                        toast.error("Лекция окончена")
                        state.isEnd = true;
                    }
                } else {
                    state.currentBlock = state.blocks[0];
                    state.currentBlockId = state.blocks[0].id;
                    state.currentBlockIndex = 0;
                }
            }
        },
        prev: (state, action: PayloadAction<string | null>) => {
            state.isEnd = false;
            state.audioEnded = false;
            state.videoEnded = false;
                      const blockIndex = state.blocks.findIndex(
                        (block) => block.id === state.currentBlockId
                      );
                      if (state.blocks.length >= blockIndex - 1) {
                        state.currentBlock = state.blocks[blockIndex - 1];
                        state.currentBlockId = state.blocks[blockIndex - 1].id;
                        state.currentBlockIndex = blockIndex - 1;
                      }
        },
        reset: state => {
            state.currentBlock = null
            state.currentBlockId = null
            state.currentBlockIndex = null
            state.isEnd = false
            state.audioEnded = false
            state.videoEnded = false
        },
        setAnswerVariables: (state, action: PayloadAction<{ key: string, value: string }>) => {
            state.answerVariables[action.payload.key] = action.payload.value;
        },
        setIsEnd: (state, action: PayloadAction<boolean>) => {
            state.isEnd = action.payload;
        },
        setVideoEnded: (state, action: PayloadAction<boolean>) => {
            state.videoEnded = action.payload; 
        },
        setAudioEnded: (state, action: PayloadAction<boolean>) => {
            state.audioEnded = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(FetchPromptAnswer.pending, (state, {meta}) => {
                state.promptVariables[meta.arg.key] = {
                    status: "pending",
                    value: ""
                }
            })
            .addCase(FetchPromptAnswer.fulfilled, (state, action) => {
                state.promptVariables[action.payload.key] = {
                    status: "succeeded",
                    value: action.payload.data
                };
            })
            .addCase(FetchPromptAnswer.rejected, (state, {meta}) => {
                state.promptVariables[meta.arg.key] = {
                    status: "failed",
                    value: "Ошибка при получение данных"
                };
            })
            .addCase(FetchDynamicQuestionAnswer.pending, (_) => {
            })
            .addCase(FetchDynamicQuestionAnswer.fulfilled, (_, {payload}) => {
            })
            .addCase(FetchDynamicQuestionAnswer.rejected, (_, {payload}) => {
                toast.error(payload as string)
            })
    }
})

export const blockSliceActions = blockSlice.actions

export default blockSlice.reducer;

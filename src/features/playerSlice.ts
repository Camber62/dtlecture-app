import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {API} from "../api";
import {toast} from "react-toastify";
import {RootState} from "../store";

export const textToSpeech = createAsyncThunk(
    "player/textToSpeech",
    async ({ text }: { text: string }, { rejectWithValue, getState }) => {
        const state = getState() as RootState;
        const { app, player, block } = state;

        const speed = block.currentBlock?.content?.speed ?? player.speed;
        const tone = block.currentBlock?.content?.tone ?? app.config?.voiceSettings?.tone ?? "normal";

        try {
            return await API.textToSpeechAPI(text, speed, tone, app.config?.voiceSettings);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Неизвестная ошибка при преобразовании текста в речь"
            );
        }
    }
);

interface playerInitialState {
    status: "idle" | "pending" | "fulfilled" | "rejected"
    ttsAudioUrl: string | null
    isEndPlaying: boolean
    needCB: boolean
    speed: number
    volume: number
}

const initialState: playerInitialState = {
    status: "idle",
    ttsAudioUrl: null,
    isEndPlaying: false,
    needCB: false,
    speed: 1,
    volume: 100,
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        isEnd: (state, action: PayloadAction<boolean>) => {
            state.isEndPlaying = action.payload;
        },
        setNeedCB: (state, actions: PayloadAction<boolean>) => {
            state.needCB = actions.payload;
        },
        setSpeed: (state, actions: PayloadAction<number>) => {
            state.speed = actions.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(textToSpeech.pending, (state) => {
                state.status = "pending";
            })
            .addCase(textToSpeech.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "fulfilled";
                state.ttsAudioUrl = action.payload;
            })
            .addCase(textToSpeech.rejected, (state, action) => {
                state.status = "rejected";
                toast.error(action.payload as string);
            });
    }
})

export const playerSliceActions = playerSlice.actions

export default playerSlice.reducer

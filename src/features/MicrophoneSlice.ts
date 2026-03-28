import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {toast} from "react-toastify";
import {API} from "../api";
import type { ApiFetchConfigRecognizeSettings } from '../types/api';

interface MicrophoneState {
    isRun: boolean;
    isRecording: boolean;
    isRecognize: boolean;
    blobResult: ArrayBuffer | null;
    recognizeResult: string | null;
    recognizeResultError: boolean;
    status: "listener" | "recognize" | "ready";
    isMicrophoneEnabled: boolean;
}

const initialState: MicrophoneState = {
    isRun: false,
    isRecording: false,
    isRecognize: false,
    blobResult: null,
    recognizeResult: null,
    recognizeResultError: false,
    status: "ready",
    isMicrophoneEnabled: false,
};

export const microphoneRunRecognize = createAsyncThunk(
  'microphone/runRecognize',
  async ({ content, recognizeSettings }: { content: Blob, recognizeSettings: ApiFetchConfigRecognizeSettings }, { rejectWithValue }) => {
    try {
      return await API.microphoneRunRecognizeAPI(content, recognizeSettings);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка при распознавании голоса'
      );
    }
  }
);

const microphoneSlice = createSlice({
    name: 'microphone',
    initialState,
    reducers: {
        changeIsRun: (state, action: PayloadAction<boolean>) => {
            state.isRun = action.payload;
            state.status = "listener";
        },
        changeIsRecording: (state, action: PayloadAction<boolean>) => {
            state.isRecording = action.payload;
        },
        setMicrophoneReady: (state, action: PayloadAction<boolean>) => {
            state.isMicrophoneEnabled = action.payload;
        },
        setResetRecognize: (state) => {
            state.recognizeResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(microphoneRunRecognize.pending, (state) => {
                state.status = "recognize";
                state.isRecognize = true;
            })
            .addCase(microphoneRunRecognize.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "ready";
                state.isRecognize = false;
                state.recognizeResultError = false;
                state.recognizeResult = action.payload;
            })
            .addCase(microphoneRunRecognize.rejected, (state, action) => {
                state.status = "ready";
                state.isRecognize = false;
                state.recognizeResultError = true;
                toast.error(action.payload as string);
            })
    }
});

export const {
    changeIsRun: microphoneChangeIsRun,
    changeIsRecording: microphoneChangeIsRecording,
    setMicrophoneReady: microphoneChangeIsEnabled,
    setResetRecognize: setResetRecognizeAction
} = microphoneSlice.actions;

export default microphoneSlice.reducer;

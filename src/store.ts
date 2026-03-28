import {configureStore} from '@reduxjs/toolkit';
import appReducer from './features/appSlice';
import microphoneSlice from "./features/MicrophoneSlice";
import blockReducer from "@features/blockSlice";
import playerReducer from "@features/playerSlice";
import chatReducer from "@features/chatSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        microphone: microphoneSlice,
        block: blockReducer,
        player: playerReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
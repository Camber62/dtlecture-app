import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: {
    messages: {
        text: string
        system: boolean
    }[],
    loader: boolean
    messageLoader: string
} = {
    messages: [],
    loader: false,
    messageLoader: ''
}

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<{ text: string, system: boolean }>) => {
            state.messages.push(action.payload)
        },
        changeLoader: (state, {payload}: PayloadAction<boolean>) => {
            state.loader = payload
        },
        addMessageLoader: (state, {payload}: PayloadAction<string>) => {
            state.messageLoader = payload
        }
    }
})

export const chatSliceActions = chatSlice.actions

export default chatSlice.reducer;
import React, {useEffect, useRef} from "react"
import {CloseIcon} from "@components/icons/CloseIcon";
import {ChatMessage} from "@components/chat/ChatMessage";
import {useAppSelector} from "@hooks/useAppSelector";
import {ChatLoader} from "@components/chat/ChatLoader";
import {ChatInput} from "@components/chat/ChatInput";
import {appSliceActions} from "@features/appSlice";
import {useAppDispatch} from "@hooks/useAppDispatch";
import { blockSliceActions } from "@features/blockSlice";

export const Chat = () => {

    const dispatch = useAppDispatch();

    const {answerMode} = useAppSelector(state => state.app)
    const {messages, loader} = useAppSelector(state => state.chat)

    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {

                    if (chatRef.current) {
                        const lastChild = chatRef.current.lastElementChild;
                        if (lastChild) {
                            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }
                    }
                }
            });
        });

        if (chatRef.current) {
            observer.observe(chatRef.current, {childList: true, subtree: true});
        }

        return () => observer.disconnect(); // Очистка наблюдателя
    }, []);

    useEffect(() => {
        dispatch(blockSliceActions.setAnswerVariables({
            key: "##chat:history##",
            value: JSON.stringify(messages)
        }))
    }, [dispatch, messages])

    return (
        <div className={'chat'}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    padding: '8px'
                }}
            >
                <div style={{
                    display: "flex",
                    alignItems: "start",
                    backgroundColor: "rgba(12,15,18,0.8)",
                    borderRadius: "10px",
                    height: 'auto',
                    padding: "7px",
                    cursor: "pointer"
                }}
                     onClick={() => {
                         dispatch(appSliceActions.setActiveControl({id: "chat", value: false}))
                     }}
                >
                    <CloseIcon/>
                </div>
            </div>
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "14px",
                maxHeight: "600px",
                height: "100%",
                overflowY: "auto",
                alignItems: "start"
            }}
                 ref={chatRef}>
                {
                    messages.map((item, index) => (
                        <ChatMessage
                            key={index}
                            {...item}
                        />
                    ))
                }

            </div>
            {
                loader && <ChatLoader/>
            }
            {
                answerMode && <ChatInput/>
            }
        </div>
    )
}
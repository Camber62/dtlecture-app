import { RemarkMarkdown } from "@components/core/RemarkMarkdown"
import React from "react"

export const ChatMessage = (props: {text: string, system: boolean}) => {
    return (
        <div style={{
            justifyContent: props.system ? "start" : "end",
            display: "flex",
            width: "100%",
        }}>
            <div
                className={'chat-message'}
                style={{
                borderBottomRightRadius: props.system ? "16px" : "2px",
                borderBottomLeftRadius: props.system ? "2px" : "16px",
                // backgroundColor: props.system ? "#0B0D11" : "#31353D",
            }}
                // dangerouslySetInnerHTML={{ __html: props.text }}
            >
                {
                    RemarkMarkdown({text: props.text})
                }
            </div>
        </div>
    )
}

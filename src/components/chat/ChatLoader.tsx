import React from "react"
import {useAppSelector} from "@hooks/useAppSelector";

export const ChatLoader = () => {
    const {messageLoader} = useAppSelector((state) => state.chat);

    return (
        <div className={'chat-loader'}>
            <div>
                {messageLoader}
            </div>
            <div className="spinner-border" role="status" style={{
                border: ".25em solid #B1FA00",
                borderRightColor: "#fff0"
            }}>
                <span className="sr-only">Loading...</span>
            </div>

        </div>
    )
}
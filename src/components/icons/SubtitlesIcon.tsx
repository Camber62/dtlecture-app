import React, {useCallback} from "react"

export const SubtitlesIcon = ({active}: {active: boolean} = {active: false}) => {

    const getColor = useCallback(() => {
        return active ? "#0C0F12" : "#9DA3AE"
    }, [active])
    
    return (
        <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 8L17 8"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 8L7 8"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 11L12 11"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 11L17 11"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="0.75"
                y="0.75"
                width="20.5"
                height="14.5"
                rx="1.25"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>

    )

}
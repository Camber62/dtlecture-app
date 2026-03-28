import React, {useCallback} from "react"

export const TopicsIcon = ({active}: {active: boolean} = {active: false}) => {

    const getColor = useCallback(() => {
        return active ? "#0C0F12" : "#9DA3AE"
    }, [active])

    return (
        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1 16L11 16"
                stroke={getColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 11L19 11"
                stroke={getColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 6L19 6"
                stroke={getColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 0.999999L19 1"
                stroke={getColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    );
}
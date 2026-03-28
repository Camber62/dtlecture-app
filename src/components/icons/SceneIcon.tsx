import React, {useCallback} from "react"

export const SceneIcon = ({active}: {active: boolean} = {active: false}) => {

    const getColor = useCallback(() => {
        return active ? "#0C0F12" : "#9DA3AE"
    }, [active])
    
    return (
        <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11 13V24L12.0497 23.4752C14.6613 22.1694 17.4893 21.3511 20.3947 21.0605L21 21V10L20.3947 
                10.0605C17.4893 10.3511 14.6613 11.1694 12.0497 12.4752L11 13Z"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M11 13V24L9.95034 23.4752C7.33871 22.1694 4.51071 21.3511 1.6053 21.0605L1 21V10L1.6053 
                10.0605C4.51071 10.3511 7.33871 11.1694 9.95034 12.4752L11 13Z"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle 
                cx="11"
                cy="5"
                r="4.25"
                stroke={getColor()}
                strokeWidth="1.5"
            />
        </svg>
    )

}
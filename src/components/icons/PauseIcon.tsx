import React, {useCallback} from 'react'

export const PauseIcon = ({active}: {active: boolean} = {active: false}) => {

    const getColor = useCallback(() => {
        return active ? "#0C0F12" : "#9DA3AE"
    }, [active])

    return (
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 19V1" stroke={getColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 19V1" stroke={getColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

}
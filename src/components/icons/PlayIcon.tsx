import React, {useCallback, useEffect} from 'react'

export const PlayIcon = (props: {active?: boolean, width?: number, height?: number, color?: string, background?: string}) => {

    useEffect(() => {
        if (!props.active) {
            props.active = false;
        }
        if (!props.width) {
            props.width = 16;
        }
        if (!props.height) {
            props.height = 19;
        }
    }, [props]);

    const getColor = useCallback(() => {
        if (props.color) {
            return props.color;
        }
        return props.active ? "#0C0F12" : "#9DA3AE"
    }, [props])

    return (
        <svg
            width={props.width}
            height={props.height || '20px'}
            viewBox="0 0 16 19"
            fill={props.background ? props.background : "none"}
            xmlns="http://www.w3.org/2000/svg"
            className={props.active ? 'bg-icon-play-disabled' :'bg-icon-play-active'}
        >
            <path
                d="M1 1V17.5L14.5 9.25L1 1Z"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    )
}
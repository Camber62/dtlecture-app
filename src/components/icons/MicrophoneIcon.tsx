import React, {useCallback, useEffect} from "react"

export const MicrophoneIcon = (props: {active?: boolean, width?: number, height?: number, color?: string, background?: string}) => {

    useEffect(() => {
        if (!props.active) {
            props.active = false;
        }
        if (!props.width) {
            props.width = 15;
        }
        if (!props.height) {
            props.height = 24;
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
            height={props.height}
            viewBox="0 0 15 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.79167 23H7.5M10.2083 23H7.5M7.5 23C7.5 23 7.5 20.4387 7.5 19.15M7.5 19.15V19.15C3.91015 19.15 1
                16.2399 1 12.65V10.9M7.5 19.15V19.15C11.0899 19.15 14 16.2399 14 12.65V10.9M7.5 15.85H7.25C5.59315
                15.85 4.25 14.5069 4.25 12.85V4C4.25 2.34314 5.59315 1 7.25 1H7.5H7.75C9.40685 1 10.75 2.34315 10.75
                4V12.85C10.75 14.5069 9.40685 15.85 7.75 15.85H7.5Z"
                stroke={getColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )

}
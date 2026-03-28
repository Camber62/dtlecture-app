import React, {useCallback, useEffect} from "react"

export const RestartLectureIcon = (props: {active?: boolean, width?: number, height?: number, color?: string, background?: string}) => {

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
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="20"
                height="20"
                rx="2"
                fill={getColor()}
            />
        </svg>
    )
}

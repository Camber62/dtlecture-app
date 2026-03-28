import React from 'react';

export const RaiseHandIcon = ({ active }: { active: boolean } = { active: false }) => {
    const color = active ? "#0C0F12" : '#9DA3AE';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="24" viewBox="0 0 19 24" fill="none">
            <path
                d="M17.5 14.9332V6.86657C17.5 6.47758 17.342 6.10453 17.0607 5.82948C16.7794 5.55443 16.3978 5.3999 16 5.3999V5.3999C15.6022 5.3999 15.2206 5.55443 14.9393 5.82948C14.658 6.10453 14.5 6.47758 14.5 6.86657V11.9999"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.5 12.0001V3.93346C14.5 3.54448 14.342 3.17143 14.0607 2.89637C13.7794 2.62132 13.3978 2.4668 13 2.4668C12.6022 2.4668 12.2206 2.62132 11.9393 2.89637C11.658 3.17143 11.5 3.54448 11.5 3.93346V11.2668"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.5 11.3127V4.66686C8.5 4.27788 8.34196 3.90482 8.06066 3.62977C7.77935 3.35472 7.39782 3.2002 7 3.2002V3.2002C6.60218 3.2002 6.22064 3.35472 5.93934 3.62977C5.65804 3.90482 5.5 4.27788 5.5 4.66686V14.9335"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.5 11.2667V2.46667C11.5 2.07768 11.342 1.70463 11.0607 1.42958C10.7794 1.15452 10.3978 1 10 1C9.60218 1 9.22064 1.15452 8.93934 1.42958C8.65804 1.70463 8.5 2.07768 8.5 2.46667V11.2667"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17.5 14.9335C17.5 20.3143 14.5 23.0002 10.375 23.0002C6.25 23.0002 4.5761 21.1852 3.625 18.9668L1.1561 12.3668C0.843909 11.5396 0.985471 10.7723 1.7125 10.3685C2.44 9.96427 3.39578 10.1723 3.78953 10.9038L5.5 14.9335"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
import {useCallback, useEffect, useState} from "react";

export const useKeyboardPress = (key: string): boolean => {

    const [keyPressed, setKeyPressed] = useState<boolean>(false)

    const up = useCallback((event: KeyboardEvent) => {
        if (event.code.toLowerCase() === key.toLowerCase()) {
            event.preventDefault()
            setKeyPressed(false)
        }
    }, [key])

    const down = useCallback((event: KeyboardEvent) => {
        if (event.code.toLowerCase() === key.toLowerCase()) {
            // Проверяем, находится ли фокус на input элементе
            const activeElement = document.activeElement;
            const isInputElement = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                (activeElement as HTMLElement).contentEditable === 'true' ||
                activeElement.getAttribute('role') === 'textbox'
            );
            
            // Если фокус на input, не обрабатываем нажатие
            if (isInputElement) {
                return;
            }
            
            event.preventDefault()
            setKeyPressed(true)

        }
    }, [key])

    useEffect(() => {
        window.addEventListener("keyup", up);
        window.addEventListener("keydown", down);

        return () => {
            window.removeEventListener("keyup", up)
            window.removeEventListener("keydown", down)
        }
    }, [down, up]);

    return keyPressed;
}
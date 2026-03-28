
export const FetchModSettings = async (): Promise<{ name: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        name: "Задание из настроек мудла"
    }
}
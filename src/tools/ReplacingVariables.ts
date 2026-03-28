export const ReplacingVariables = (text: string, variables: {[key: string]: string}) => {
    const keys: string[] = []
    const match = text.match(/##([\s\S]+?)##/g)
    if (match) {
        match.map(item => keys.push(item.replace(/##/g, "")))
    }
    for (const key of keys) {
        text = text.replace(`##${key}##`, variables[`##${key}##`] ? variables[`##${key}##`] : "")
    }
    return text
}
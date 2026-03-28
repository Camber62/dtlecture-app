import axios from "axios";

export const ChatCreate = async (endpoint: string, params: Record<string, string>) => {

    return await axios.post(endpoint, params)

}

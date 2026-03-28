import axios from "axios";
import { cleanUrlsInJson } from "../utils/urlCleanup";

export const FetchConfig = async (endpoint: string) => {
    const response = await axios.get(endpoint);
    return cleanUrlsInJson(response.data);
}

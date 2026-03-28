import axios from "axios";

export const FetchAnalyzeAnswer = async (jwt: string, url: string, user_msg: string) => {

    return await axios.post(url, {user_msg},
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Token " + jwt,
            }
        }
    )

}

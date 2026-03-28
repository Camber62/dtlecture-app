import axios from "axios";

export const FetchBlockQuestionDynamic = async (jwt: string, endpoint: string) => {

    return await axios.get(
        endpoint,
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Token " + jwt,
            }
        }
    );

}

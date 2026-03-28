import axios from "axios";

export const FetchBlockPrompt = async (jwt: string, endpoint: string, question: string, answer: string, questionId: string | null) => {

    return await axios.post(
        endpoint,
        {
            question_text: question,
            answer_text: answer,
            question_id: questionId,
        },
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Token " + jwt,
            }
        }
    );

}

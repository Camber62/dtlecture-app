import axios from "axios";

export const FetchDynamicQuestionAnswer = async (jwt: string, endpoint: string, question: string, answer: string, questionId: string | null, testId: string | null) => {

    return await axios.post(
        endpoint,
        {
            question,
            answer: [answer],
            question_id: questionId,
            individual_test_id: testId,
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

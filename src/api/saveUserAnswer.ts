import {getQueryProperty, httpClient, httpClientMoodleResponseStructure} from "../utils/httpClient";

type saveUseAnswerProps = {
    question: string,
    raw_answer: string,
    attempt_id: string,
    local_storage_key: string | null,
    global_storage_key: string | null,
    endpoint: string,
    instructions: string
}

export const SaveUserAnswer = async (props: saveUseAnswerProps): Promise<httpClientMoodleResponseStructure<string>> => {

    const args = {
        ...props,
        instance: getQueryProperty("id"),
    }

    return await httpClient.moodle<string>("mod_dtlecture_save_answer", args)

}
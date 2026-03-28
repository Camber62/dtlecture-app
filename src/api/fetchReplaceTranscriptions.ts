import {httpClient, httpClientMoodleResponseStructure} from "../utils/httpClient";

export const FetchReplaceTranscriptions = async (endpoint: string, groupId: string, text: string): Promise<httpClientMoodleResponseStructure<{original_text: string, transcribed_text: string}>> => {
    return await httpClient.moodle<{original_text: string, transcribed_text: string}>("mod_dtlecture_replace_transcriptions", {
        endpoint,
        groupId,
        text
    })
}

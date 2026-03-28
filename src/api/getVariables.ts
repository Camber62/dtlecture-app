import {getQueryProperty, httpClient, httpClientMoodleResponseStructure} from "../utils/httpClient";
import {ApiGetVariablesItemResponse} from "../types/api";

export const GetVariables = async (): Promise<httpClientMoodleResponseStructure<ApiGetVariablesItemResponse[]>> => {
    return await httpClient.moodle<ApiGetVariablesItemResponse[]>("mod_dtlecture_get_variables", {instance: getQueryProperty("id")})

}
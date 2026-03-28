import {getQueryProperty, httpClient} from "../utils/httpClient";
import {ApiFetchLectureConfig} from "../types/api";

export const FetchLectureConfig = async () => {
    const response = await httpClient.moodle<ApiFetchLectureConfig>("mod_dtlecture_get_config", {instance: getQueryProperty("id")})
    return response.data;
}

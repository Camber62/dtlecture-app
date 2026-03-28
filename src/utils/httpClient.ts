import axios, {AxiosResponse} from "axios";

type configType = {
    wwwroot: string
    sesskey: string
}

export type httpClientMoodleResponseStructure<T> = {
    data: T,
    error: boolean,
    exception?: {
        backtrace: string
        debuginfo: string
        errorcode: string
        link: string
        message: string
        moreinfourl: string
    }
}

// @ts-ignore
const config: configType = window.M.cfg

const onFulfilled = (config: any) => config
const onRejected = (error: any) => Promise.reject(error);

axios.interceptors.request.use(onFulfilled, onRejected);

export const httpClient = {

    moodle: async <T>(methodname: string, args: {}, timeout: number = 30000): Promise<httpClientMoodleResponseStructure<T>> => {
        try {
            const _data = [];

            _data.push({
                index: 0,
                methodname,
                args
            });

            const {data} = await axios.request({
                method: "POST",
                url: `${config.wwwroot}/lib/ajax/service.php?sesskey=${config.sesskey}&info=${methodname}`,
                data: _data,
                timeout: timeout
            });

            if (!Array.isArray(data)) {
                return {
                    data: {} as T,
                    error: true,
                    exception: {
                        backtrace: data.stacktrace,
                        debuginfo: data.debuginfo,
                        errorcode: data.errorcode,
                        link: data.reproductionlink,
                        message: data.error,
                        moreinfourl: "",
                    }
                }
            }
            return data[0]
        } catch (err: unknown) {
            console.error(err)
        }
    },

    sync: (methodname: string, args: {}, timeout: number = 30000): Promise<AxiosResponse> => {
        try {
            const _data = [];

            _data.push({
                index: 0,
                methodname,
                args
            });

            return axios.request({
                method: "POST",
                url: `${config.wwwroot}/lib/ajax/service.php?sesskey=${config.sesskey}&info=${methodname}`,
                data: _data,
                timeout: timeout
            });
        } catch (err: unknown) {
            console.error(err)
        }
    }
}

export const getQueryProperty = (property: string): string => {
    const url = new URL(window.location.href)
    return url.searchParams.get(property).toString();
}
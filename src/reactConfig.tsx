import axios from 'axios';


declare global {
    var globalUrlApi : string;
}
globalThis.globalUrlApi = "potato2";

export const FetchUrlFromFile = async () => {
    axios.get('./apiConfig.json').then((res) => {
       globalThis.globalUrlApi = (res.data.apiUrl);
       console.log(res.data.apiUrl)
    });
    return globalUrlApi;
}
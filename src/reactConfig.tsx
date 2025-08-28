import axios from 'axios';


declare global {
    var globalUrlApi : string;
    var globalTypes : String[];
}
globalThis.globalUrlApi = "potato2";

export const FetchUrlFromFile = async () => {
    axios.get('./apiConfig.json').then((res) => {
        globalThis.globalUrlApi = (res.data.apiUrl);
        console.log(res.data.apiUrl)
        SetTypes(res.data.apiUrl)
    });
    return globalUrlApi;
}

const SetTypes = async (url : String) => {
    try {
        const result = await fetch(url + "/types")
        if (!result.ok){
            throw new Error(`Error: ${result.statusText}`);
        }
        var typesList : String[] = await result.json() as String[];
        typesList.push("All")
        globalThis.globalTypes = typesList;
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}
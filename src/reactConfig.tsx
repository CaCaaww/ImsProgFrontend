import axios from 'axios';
import { useNavigate } from 'react-router-dom';


declare global {
    var globalUrlApi : string;
    var globalTypes : String[];
    var globalTypesForForm : String[];
    var globalUserGroups: String[];
}
globalThis.globalUrlApi = "potato2";
//globalThis.globalUserGroups = []


export const FetchUrlFromFile = async () => {
    axios.get('./apiConfig.json').then((res) => {
        globalThis.globalUrlApi = (res.data.apiUrl);
        //console.log(res.data.apiUrl)
        //SetTypes(res.data.apiUrl)
    });
    return globalUrlApi;
}

export const SetTypes = async (url : String) => {
    const navigate = useNavigate();
    //console.log("url", url)
    try {
        const result = await fetch(url + "/types", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        // .then(res => res.text()) // Use .text() to inspect HTML
        // .then(body => console.log(body));
        if (!result.ok){
            if (result.status == 401){
                navigate("/")
                console.warn("Login Timed Out")
                return
            }
            throw new Error(`Error: ${result.statusText}`);
        }
        console.log(result)
        var typesList : String[] = await result.json() as String[];
        globalThis.globalTypesForForm = typesList;
        var typesListCopy = structuredClone(typesList);
        typesListCopy.push("All")
        globalThis.globalTypes = typesListCopy;
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}
import { useNavigate } from 'react-router-dom';
import { useConfig } from './otherStuff/ConfigProvider';

export const useSetTypes = () => {
    const { config, setConfig } = useConfig();
    const navigate = useNavigate();
    const SetTypes = async (url : String) => {
        try {
            if (!config) return;
            const result = await fetch(url + "/types", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            })
            if (!result.ok){
                if (result.status == 401){
                    navigate("/")
                    console.warn("Login Timed Out")
                    return
                } else if (result.status == 404){
                    navigate("/")
                    return
                }
                throw new Error(`Error: ${result.statusText}`);
            }
            console.log(result)
            var typesList : String[] = await result.json() as String[];
            var typesListCopy = structuredClone(typesList);
            typesListCopy.push("All")
            setConfig({...config, globalTypes: typesListCopy, globalTypesForForm:typesList})
            sessionStorage.setItem("types", JSON.stringify(typesListCopy));
            sessionStorage.setItem("formTypes", JSON.stringify(typesList));
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }
    return SetTypes;
}
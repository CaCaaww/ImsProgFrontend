//import { FetchUrlFromFile } from "../reactConfig";
import { useEffect } from "react";
import { SetTypes } from "../reactConfig";
import DrawerContainer from "./drawerContainer";
import { useNavigate } from "react-router-dom";

export function Home(){
    const navigate = useNavigate();
    SetTypes(globalUrlApi)
    useEffect(() => {
        const fetchGroups = async () => {
            // const result = await fetch(globalUrlApi + "/userGroups", {
            //     method: 'GET',
            //     credentials: 'include',
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // })
            // if (!result.ok){
            //     if (result.status == 401){
            //     navigate("/")
            //     console.warn("Login Timed Out")
            //     return
            //     }
            //     throw new Error(`Error: ${result.statusText}`);
            // } else {
            //     const list = await result.json() as string[]
            //     console.log(list)
            //     globalThis.globalUserGroups = list;
            // }
        }
        fetchGroups();
    }, []);
    // const getUrlInfo = async () => {
    //         FetchUrlFromFile();
    //     }
    //     getUrlInfo();

    return(
        <DrawerContainer>
            <h1>Home Screen</h1>
            <h2>A Note:</h2>
            <p>While the login seems trivial, it is important because the button tells the client side to ask for important data from a local file.
                If you reload the page, this data will not be loaded in unless you login again. If this data is not loaded, the other pages will cease to work.
            </p>
        </DrawerContainer>
    )
}
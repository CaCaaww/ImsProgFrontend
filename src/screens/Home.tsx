import { useEffect } from "react";
import { useSetTypes } from "../reactConfig";
import DrawerContainer from "./drawerContainer";
import { useConfig } from "../otherStuff/ConfigProvider";

export function Home(){
    const { config} = useConfig()
    const SetTypes = useSetTypes();
    useEffect(() => {
        if (!config) return;
        SetTypes(config.globalUrlApi)
    }, [config?.globalUrlApi])
    

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
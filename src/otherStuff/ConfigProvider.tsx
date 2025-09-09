import { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContex';
import { type Config } from './ConfigContex';
import axios from 'axios';


export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
        //console to check when this thing fires
        console.log("API Config Going")
        //get user groups from sessionStorage if there
        var sessionGroups = sessionStorage.getItem("userGroups");
        var userGroups : string[] = [];
        if (sessionGroups){
            userGroups = JSON.parse(sessionGroups) as string[];
        }
        //get types from sessionStorage if there
        var sessionTypes = sessionStorage.getItem("types");
        var types : string[] = [];
        if (sessionTypes){
            types = JSON.parse(sessionTypes) as string[];
        }
        //get type for form from sessionStorage if there
        var sessionFormTypes = sessionStorage.getItem("formTypes");
        var formTypes : string[] = [];
        if (sessionFormTypes){
            formTypes = JSON.parse(sessionFormTypes) as string[];
        }
        try {
            // Simulate fetching config from a file or API
            const res = await axios.get("/apiConfig.json");
            console.log(res);
            const configData : Config = {
                globalUrlApi : (res.data.apiUrl),
                globalTypes : types,
                globalTypesForForm : formTypes,
                globalUserGroups : userGroups,
                globalLoginUrl: (res.data.loginUrl)
            }
            setConfig(configData)
            console.log("Api URL's Configured")
        } catch (err) {
            console.error("Failed to load config:", err);
        }
    }
    loadConfig();

    
  }, []);

  return (
    <ConfigContext.Provider value={{config, setConfig}}>
      {children}
    </ConfigContext.Provider>
  );
};
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within a ConfigProvider");
  return context;
};
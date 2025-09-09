import { createContext } from 'react';

export interface Config {
    globalUrlApi : string;
    globalTypes : String[];
    globalTypesForForm : String[];
    globalUserGroups : String[];
    globalLoginUrl: string;
}

interface ConfigContextType {
  config: Config | null;
  setConfig: (cfg: Config) => void;
}

export const ConfigContext = createContext<ConfigContextType | null>(null);
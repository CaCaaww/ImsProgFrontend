import { useNavigate } from "react-router-dom";
import { FetchUrlFromFile } from "../reactConfig"


export function Login(){
    const getUrlInfo = async () => {
        FetchUrlFromFile();
    }
    getUrlInfo();
    const navigate = useNavigate();
    const handleClick = () => {
        
        navigate('/home')
    }



    return (
        <button onClick={handleClick}> Login</button>
    )
}
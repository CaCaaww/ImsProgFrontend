import { useNavigate } from "react-router-dom";
import { FetchUrlFromFile } from "../reactConfig"


export function Login(){
    const navigate = useNavigate();
    const handleClick = () => {
        FetchUrlFromFile();
        navigate('/home')
    }



    return (
        <button onClick={handleClick}> Login</button>
    )
}
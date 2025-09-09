import { useNavigate } from "react-router-dom";
import { Field, Form, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { useConfig } from "../otherStuff/ConfigProvider";


export function Login(){
    const { config, setConfig } = useConfig();
    // if (!config) return(<div>Loading Config...</div>);
    const navigate = useNavigate();

    const requiredValidator = (value: any) =>
        value ? '' : 'This field is required.';

    
    const handleClick = async (data : any) => {
        if (!config) return
        const response = await fetch(config.globalLoginUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: data.username,
                password: data.password
            })
            
        });
        if(response.status == 404){
            alert("NOT FOUND")
            window.location.reload();
        }
        //Setting user groups
        if (response.ok){
            const result = await fetch(config.globalUrlApi + "/userGroups", {
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
                } else if (result.status == 404) {
                    alert("NOT FOUND -- reload page")
                    window.location.reload();
                }
                throw new Error(`Error: ${result.statusText}`);
            } else {
                const list = await result.json() as string[]
                console.log(list)
                //globalThis.globalUserGroups = list;
                setConfig({...config, globalUserGroups : list})
                sessionStorage.setItem("userGroups", JSON.stringify(list))
                navigate('/home')
            }
            
        } else {
            window.location.reload();;
        }
    }

    return (
        <div>
            <Form
            onSubmit={handleClick}
            render={(formRenderProps) => (
                <FormElement style={{ maxWidth: 400, margin: '0 auto' }}>
                <Field
                    name="username"
                    component={Input}
                    label="Username"
                    validator={requiredValidator}
                />
                <Field
                    name="password"
                    component={Input}
                    type = "password"
                    label="Password"
                    validator={requiredValidator}
                />
                <div className="k-form-buttons">
                    <Button
                    type="submit"
                    themeColor="primary"
                    disabled={!formRenderProps.allowSubmit}
                    >
                    Login
                    </Button>
                </div>
                </FormElement>
            )}
            />
        </div>
        
    )
}
import { useNavigate } from "react-router-dom";
import { FetchUrlFromFile } from "../reactConfig"
import { Field, Form, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";


export function Login(){
    const getUrlInfo = async () => {
        FetchUrlFromFile();
    }
    getUrlInfo();
    const navigate = useNavigate();

    const requiredValidator = (value: any) =>
        value ? '' : 'This field is required.';

    const handleClick = async (data : any) => {
        const response = await fetch(globalLoginUrl, {
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
        if (response.ok){
            const result = await fetch(globalUrlApi + "/userGroups", {
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
                }
                throw new Error(`Error: ${result.statusText}`);
            } else {
                const list = await result.json() as string[]
                console.log(list)
                globalThis.globalUserGroups = list;
                navigate('/home')
            }
            
        } else {
            navigate('/');
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
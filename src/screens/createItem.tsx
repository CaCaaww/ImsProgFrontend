import DrawerContainer from "./drawerContainer";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export function CreateItem(){
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const navigate = useNavigate();
    const handleSubmit = async (data: any) => {
        try {
            setLoading(true)
            console.log('Form data:', data);
            const response = await fetch(globalUrlApi + "/addData", {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"Program Name": data.programName, "Cust": data.cust, "Description": data.description, "Updates to TTM": (data.updates == null? "" : data.updates), "Type": data.type}),
            });
            if (response.status == 401){
                navigate("/")
                console.warn("Login Timed Out")
                return
            }
            const result = await response.json();
            console.log(result)
            setMessage("Date Sent to Server Successfully")
        } catch (error) {
            console.error("Error sending Data:", error);
            setMessage("There was an error sending your data")
        } finally {
            setLoading(false) 
        }
    }
    const requiredValidator = (value: any) =>
        value ? '' : 'This field is required.';

    if (loading) return (<DrawerContainer><div>Sending To Server</div> </DrawerContainer>)
    return (
        <DrawerContainer>
            <div>{message}</div>
             <Form
                onSubmit={handleSubmit}
                render={(formRenderProps) => (
                    <FormElement style={{ maxWidth: 400, margin: '0 auto' }}>
                    <Field
                        name="programName"
                        component={Input}
                        label="Program Name"
                        validator={requiredValidator}
                    />
                    <Field
                        name="cust"
                        component={Input}
                        label="Customer "
                        validator={requiredValidator}
                    />
                    <Field
                        name="description"
                        component={Input}
                        label="Description"
                        validator={requiredValidator}
                    />
                    <Field
                        name="updates"
                        component={Input}
                        label="Updates to TTM"
                    />
                    <Field
                        name="type"
                        component={DropDownList}
                        label="Type"
                        data={globalTypesForForm}
                        validator={requiredValidator}
                    />
                    <div className="k-form-buttons">
                        <Button
                        type="submit"
                        themeColor="primary"
                        disabled={!formRenderProps.allowSubmit}
                        >
                        Submit
                        </Button>
                    </div>
                    </FormElement>
                )}
                />

            
        </DrawerContainer>
    )
}
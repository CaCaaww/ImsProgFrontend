import { useOptimistic, useState } from "react";
import DrawerContainer from "./drawerContainer";
import { Grid, GridColumn, type GridSelectionChangeEvent } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { data, useNavigate } from "react-router-dom";



//interface that models the data stored in the grid. 
interface imsProgGui{
    programName: string; 
    cust: string;
    description: string;
    updates: string;
    type: string;
}
interface PageState {
  skip: number; //how many rows to offset
  take: number; //how many rows to return
}
const initialDataState: PageState = { skip: 0, take: 15 };
//interface that models the properties of a column object
interface column {
  field: string; //a sort of columnId
  title: string; //the label of the column to be displayed
  orderIndex: number; //the left-to-right index of the column
  width: string; //the width of the column
}
const initialColumns = [
  { field: "programName", title: "Program Name", orderIndex: 0, width: '150px'},
  { field: "cust", title: "Customer", orderIndex: 1, width: '150px' },
  { field: "description", title: "Description", orderIndex: 2, width: '150px' },
  { field: "updates", title: "Updates to TTM", orderIndex: 3, width: '150px'},
];

export function DeleteArchive(){
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>(); //stores how many rows per page.
    const [numButtons] = useState<number> (5); //number of page buttons on the bottom scrollbar
    const [cols] = useState<column[]>(initialColumns);
    const [page, setPage] = useState<PageState>(initialDataState); //stores a PageState, which stores the skip and take of a page.
    const navigate = useNavigate();    
    const [selected, setSelected] = useState<imsProgGui[]>([]);
    const [deleted, setDeleted] = useState<imsProgGui[] | undefined>(() => {
        const temp = localStorage.getItem('archived');
        if (temp != null){
            return JSON.parse(temp) as imsProgGui[];
        } else {
        return undefined;
        }
    })
    const checkGroups =  globalUserGroups.indexOf('IMSADMIN') != -1? false : true;


    function transformBackendData(data: any): imsProgGui {
        return {
            programName: data["Program Name"],
            cust: data["Cust"],
            description: data["Description"],
            updates: data["Updates to TTM"],
            type: data["Type"]
        };
    }

    const RestoreCell = (props: any) => {
        const { dataItem, onRestore } = props;
    
        const handleRestore = () => {
        console.log("Restoring:", dataItem);
        if (onRestore) {
            onRestore(dataItem); 
        }
        };
    
        return (
        <td>
            <Button
            themeColor="error"
            onClick={handleRestore}
            >
            Restore
            </Button>
        </td>
        );
    };
    const handleRestore = async (itemToRestore: imsProgGui) => {
        itemToRestore = itemToRestore as imsProgGui;
        // console.log('handleRestore', itemToRestore)
        const response = await fetch(globalUrlApi + "/addData", {
                method: "POST",
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({"Program Name": itemToRestore.programName, "Cust": itemToRestore.cust, "Description": itemToRestore.description, "Updates to TTM": (itemToRestore.updates == null? "" : itemToRestore.updates), "Type": itemToRestore.type}),
        });
        if (response.status == 401){
            navigate("/")
            console.warn("Login Timed Out")
            return
        } else  if (response.status == 404){
            navigate("/")
            return
        }
        const result = await response.json() as imsProgGui;
        const result2 = transformBackendData(result)
        console.log("result:", result2)
        
        if (deleted != undefined){
            const updatedArray = deleted.filter(item => !(item.programName == result2.programName 
            && item.description == result2.description && item.cust == result2.cust
            && item.type == result2.type && item.updates == result2.updates));
            setDeleted(updatedArray);
            localStorage.setItem('archived', JSON.stringify(updatedArray));
        }
    };
    function CheckSelected(dataItem : any) {
        selected.forEach(element => {
            if (element.programName == dataItem.programName 
            && element.description == dataItem.description && element.cust == dataItem.cust
            && element.type == dataItem.type && element.updates == dataItem.updates) return true
        });
        return false;
    }
    const CheckBoxCell = (props: any) => {
        const { dataItem } = props;
    
        const handleSelectionChange = () => {
            if (selected.includes(dataItem)){
                var updated = (selected.filter(item => !(item.programName == dataItem.programName 
                && item.description == dataItem.description && item.cust == dataItem.cust
                && item.type == dataItem.type && item.updates == dataItem.updates)));
                setSelected(updated);
            } else {
                var updated = selected.concat(dataItem);
                //console.log("updated", updated)
                setSelected(updated)
            }
            //console.log("selected", selected);
        };
    
        return (
        <td>
            <input
                type="checkbox"
                checked={selected.includes(dataItem) || false}
                onChange={handleSelectionChange}
            />
        </td>
        );
    };
    const handleDeleteButton = () =>{
        console.log("Deleting", selected);
        var updated = deleted?.filter(item => !selected.includes(item));
        setDeleted(updated);
        localStorage.setItem('archived', JSON.stringify(updated))
        setSelected([])
    }


    return (
        <DrawerContainer>
            <Grid
                        style={{ height: '800px'}} 
                        data={deleted} 
                        
                        reorderable={true}
                        resizable={true}
            
                        defaultSkip={page.skip}
                        defaultTake={page.take}
                        total={deleted?.length}
                        pageable={{
                          buttonCount: numButtons,
                          pageSizes: [5, 10, 15, 'All'],
                          pageSizeValue: pageSizeValue
                        }}
            
                        
                        >
                        {cols.map((col) => (
                        <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
                        ))}
                        <GridColumn
                          title="Actions"
                          orderIndex={cols.length}
                          width={'80px'}
                          cells={{
                            data: (props) => <RestoreCell {...props} onRestore={handleRestore} />
                          }}
                        />
                        <GridColumn
                            title="Select"
                            width="80px"
                            orderIndex={cols.length+1}
                            cells={{
                                data: CheckBoxCell
                            }}
                        />
                        </Grid>
                        <Button
                        onClick={handleDeleteButton}
                        disabled={checkGroups}>
                            Delete Selected Permanently
                        </Button>
                            
        </DrawerContainer>
    )
}
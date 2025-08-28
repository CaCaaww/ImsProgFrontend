import { useEffect, useState } from "react"
import {Grid, GridColumn} from '@progress/kendo-react-grid';
//import "@progress/kendo-theme-default/dist/all.css";

//interface that models the data stored in the grid. 
interface imsProgGui{
    programName: string; 
    cust: string;
    description: string;
    updates: string;
    type: string;
}
//interface that models the properties of a column object
interface column {
  field: string; //a sort of columnId
  title: string; //the label of the column to be displayed
  orderIndex: number; //the left-to-right index of the column
  width: string; //the width of the column
}
//initial configuration of items
const initialColumns = [
  { field: "Program Name", title: "Program Name", orderIndex: 0, width: '150px'},
  { field: "Cust", title: "Customer", orderIndex: 1, width: '150px' },
  { field: "Description", title: "Description", orderIndex: 2, width: '150px' },
  { field: "Updates", title: "Updates to TTM", orderIndex: 3, width: '150px'},
  ];

export function ImsProgData(){
    var url = globalUrlApi;
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<imsProgGui[]>();
    const [cols] = useState<column[]>(initialColumns); // data that stores the order and size of the columns (along with their name and field)

    useEffect(() => {
        const fetchData = async() => {
          setLoading(true)
          try {
            console.log(url)
            const result = await fetch(url)
            if (!result.ok){
              throw new Error(`Error: ${result.statusText}`);
            }
            setData(await result.json());
          } catch (err) {
            console.error("Error fetching data:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, []);
    
    if (loading) return(<div>loading</div>);

    return(
        <div>Page
            <Grid
            style={{ height: '700px'}} 
            data={data} 

            sortable={true} 

            filterable={true} 

            skip={0}
            take={15}
            total={data?.length}
            
            reorderable={true}
            resizable={true}

            >
            {cols.map((col) => (
            <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
            ))}
            </Grid>
        </div>
    )
}
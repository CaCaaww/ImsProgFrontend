import { useEffect, useState} from "react"
import {Grid, GridColumn, type GridFilterChangeEvent, type GridPageChangeEvent, type GridSortChangeEvent, } from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';
import DrawerContainer from "./drawerContainer";
import type { PagerTargetEvent } from '@progress/kendo-react-data-tools';
import { process, type CompositeFilterDescriptor, type DataResult, type FilterDescriptor, type SortDescriptor, type State } from '@progress/kendo-data-query';
import { DropDownList, type DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { useNavigate } from "react-router-dom";
//import { DeleteCell } from "../otherStuff/DeleteCell";
import { Button } from "@progress/kendo-react-buttons";


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
interface PageState {
  skip: number; //how many rows to offset
  take: number; //how many rows to return
}
//initial configuration of items
const initialDataState: PageState = { skip: 0, take: 15 };
//initial configuration of items
const initialColumns = [
  { field: "programName", title: "Program Name", orderIndex: 0, width: '150px'},
  { field: "cust", title: "Customer", orderIndex: 1, width: '150px' },
  { field: "description", title: "Description", orderIndex: 2, width: '150px' },
  { field: "updates", title: "Updates to TTM", orderIndex: 3, width: '150px'},
  ];

export function ImsProgData(){
    var url = globalUrlApi;
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<imsProgGui[]>();
    const [cols] = useState<column[]>(initialColumns); // data that stores the order and size of the columns (along with their name and field)
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<PageState>(initialDataState); //stores a PageState, which stores the skip and take of a page.
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>(); //stores how many rows per page.
    const [numButtons] = useState<number> (5); //number of page buttons on the bottom scrollbar
    const [sort, setSort] = useState<SortDescriptor[]>([]);
    const [filter, setFilter] = useState<CompositeFilterDescriptor | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
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
    
    const [dataState, setDataState] = useState<State>({
      skip: 0,
      take: 15,
      sort: [],
      filter: undefined
    });
    const [processedData, setProcessedData] = useState<DataResult>();

    const updateProcessedData = (newDataState : State) => {
      if (data != undefined){
        setProcessedData(process(data, newDataState));
        //console.log(process(data, newDataState))
        setTotal(process(data, newDataState).total)
      }
    }
    const updateDataState = (newDataState : State) => {
      setDataState({
        skip: newDataState.skip,
        take: newDataState.take,
        sort: newDataState.sort,
        filter: newDataState.filter
      })
    }

    const combineFilters = (regularFilter : CompositeFilterDescriptor | undefined, dropDownFilter : FilterDescriptor | undefined) => {
      if (dropDownFilter == undefined){
        return regularFilter;
      }
      if (regularFilter != undefined){
        var newFilter = structuredClone(regularFilter);
        newFilter.filters.push(dropDownFilter)
        return newFilter;
      } else {
        return {logic : 'and', filters: [dropDownFilter]} as CompositeFilterDescriptor
      }
    }

    const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        var take = event.page.take;
        if (targetEvent.value === 'All'){ // the take can be set to 'all', and since that is not a number, we need to make it the total.
            setPage({skip: 0, take: total})
        } else {
          setPage({
            ...event.page,
            take
        });
        }
        console.log(event)
        if (targetEvent.value) {
            setPageSizeValue(targetEvent.value);
        }
        
        var newDataState : State;
        if (targetEvent.value === 'All'){
          newDataState = {skip: 0, take: total, sort: sort, filter: filter};
        } else {
          newDataState = {skip: {...event.page}.skip, take: {...event.page}.take, sort: sort, filter: filter }
        }
        updateDataState(newDataState);
        updateProcessedData(newDataState);
    }

    const sortChange = (event: GridSortChangeEvent) => {
      console.log(event);
        const evsort = ({...event.sort}) 
        var newSort : SortDescriptor[];
        if (evsort[0] != undefined){ //sort is undefined if no sort is selected on the grid
            setSort(
                [{field: evsort[0].field as string, dir: evsort[0].dir}]
            );
            newSort = [{field: evsort[0].field as string, dir: evsort[0].dir}]
        } else { 
            // the default sort.
            setSort(
                []
            )
            newSort = []
        }
      var newDataState = {skip: page.skip, take: page.take, sort: newSort, filter: filter}
      updateDataState(newDataState);
      updateProcessedData(newDataState);        
    }

    const filterChange = (event: GridFilterChangeEvent) => {
      console.log(event);
        const evfilt = ({...event.filter})
        var newFilter;
        if (evfilt.filters != undefined){ //filter is undefined if the filter is cleared.
            setFilter(
                evfilt
            );
            newFilter=evfilt;
        } else {
            setFilter(undefined)
            newFilter=undefined;
        }
        
        var newFilter2 = combineFilters(newFilter, selectedStatus == 'All' ?  undefined : {field: "Type", operator: 'eq', value: selectedStatus})
        var newDataState ={skip: 0, take: page.take, sort: sort, filter: newFilter2}
        console.log(newDataState);
        updateDataState(newDataState);
        updateProcessedData(newDataState);
    }
    const dropDownChange = (event : DropDownListChangeEvent) => {
      setSelectedStatus(event.value)
      console.log(event.value)
      var newFilter: CompositeFilterDescriptor | undefined;
      if (event.value != "All"){
        newFilter = combineFilters(filter, {field: "Type", operator: 'eq', value: event.value});
        var newDataState = {skip: page.skip, take: page.take, sort: sort, filter: newFilter}
        updateDataState(newDataState)
        updateProcessedData(newDataState)
      } else {
        newFilter = combineFilters(filter, undefined)
        var newDataState2 = {skip: page.skip, take: page.take, sort: sort, filter: newFilter}
        updateDataState(newDataState2)
        updateProcessedData(newDataState2)
      }
    }

    const downloadTxt = async () => {
      if (data != undefined){
        //var dataString : string = "[";
        var dataState2 : State = {
          skip: 0,
          take: data.length,
          sort: dataState.sort,
          filter: dataState.filter
        }
        const processedData2 = process(data, dataState2);
        const response = await fetch(globalUrlApi + '/partialPrint', {
          method: "POST",
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedData2.data)
        });
        if (response.status == 401){
                navigate("/")
                console.warn("Login Timed Out")
                return
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.txt'; // suggested filename
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      }
    };
    const DeleteCell = (props: any) => {
      const { dataItem, onDelete } = props;
    
      const handleDelete = () => {
        console.log("Deleting:", dataItem);
        if (onDelete) {
          onDelete(dataItem); 
        }
      };
    
      return (
        <td>
          <Button
            themeColor="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </td>
      );
    };

    const handleDelete = async (itemToDelete: any) => {
      console.log('handleDelete', deleted)
      const result = await fetch(url +"/delete", {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({"Program Name": itemToDelete.programName, "Cust": itemToDelete.cust, "Description": itemToDelete.description, "Updates to TTM": (itemToDelete.updates == null? "" : itemToDelete.updates), "Type": itemToDelete.type})
      });
      if (!result.ok){
        if (result.status == 401){
          navigate("/")
          console.warn("Login Timed Out")
          return
        } else {
          console.warn("there was an error -- possibly not found")
          return
        }
      }
      const updated = Array.isArray(deleted)
        ? [...deleted, itemToDelete]
        : [itemToDelete];

      setDeleted(updated);
      localStorage.setItem("archived", JSON.stringify(updated));
      if (data != undefined){
        const updatedArray = data.filter(item => !(item.programName == itemToDelete.programName 
          && item.description == itemToDelete.description && item.cust == itemToDelete.cust
          && item.type == itemToDelete.type && item.updates == itemToDelete.updates));
        setData(updatedArray);
        setProcessedData(process(updatedArray, dataState))
      }
      
    };

    useEffect(() => {
        const fetchData = async() => {
          setLoading(true)
          try {
            const result = await fetch(url, {
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
                navigate("/")
                return
              }
              throw new Error(`Error: ${result.statusText}`);
            }
            var imslist : imsProgGui[]  = await result.json() as imsProgGui[];
            var temp :imsProgGui[] = [];
            imslist.forEach(element => {
              temp.push(transformBackendData(element))
            });
            setData(temp);
            setTotal(temp.length)
            setProcessedData(process(temp, dataState))
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
      <DrawerContainer>
        <div>
            <Grid
            style={{ height: '800px'}} 
            data={processedData} 
            

            sortable={true} 
            onSortChange={sortChange}

            filterable={true} 
            onFilterChange={filterChange}
            
            reorderable={true}
            resizable={true}

            skip={page.skip}
            take={page.take}
            total={total}
            pageable={{
              buttonCount: numButtons,
              pageSizes: [5, 10, 15, 'All'],
              pageSizeValue: pageSizeValue
            }}
            onPageChange={pageChange}

            
            >
            {cols.map((col) => (
            <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
            ))}
            <GridColumn
              title="Actions"
              orderIndex={cols.length}
              width={'80px'}
              cells={{
                data: (props) => <DeleteCell {...props} onDelete={handleDelete} />
              }}
            />
            </Grid>
            <DropDownList
              data={globalTypes}
              value={selectedStatus}
              onChange={dropDownChange}
              //onChange={(e) => setSelectedStatus(e.value)}
              style={{ width: '150px' }}
            />
        </div>
        <button onClick={downloadTxt} disabled={checkGroups}>Download Data Grid</button>
      </DrawerContainer>
    )
}
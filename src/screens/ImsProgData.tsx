import { useEffect, useState } from "react"
import {Grid, GridColumn, type GridPageChangeEvent, type GridSortChangeEvent, } from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';
import DrawerContainer from "./drawerContainer";
import type { PagerTargetEvent } from '@progress/kendo-react-data-tools';
import { process, type CompositeFilterDescriptor, type DataResult, type SortDescriptor, type State } from '@progress/kendo-data-query';



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
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<PageState>(initialDataState); //stores a PageState, which stores the skip and take of a page.
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>(); //stores how many rows per page.
    const [numButtons] = useState<number> (5); //number of page buttons on the bottom scrollbar
    const [sort, setSort] = useState<SortDescriptor[]>([]);
    const [filter, setFilter] = useState<CompositeFilterDescriptor | undefined>(undefined);

    const [dataState, setDataState] = useState<State>({
      skip: 0,
      take: 15,
      sort: [],
      filter: undefined
    });
    const [processedData, setProcessedData] = useState<DataResult>();

    const updateProcessedData = (newDataState : State) => {
      if (data != undefined)
        setProcessedData(process(data, newDataState));
    }

    const updateDataState = (newDataState : State) => {
      setDataState({
        skip: newDataState.skip,
        take: newDataState.take,
        sort: newDataState.sort,
        filter: newDataState.filter
      })
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

    useEffect(() => {
        const fetchData = async() => {
          setLoading(true)
          try {
            const result = await fetch(url)
            if (!result.ok){
              throw new Error(`Error: ${result.statusText}`);
            }
            var imslist : imsProgGui[]  = await result.json() as imsProgGui[];
            setData(imslist);
            setTotal(imslist.length)
            setProcessedData(process(imslist, dataState))
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

            //onDataStateChange={(e) => setDataState(e.dataState)}
            >
            {cols.map((col) => (
            <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
            ))}
            </Grid>
        </div>
      </DrawerContainer>
    )
}
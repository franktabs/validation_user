import { DataGrid, GridColDef, GridColumnHeaderParams, GridFilterModel, GridValidRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import { Electeur, TypeElecteur } from '../../models/Electeur';
import "./dataTable.css"
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addElecteur, loadAllDataElecteur } from '../../redux/electeurSlice';
import $ from "jquery"
import { UseFormReset } from 'react-hook-form';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

type Props = {
    columns: GridColDef[],
    rows: (typeof Electeur.clearData)[],
    loading: boolean,
    error: boolean,
    reset: UseFormReset<TypeElecteur>
}

export default function DataTable({ columns, rows, loading = false, error = false, reset }: Props) {
    const dispatch = useAppDispatch();

    const [filteredValue, setFilteredValue] = useState<{ field: string, value: string, filterModel?: GridFilterModel }>({ field: "", value: "" });

    const handleFilterChange = (params: GridFilterModel) => {
        if(params.items){

            const items = params.items[0];
            const field = items.field;
            const filterValue = items.value;
    
            setFilteredValue({ field: field, value: (filterValue + "" || "").trim(), filterModel: params });
        }
    };

    const handleQueryFirebase = async () => {
        if (filteredValue.field && filteredValue.value.length > 0) {
            let newRows = await Electeur.getFilter(filteredValue);
            setRowsElecteur(newRows);
            setPagePrevious(0)
        }
        else if (filteredValue.field && filteredValue.value.length === 0) {
            let newRows = await Electeur.getAllLimit();
            setRowsElecteur(newRows);
            setPagePrevious(0)
        } else {
            let newRows = await Electeur.getAllLimit();
            setRowsElecteur(newRows);
            setPagePrevious(0)
        }
    }


    const [sortModel, setSortModel] = useState<{ field: string, sort: "asc" | "desc" }[]>([]);
    const [rowsElecteur, setRowsElecteur] = useState<TypeElecteur[]>([]);
    const [pagePrevious, setPagePrevious] = useState(0);


    useEffect(() => {
        setRowsElecteur((state) => [...state, ...rows]);

    }, [rows])

    useEffect(() => {
        dispatch(loadAllDataElecteur(rowsElecteur));
    }, [rowsElecteur, dispatch])

    const handleColumnHeaderClick = useCallback(async (params: GridColumnHeaderParams<GridValidRowModel, any, any>) => {
        // Vérifiez si la colonne est déjà triée
        const existingSortColumn = sortModel.find((column) => column.field === params.field);

        if (existingSortColumn) {
            // Colonne déjà triée, inversez le sens de tri
            const updatedSortModel: { field: string, sort: "asc" | "desc" }[] = sortModel.map((column) =>
                column.field === params.field
                    ? { ...column, sort: column.sort === 'asc' ? 'desc' : 'asc' }
                    : column
            );

            let newRowsElecteur = await Electeur.getByColumn(updatedSortModel[0]);
            setRowsElecteur(newRowsElecteur);
            setSortModel(updatedSortModel);
            setFilteredValue((state)=> {
                let filterModel = state.filterModel;
                if(filterModel){
                    filterModel.items[0].value = "";
                    filterModel.items[0].field = "";

                }
                return { field: params.field, value: "", filterModel: filterModel}
            });
            setPagePrevious(0)
        } else {
            // Nouvelle colonne de tri, ajoutez-la à l'état de tri
            const newSortColumn: { field: string, sort: "asc" | "desc" } = { field: params.field, sort: 'asc' };

            let newRowsElecteur = await Electeur.getByColumn(newSortColumn);
            setRowsElecteur(newRowsElecteur);
            setSortModel([newSortColumn]);
            setFilteredValue((state)=> {
                let filterModel = state.filterModel;
                if(filterModel){
                    filterModel.items[0].value = "";
                    filterModel.items[0].field = "";
                }
                return { field: params.field, value: "", filterModel: filterModel}
            });
            setPagePrevious(0)
        }
    }, [sortModel]);

    const handleClick = useCallback((data: TypeElecteur) => {
        dispatch(addElecteur(data));
        $(".my-modal").removeClass("d-none");
    }, [dispatch]);

    if (error) return <div>Impossible de Charger les données</div>
    return (
        <div style={{ height: 400, width: '100%' }}>
            <div>
                <button className="btn btn-secondary" onClick={handleQueryFirebase} >Actualiser le Filtre </button>
            </div>
            <DataGrid
                showCellVerticalBorder={true}
                showColumnVerticalBorder={true}
                rowSpacingType="border"

                // pageSizeOptions={[20, 10]}
                initialState={{

                    pagination: { paginationModel: { pageSize: 20 } },
                    filter: { "filterModel": filteredValue.filterModel }

                }}

                loading={loading}

                rows={rowsElecteur}
                rowCount={Electeur.countLastRequest}
                columns={columns}
                editMode="cell"
                onRowClick={(e) => { reset(Electeur.clearData); handleClick(e.row) }}
                onColumnHeaderClick={(params, model, details) => {
                    // console.log("voici les trois objet ", params, model, details);
                    handleColumnHeaderClick(params)
                }}
                onFilterModelChange={(params, details) => {
                    console.log("voiici les params de filter", params, details);
                    handleFilterChange(params);
                }}
                paginationModel={{ page: pagePrevious, pageSize: 20 }}
                onPaginationModelChange={async (model, detail) => {
                    let pageActu = model.page + 1;
                    if ((model.page - pagePrevious > 0) && pageActu * model.pageSize > rowsElecteur.length) {
                        let newRows = await Electeur.getNextDataLimit();
                        console.log("newRows", newRows);
                        setRowsElecteur((state) => [...state, ...newRows])
                        setPagePrevious(model.page)
                    }
                    // else if(model.page - pagePrevious < 0){
                    //     let newRows = await Electeur.getPreviousDataLimit();
                    //     console.log("newRows", newRows);
                    //     setRowsElecteur(newRows)
                    //     setPagePrevious(model.page)
                    // }
                    setPagePrevious(model.page)
                }}

            />
        </div>
    );
}
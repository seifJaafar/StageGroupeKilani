import React, { useCallback, useState, useEffect } from 'react'
import { toast } from "react-hot-toast";
import { Column } from 'primereact/column';
import { Row } from "reactstrap";
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import { GetAllReferences } from '../../actions/employee.actions';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import DelReference from './popups/DelReference';
import 'primereact/resources/themes/saga-blue/theme.css';
function References() {
    const [references, setReferences] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [item, setItem] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'utilisateur.username': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
        date_d_ajout: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS }

    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dateFilter, setDateFilter] = useState(null);
    const [dateDepotFilter, setDateDepotFilter] = useState(null);
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'utilisateur.username': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
            date_d_ajout: { value: null, matchMode: FilterMatchMode.CONTAINS },
            createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS }


        });
        setGlobalFilterValue('');
        setDateFilter(null);
    };
    const clearFilter = () => {
        initFilters();
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const openSuppDialogue = (row) => {
        setSuppDialog(true);
        setItem({ ...row });
    };
    const handleCloseDel = () => {
        setItem({});
        setSuppDialog(false);
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };
    const createdAtBodyTemplate = (rowData) => {
        const createdAtString = String(rowData.createdAt).split('T')[0]

        return rowData.createdAt ? createdAtString : '';
    };
    const onDateFilterChange = (e) => {
        const selectedDate = e.value;
        const formattedDate = selectedDate ? formatDate(selectedDate, 'yy-mm-dd') : null;
        let _filters = { ...filters };
        _filters['date_d_ajout'].value = formattedDate;


        setFilters(_filters);
        setDateFilter(selectedDate);
    };
    const onDateDepotFilterChange = (e) => {
        const selectedDate = e.value;
        const formattedDate = selectedDate ? formatDate(selectedDate, 'yy-mm-dd') : null;
        let _filters = { ...filters };
        _filters['createdAt'].value = formattedDate;


        setFilters(_filters);
        setDateDepotFilter(selectedDate);
    };
    const actionBodyTemplate = (row) => {
        return (
            <div
                className="actions"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >



                <Button
                    icon="pi pi-trash"
                    tooltip="Delete reference"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-danger mr-0 custom-crud-btn"
                    onClick={() => openSuppDialogue(row)}
                />
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Chercher" />
                <Calendar value={dateFilter} onChange={onDateFilterChange} dateFormat="yy-mm-dd" placeholder="Sélectionner une date d'ajout" />
                <Calendar value={dateDepotFilter} onChange={onDateDepotFilterChange} dateFormat="yy-mm-dd" placeholder="Sélectionner une date depot" />

            </div>

        );
    };
    const header = renderHeader();
    const fetchReferences = async () => {
        const response = await GetAllReferences();
        if (response.error) {
            toast.error(response.error);
        } else {

            setReferences(response.data);
        }
    }
    useEffect(() => {
        fetchReferences();
    }, [])
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const codeBodyTemplate = (rowData) => {
        return <Link to={`/reference/${rowData._id}`}>{rowData.code}</Link>;
    };
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <div className='header-fileInput'>
                    <h1>Listes des références</h1>
                </div>
                <div className='table-container'>
                    {item && suppDialogue && (
                        <DelReference
                            open={suppDialogue}
                            handleClose={handleCloseDel}
                            value={item}
                            title={`Delete the reference ${item.code}`}
                        />
                    )}
                    <DataTable value={references} paginator rows={rows} className='datatable-custom' totalRecords={references.length} first={first} onPage={onPage} filters={filters} globalFilterFields={['code', 'date_d_ajout', 'utilisateur.username', 'createdAt', 'laboratoire.designation']} header={header} emptyMessage="Aucune référence trouvée">
                        <Column field="code" header="Code" sortable headerClassName='custom-column-header' className='custom-table-cell' body={codeBodyTemplate} />
                        <Column field="employee" filterField="utilisateur.username" header="Employé" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.utilisateur?.username) }} />
                        <Column field="date_d_ajout" filterField='date_d_ajout' header="Date d'ajout" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.date_d_ajout) }} />
                        <Column field="laboratoire" filterField='laboratoire.designation' header="Laboratoire" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.laboratoire?.designation) }} />
                        <Column field="createdAt" filterField='createdAt' header="Date_depot" sortable headerClassName='custom-column-header' className='custom-table-cell' body={createdAtBodyTemplate} />
                        <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
export default References;
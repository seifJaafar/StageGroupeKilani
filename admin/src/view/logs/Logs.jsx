import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { GetLogs } from "../../actions/user.action";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';
import ShowUpdate from "./popups/ShowUpdate";
function Logs() {
    const [logs, setLogs] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [ShowDialogue, setShowDialog] = useState(false);
    const [item, setItem] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'user.username': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'user.role': { value: null, matchMode: FilterMatchMode.CONTAINS },
        timestamp: { value: null, matchMode: FilterMatchMode.CONTAINS }

    });
    const [dateFilter, setDateFilter] = useState(null);
    const [roleFilter, setRoleFilter] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'user.username': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'user.role': { value: null, matchMode: FilterMatchMode.CONTAINS },
            timestamp: { value: null, matchMode: FilterMatchMode.CONTAINS }


        });
        setGlobalFilterValue('');
        setDateFilter(null);
        setRoleFilter(null);
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
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };
    const onDateFilterChange = (e) => {
        const selectedDate = e.value;
        const formattedDate = selectedDate ? formatDate(selectedDate, 'yy-mm-dd') : null;
        let _filters = { ...filters };
        _filters['timestamp'].value = formattedDate;


        setFilters(_filters);
        setDateFilter(selectedDate);
    };
    const onRoleFilterChange = (e) => {
        const selectedRole = e.value;
        let _filters = { ...filters };
        _filters['user.role'].value = selectedRole;


        setFilters(_filters);
        setRoleFilter(selectedRole);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Chercher" />
                <Calendar value={dateFilter} onChange={onDateFilterChange} dateFormat="yy-mm-dd" placeholder="Sélectionner une date" />
                <Dropdown
                    value={roleFilter}
                    name="role"
                    onChange={onRoleFilterChange}
                    options={[
                        { value: "laboratoire", name: "Laboratoire" },
                        { value: "employee", name: "Employé" },
                        { value: "admin", name: "Admin" }
                    ]}
                    optionLabel="name"
                    optionValue="value"
                    className="dropdownFilter"
                    placeholder="Select role"
                />


            </div>

        );
    };
    const header = renderHeader();
    const getData = async () => {
        try {
            const { logs } = await GetLogs();
            console.log(logs)
            setLogs(logs)
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getData();
    }, []);
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'no time';
        return timestamp.toLocaleString();
    }

    const openShowDialogue = (row) => {
        setShowDialog(true);
        setItem({ ...row });
    };
    const handleCloseShow = () => {
        setItem({});
        setShowDialog(false);
    };
    const actionBodyTemplate = (row) => {
        return (
            row.before || row.after ? (
                <div
                    className="actions"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        icon="pi pi-pencil"
                        tooltip="Show Details"
                        tooltipOptions={{ position: "bottom" }}
                        className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                        onClick={() => openShowDialogue(row)}
                    />


                </div>
            ) : (
                <div></div>
            )
        );
    };
    const timestampBodyTemplate = (rowData) => {
        const timestampString = String(rowData.timestamp).split('T')[0]

        return rowData.timestamp ? timestampString : '';
    };
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <div className='header-fileInput'>
                    <h1 style={{ fontWeight: "600" }}>Logs</h1>

                </div>
                {logs && logs.length > 0 &&
                    <>
                        <div className="table-container">
                            {item && ShowDialogue && (
                                <ShowUpdate
                                    open={ShowDialogue}
                                    handleClose={handleCloseShow}
                                    value={item}
                                    title={` Mise à jour ${item.username}`}
                                />
                            )}
                            <DataTable value={logs} paginator rows={rows} first={first} className='datatable-custom' totalRecords={logs.length} onPage={onPage} filters={filters} globalFilterFields={['role', 'user.role', 'user.username', 'timestamp', 'action']} header={header} emptyMessage="Aucune log trouvée" >
                                <Column field="user.username" filterField="user.username" headerClassName='custom-column-header' className='custom-table-cell' header="Username" sortable body={(row) => row.user?.username}></Column>
                                <Column field="user.role" filterField="user.role" headerClassName='custom-column-header' className='custom-table-cell' header="Role" sortable body={(row) => row.user?.role} />
                                <Column field="action" filterField="action" headerClassName='custom-column-header' className='custom-table-cell' header="Action" sortable body={(row) => row.action} />
                                <Column field="timestamp" headerClassName='custom-column-header' className='custom-table-cell' header="Date" sortable body={timestampBodyTemplate}></Column>
                                <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                            </DataTable>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
export default Logs;
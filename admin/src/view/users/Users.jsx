import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { GetAllUsers } from "../../actions/user.action"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import { InputText } from 'primereact/inputtext';
import Badge from "../../partials/Badge";
import UpdateUserMenu from "./popups/UpdateUserMenu";
import AddUser from "./AddUser";
import DelUser from "./popups/DelUser";
import { useMediaQuery } from "react-responsive";
import "../../assets/styles/Profile.css"
function Users() {
    const [users, setUsers] = useState([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
        approved: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [item, setItem] = useState({});
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");


    const getData = async () => {
        try {

            const { usersBack } = await GetAllUsers();
            console.log(usersBack)
            if (usersBack.error) {
                toast.error(usersBack.error);
            } else {
                setUsers(usersBack)
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getData();
    }, []);
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
            approved: { value: null, matchMode: FilterMatchMode.EQUALS },

        });
        setGlobalFilterValue('');
    };
    const approvedRowFilterTemplate = (options) => {
        return (
            <>
                <TriStateCheckbox
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                />
                <span> filtrer les données</span>
            </>

        );
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Chercher" />
            </div>

        );
    };
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const clearFilter = () => {
        initFilters();
    };
    const EmailColumnValue = (row) => {
        return `${row?.email}`;
    };
    const RoleColumnValue = (row) => {
        return `${row?.role}`;
    };
    const openUpdtDialogue = (row) => {
        setUpdtDialog(true);
        setItem({ ...row });
    };
    const openSuppDialogue = (row) => {
        setSuppDialog(true);
        setItem({ ...row });
    };
    const handleCloseUpdt = () => {
        setItem({});
        setUpdtDialog(false);
    };
    const handleCloseDel = () => {
        setItem({});
        setSuppDialog(false);
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
                    icon="pi pi-pencil"
                    tooltip="Update user"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openUpdtDialogue(row)}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Delete User"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-danger mr-0 custom-crud-btn"
                    onClick={() => openSuppDialogue(row)}
                />
            </div>
        );
    };
    const header = renderHeader();
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Liste des comptes"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Gérer Les Utilisateurs</h1>

                        </div>
                        <div className="table-container">

                            {item && updDialogue && (
                                <UpdateUserMenu
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating user ${item?.username}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelUser
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Delete the user ${item.username}`}
                                />
                            )}
                            {users && users.length > 0 && (
                                <>
                                    <div className="table-container">
                                        <DataTable value={users} paginator rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={users.length} first={first} onPage={onPage} filters={filters} globalFilterFields={['email', 'username', 'phone', "laboratoire.designation", 'approved']} header={header} emptyMessage="Aucun utilisateur trouvé">

                                            <Column
                                                field="email"
                                                header="Email"
                                                headerClassName='custom-column-header' className='custom-table-cell'
                                                body={EmailColumnValue}
                                            />
                                            <Column field="phone" header="Téléphone" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.phone) }} />
                                            <Column field="role" header="Profile" body={RoleColumnValue} sortable headerClassName='custom-column-header' className='custom-table-cell' />
                                            <Column field="approved" dataType="boolean" filterField="approved" header="Approuvé" filter
                                                filterElement={approvedRowFilterTemplate} sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => <Badge type={row.approved ? "green" : "red"}>{row.approved ? "Approuvé" : "Non Approuvé"}</Badge>} />
                                            <Column field="laboratoire" filterField="laboratoire.designation" header="Laboratoire" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row.laboratoire?.designation }} />
                                            <Column field="username" header="Nom d'utilisateur" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row.username }} />
                                            <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                        </DataTable>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="2" title={"Ajouter compte"} >
                        <AddUser />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
export default Users;
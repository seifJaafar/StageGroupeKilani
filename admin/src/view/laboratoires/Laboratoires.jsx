import React, { useEffect, useState } from "react";
import { GetAllLabs } from "../../actions/labo.action"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tab, Tabs } from "react-bootstrap";
import UpdateLaboratoire from "./popups/UpdateLaboratoire";
import DelLabo from "./popups/DelLabo";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import AddLabo from "./AddLabo";
import { useMediaQuery } from "react-responsive";
import "../../assets/styles/Profile.css"
function Laboratoires() {
    const [laboratoires, setLaboratoires] = useState([]);
    const [rows, setRows] = useState(10);
    const [item, setItem] = useState({});
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [first, setFirst] = useState(0);
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setLaboratoires(labs.labs);
    }
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },


        });
        setGlobalFilterValue('');
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const clearFilter = () => {
        initFilters();
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Chercher" />
            </div>

        );
    };
    const header = renderHeader();
    useEffect(() => {
        fetchDataLabs();
    }, []);
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
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
                    tooltip="Update Laboratoire"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openUpdtDialogue(row)}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Delete Laboratoire"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-danger mr-0 custom-crud-btn"
                    onClick={() => openSuppDialogue(row)}
                />
            </div>
        );
    };
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Liste des Laboratoires"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Gérer Les Laboratoires</h1>

                        </div>
                        <div className="table-container">
                            {item && updDialogue && (
                                <UpdateLaboratoire
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating Laboratoire ${item?.designation}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelLabo
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Supprimer Laboratoire ${item?.designation}`}
                                />
                            )}

                            {laboratoires && laboratoires.length > 0 && (
                                <>
                                    <div className="table-container">
                                        <DataTable value={laboratoires} paginator rows={rows} className='datatable-custom' totalRecords={laboratoires.length} first={first} filters={filters} globalFilterFields={['designation', "code"]} header={header} emptyMessage="Aucun laboratoire trouvé" onPage={onPage}>
                                            <Column field="designation" header="Désignation" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.designation) }} />
                                            <Column field="code" header="Code" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.code) }} />
                                            <Column field="createdAt" header="Date d'ajout" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.createdAt) }} />
                                            <Column field="updatedAt" header="Dernier Mise à jour" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.updatedAt) }} />
                                            <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                        </DataTable>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="2" title={"Ajouter Laboratoire"} >
                        <AddLabo />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
export default Laboratoires;
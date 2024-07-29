import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { InputText } from 'primereact/inputtext';
import { GetAllProducts } from "../../actions/produit.action"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import Badge from "../../partials/Badge";
import { useMediaQuery } from "react-responsive";
import AddProduit from "./AddProduit";
import UpdateProduitMenu from "./popups/UpdateProduitMenu";
import DelProduit from "./popups/DelProduit";
import "../../assets/styles/Profile.css"
function Produits() {
    const [item, setItem] = useState({});
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");
    const [produits, setProduits] = useState([]);
    const [first, setFirst] = useState(0);
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'laboratoire.designation': { value: null, matchMode: FilterMatchMode.CONTAINS },
            approved: { value: null, matchMode: FilterMatchMode.EQUALS },

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
    const fetchDataProducts = async () => {
        const products = await GetAllProducts();
        setProduits(products.products);
    }
    useEffect(() => {
        fetchDataProducts();
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
                    tooltip="Update Produit"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openUpdtDialogue(row)}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Delete Produit"
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
                    <Tab eventKey="1" title={"Liste des Produits"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Gérer Les Produits</h1>
                        </div>
                        <div className="table-container">
                            {item && updDialogue && (
                                <UpdateProduitMenu
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating Produit ${item?.designation}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelProduit
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Supprimer Produit ${item?.designation}`}
                                />
                            )}
                            {produits && produits.length > 0 && (
                                <>
                                    <div className="table-container">
                                        <DataTable value={produits} paginator rows={rows} className='datatable-custom' totalRecords={produits.length} first={first} onPage={onPage} filters={filters} globalFilterFields={['designation', 'code', 'status', "laboratoire.designation"]} header={header}>

                                            <Column field="designation" header="Désignation" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.designation) }} />
                                            <Column field="code" header="Code" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.code) }} />
                                            <Column field="status" header="Status" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => <Badge type={row.status === "en stock" ? "green" : "red"}>{row.status === "en stock" ? "en stock" : "épuisé"}</Badge>} />
                                            <Column field="Laboratoire" filterField="laboratoire.designation" header="Laboratoire" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row.laboratoire?.designation }} />
                                            <Column field="createdAt" header="Date d'ajout" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row.createdAt }} />
                                            <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                        </DataTable>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>

                    <Tab eventKey="2" title={"Ajouter Produit"} >
                        <AddProduit />
                    </Tab>

                </Tabs>
            </div>
        </div>
    );
}
export default Produits;
import React, { useCallback, useState, useEffect } from 'react'
import { toast } from "react-hot-toast";
import { Column } from 'primereact/column';

import { DataTable } from 'primereact/datatable';
import { useParams } from 'react-router-dom';

import { GetProduitsByReference } from "../../actions/employee.actions";
import 'primereact/resources/themes/saga-blue/theme.css';
function ProduitsByRefrence() {
    const { refid } = useParams();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [ventes, setVentes] = useState([]);
    const FetchData = async () => {
        const response = await GetProduitsByReference(refid);
        if (response.error) {
            toast.error(response.error);
        } else {
            setVentes(response.data);
        }
    }
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    useEffect(() => {
        FetchData();
    }, [])
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                {ventes.length > 0 ? (
                    <>
                        <div className='header-fileInput'>
                            <h1>{`Réference ${ventes[0].reference?.code}`}</h1>
                        </div>
                        <div className='table-container'>
                            <DataTable value={ventes} paginator rows={rows} className='datatable-custom' totalRecords={ventes.length} first={first} onPage={onPage} emptyMessage="Aucune référence trouvée">
                                <Column field="produit" header="Produit" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.libelle) }} />
                                <Column field="stock_res_off" header="Stock Res off" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.stock_res_off) }} />
                                <Column field="cm" header="Cm" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.cm) }} />
                                <Column field="mois" header="Mois" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.mois) }} />
                            </DataTable>
                        </div>
                    </>
                ) : <h1>Aucun produit trouvé</h1>}

            </div>
        </div>
    );
}
export default ProduitsByRefrence;
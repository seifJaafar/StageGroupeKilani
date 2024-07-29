import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from "react-hot-toast";
import { Upload, GetValidData } from '../actions/employee.actions';
import { DataTable } from 'primereact/datatable';
import { GetAllLabs } from "../actions/labo.action"
import { Column } from 'primereact/column';
import { Row } from "reactstrap";
import { Create } from "../actions/employee.actions";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from "primereact/dropdown";
import ValidateAddData from "../validations/ValidateAdddata"
import 'primereact/resources/themes/saga-blue/theme.css';


function AddData() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [FileData, setFileData] = useState([]);
    const [first, setFirst] = useState(0);
    const [validFirst, setValidFirst] = useState(0);
    const [invalidFirst, setInvalidFirst] = useState(0);
    const [savedFirst, setSavedFirst] = useState(0);
    const [notSavedFirst, setNotSavedFirst] = useState(0)
    const [rows, setRows] = useState(10);
    const [savedRows, setSavedRows] = useState(10)
    const [notSavedRows, setNotSavedRows] = useState(10)
    const [validRows, setValidRows] = useState(10);
    const [invalidRows, setInvalidRows] = useState(10);
    const [laboratoires, setLaboratoires] = useState([]);
    const [laboratoire, setLaboratoire] = useState("");
    const [date, setDate] = useState(null);
    const [uidate, setUiDate] = useState(null);
    const [saved, setSaved] = useState([]);
    const [notSaved, setNotSaved] = useState([])
    const [valid, setValid] = useState([]);
    const [ButtonVisible, setButtonVisible] = useState(true);
    const [invalid, setInvalid] = useState([]);
    const fieldMapping = {
        CM: 'cm',
        Code: 'Code',
        Libelle: 'libelle',
        Mois: 'mois',
        'Stock Res Off': 'stock_res_off',

    };
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setLaboratoires(labs.labs);
    }
    useEffect(() => {
        fetchDataLabs();

    }, []);
    useEffect(() => {
        if (FileData.length > 0) {
            getValidData();
        }
    }, [FileData])
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const acceptedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!acceptedTypes.includes(file.type)) {
            toast.error("Le fichier doit être au format .xlsx");
            return;
        } else {
            setSelectedFile(file);
            getData(file);
        }

    }, []);

    const getValidData = async () => {
        try {
            const data = await GetValidData({ data: FileData, laboratoire: laboratoire })
            if (data.error) {
                toast.error(data.error);
            } else {
                const { validData, invalidData } = data.data;

                setValid(validData);
                setInvalid(invalidData);
            }
        } catch (err) {
            console.error(err)
        }
    }
    const getData = async (file) => {
        try {

            const data = await Upload(file);
            if (data.error) {
                toast.error(data.error);
            } else {
                const ArrayData = data.data
                const headers = ArrayData[1];
                const labData = ArrayData[0];
                const rows = ArrayData.slice(2);
                const transformedData = rows.map(row => {
                    let rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });
                    return rowData;
                });
                const FormatedData = transformedData.map((item) => {
                    const formedItem = {};
                    for (const key in item) {
                        if (fieldMapping[key]) {
                            formedItem[fieldMapping[key]] = item[key];
                        }
                    }
                    return formedItem;
                })

                setFileData(FormatedData);
            }
        } catch (err) {
            console.error(err);
        }
    }
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const onValidPage = (event) => {
        setValidFirst(event.first);
        setValidRows(event.rows);
    }
    const onInvalidPage = (event) => {
        setInvalidFirst(event.first);
        setInvalidRows(event.rows);
    }
    const onNotSavedPage = (event) => {
        setNotSavedFirst(event.first);
        setNotSavedRows(event.rows);
    }
    const onSavedPage = (event) => {
        setSavedFirst(event.first)
        setSavedRows(event.rows)
    }
    const handleSubmit = async () => {
        try {
            const NewData = {
                data: FileData,
                date,
                laboratoire
            }
            const { valid } = ValidateAddData(NewData);
            if (valid) {
                const data = await Create(NewData);
                if (data.error) {
                    toast.error(data.error);
                } else {
                    const { savedData, NotsavedData } = data.data;

                    toast.success("Données ajoutées avec succès");
                    setButtonVisible(false)
                    setSaved(savedData)
                    setNotSaved(NotsavedData)
                    setValid([]);
                    setInvalid([]);
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: '.xls,.xlsx',
        maxFiles: 1,
        maxSize: 10485760, // 10MB in bytes
    });
    const handleCancelUpload = () => {
        setSelectedFile(null);
    };
    const handleDate = (e) => {
        const date = e.value;
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;

    }
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <div className='header-fileInput'>
                    <h1>Importez vos données</h1>
                    <p>Vous pouvez importer un fichier Excel pour ajouter des données à la Base de données</p>
                </div>
                <Row className="custom-row">
                    <div className="field col-6 md:col-6 custom-col-6">
                        <label htmlFor="date">Date d'ajout</label>
                        <Calendar
                            value={uidate}
                            onChange={(e) => { setDate(handleDate(e)); setUiDate(e.value); }}
                            showIcon
                            dateFormat="yy-mm-dd"
                            required />
                    </div>
                    {laboratoires && laboratoires.length > 0 && (
                        <div className="field col-6 md:col-6 custom-col-6 ">
                            <label htmlFor="description">Choisir Laboratoire</label>
                            <Dropdown
                                value={laboratoire}
                                name="laboratoire"
                                onChange={(e) => { setLaboratoire(e.value); }}
                                options={laboratoires.map((lab, index) => (
                                    { value: lab._id, name: lab.designation }
                                ))}
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Select Laboratoire"
                                required
                            />
                        </div>
                    )}
                </Row>

                <div {...getRootProps()} className='fileInput' >
                    <input {...getInputProps()} disabled={!!selectedFile} />
                    {selectedFile ? (
                        <div className="selected-file">
                            <p>{selectedFile.name} - {selectedFile.size} octets</p>
                            <button className="cancel-upload" onClick={handleCancelUpload}>
                                Annuler <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                    ) : (
                        isDragActive ? (
                            <p>Fichier déposé</p>
                        ) : (
                            <div>
                                <p>Déposez votre fichier Excel ici</p>
                                <i className="fa-solid fa-folder"></i>
                            </div>
                        ))}
                </div>
                <p className='warning'><i className="fa-solid fa-triangle-exclamation"></i>Le fichier doit être au format .xlsx</p>
                {FileData.length > 0 && (
                    <>
                        {valid.length > 0 && (
                            <>
                                <div>
                                    <h3>Données valides</h3>
                                </div>
                                <div className="table-container">
                                    <DataTable value={valid} paginator rows={validRows} className='datatable-custom' totalRecords={valid.length} first={validFirst} onPage={onValidPage}>
                                        {Object.keys(valid[0]).map((key) => (
                                            <Column key={key} field={key} header={key} headerClassName='custom-column-header' className='custom-table-cell' />
                                        ))}
                                    </DataTable>
                                </div>
                            </>
                        )}
                        {invalid.length > 0 && (
                            <>
                                <div>
                                    <h3>Données invalides</h3>
                                </div>
                                <div className="table-container">
                                    <DataTable value={invalid} paginator rows={invalidRows} className='datatable-custom' totalRecords={invalid.length} first={invalidFirst} onPage={onInvalidPage}>
                                        {Object.keys(invalid[0]).map((key) => (
                                            <Column key={key} field={key} header={key} headerClassName='custom-column-header' className='custom-table-cell' />
                                        ))}
                                    </DataTable>
                                </div>
                            </>
                        )}

                        {ButtonVisible && (<div className="button-container">
                            <button className="btn-primary" onClick={handleSubmit}>Valider</button>
                            <button className="btn-secondary" onClick={() => {
                                setFileData([])
                                setSelectedFile(null)
                            }}>Annuler</button>
                        </div>)}
                    </>
                )}
                {notSaved.length > 0 && (
                    <>
                        <div>
                            <h3>Données non enregistrés</h3>
                        </div>
                        <div className="table-container">
                            <DataTable value={notSaved} paginator rows={notSavedRows} className='datatable-custom' totalRecords={notSaved.length} first={notSavedFirst} onPage={onNotSavedPage}>
                                {Object.keys(notSaved[0]).map((key) => (
                                    <Column key={key} field={key} header={key} headerClassName='custom-column-header' className='custom-table-cell' />
                                ))}
                            </DataTable>
                        </div>
                    </>
                )}
                {saved.length > 0 && (
                    <>
                        <div>
                            <h3>Données enregistrés</h3>
                        </div>
                        <div className="table-container">
                            <DataTable value={saved} paginator rows={savedRows} className='datatable-custom' totalRecords={saved.length} first={savedFirst} onPage={onSavedPage}>
                                {Object.keys(saved[0]).map((key) => (
                                    <Column key={key} field={key} header={key} headerClassName='custom-column-header' className='custom-table-cell' />
                                ))}
                            </DataTable>
                        </div>
                    </>
                )}
                {(saved.length > 0 || notSaved.length > 0) && (

                    <>
                        <p className='warning'><i className="fa-solid fa-triangle-exclamation"></i>s’il vous plait contactez l'admin de Medicis si il y a des produits non valides ou non enregistré</p>

                        < div className="button-container">
                            <button className="btn-secondary" onClick={() => {
                                setFileData([])
                                setSelectedFile(null)
                                setSaved([]);
                                setNotSaved([]);
                                setValid([]);
                                setInvalid([]);
                                setUiDate(null);
                                setDate(null);
                                setLaboratoire(null);
                                setButtonVisible(true)
                            }}>Terminer</button>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}


export default AddData;
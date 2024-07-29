import React, { useEffect, useState } from "react";
import { GetAllLabs } from "../../actions/labo.action"
import { Row } from "reactstrap";
import { InputText } from "primereact/inputtext";
import { AddNewProduit } from "../../actions/produit.action";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import validateNewProduit from "../../validations/ValidateNewProduit";
function AddProduit() {
    const [laboratoires, setLaboratoires] = useState([]);
    const [designation, setDesignation] = useState("")
    const [code, setCode] = useState("")
    const [statut, setStatut] = useState("")
    const [laboratoire, setLaboratoire] = useState("")
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setLaboratoires(labs.labs);
    }
    useEffect(() => {
        fetchDataLabs();
    }, []);
    const handleCancel = () => {
        setDesignation("")
        setCode("")
        setStatut("")
        setLaboratoire("")
    }
    const handleSubmit = async () => {
        const NewProduit = {
            designation: designation,
            code: code,
            laboratoire: laboratoire,
            status: statut
        }
        console.log(NewProduit)
        const { valid } = validateNewProduit(NewProduit);
        if (valid) {
            await AddNewProduit(NewProduit);
            window.location.reload();
        }
    }
    return (
        <>
            <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6">
                    <label>Désignation</label>
                    <InputText
                        name="designation"
                        value={designation}
                        onChange={(e) => { setDesignation(e.target.value) }}
                        required
                        autoFocus
                    />
                </div>
                <div className="field col-6 md:col-6 custom-col-6">
                    <label>Code</label>
                    <InputText
                        name="code"
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        required
                        autoFocus
                    />
                </div>
            </Row>
            <Row className="custom-row">
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
                <div className="field col-6 md:col-6 custom-col-6">
                    <label htmlFor="description">choisir Statut</label>
                    <Dropdown
                        value={statut}
                        name="statut"
                        onChange={(e) => { setStatut(e.value) }}
                        options={[
                            { value: "épuisé", name: "épuisé" },
                            { value: "en stock", name: "en stock" }
                        ]}
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select Statut"
                        required
                    />
                </div>
            </Row>
            <div className="custom-row-btn">

                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-cancel"
                    onClick={handleCancel}
                />
                <Button
                    label="Ajouter  "
                    icon="pi pi-check"
                    className="p-button-submit"
                    onClick={handleSubmit}
                />

            </div>
        </>
    )
}
export default AddProduit;
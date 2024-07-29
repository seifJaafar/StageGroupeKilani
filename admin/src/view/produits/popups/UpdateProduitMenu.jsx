import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UpdateProduit } from "../../../actions/produit.action"
import { Dropdown } from "primereact/dropdown";
import { GetAllLabs } from "../../../actions/labo.action"
import validateNewProduit from "../../../validations/ValidateNewProduit";


import useWindowSize from "../../../components/useWindowSize";
function UpdateProduitMenu(props) {
    const { open, handleClose, title = "Updating Produit", value } = props;
    const [designation, setDesignation] = useState(value.designation)
    const [code, setCode] = useState(value.code)
    const [status, setStatus] = useState(value.status)
    const [laboratoire, setLaboratoire] = useState(value.laboratoire)
    const [id, setId] = useState(value._id)
    const [laboratoires, setLaboratoires] = useState([])
    const [selectedLab, setSelectedLab] = useState(null);
    const size = useWindowSize();
    useEffect(() => {
        setId(value._id)
        setDesignation(value.designation)
        setCode(value.code)
        setLaboratoire(value.laboratoire?._id)
        setSelectedLab({ value: value.laboratoire?._id, name: value.laboratoire?.designation })
        setStatus(value.status)
    }, [value]);
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setLaboratoires(labs.labs);
    }
    useEffect(() => {
        fetchDataLabs();

    }, []);
    const PopupSize = () => {
        switch (size) {
            case "xl":
                return "500px";
            case "lg":
                return "500px";
            case "md":
                return "500px";
            case "sm":
                return "500px";
            case "xs":
                return "98%";
            default:
                return "80%";
        }
    };
    const handleSubmit = async () => {
        const UpdatedProduit = {
            designation: designation,
            code: code,
            status: status,
            laboratoire: laboratoire
        }
        console.log(UpdatedProduit)
        const { valid } = validateNewProduit(UpdatedProduit);
        if (valid) {
            await UpdateProduit(id, UpdatedProduit);
            window.location.reload();
        }
    }
    const DialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-outlined p-button-cancel"
                onClick={handleClose}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-submit"
                onClick={handleSubmit}
            />
        </>
    );
    return (
        <Dialog
            visible={open}
            style={{ width: PopupSize() }}
            header={title}
            modal
            className="p-fluid"
            footer={DialogFooter}
            onHide={handleClose}
        >
            <div className="grid w-100 mt-2">
                <div className="field col-12 md:col-12">
                    <label>Désignation</label>
                    <InputText
                        name="designation"
                        value={designation}
                        onChange={(e) => { setDesignation(e.target.value) }}
                        required
                        autoFocus
                    />
                </div>
                <div className="field col-12 md:col-12">
                    <label>Code</label>
                    <InputText
                        name="code"
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        required
                    />
                </div>
                <>
                    <div className="field col-6 md:col-6">
                        <label htmlFor="description">Select Status</label>
                        <Dropdown
                            value={status}
                            name="status"
                            onChange={(e) => { setStatus(e.value) }}
                            options={[
                                { value: "en stock", name: "en stock" },
                                { value: "épuisé", name: "épuisé" }
                            ]}
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select status"
                        />
                    </div>
                    <div className="field col-6 md:col-6">
                        <label htmlFor="description">Select Laboratoire</label>
                        <Dropdown
                            value={laboratoire}
                            name="laboratoire"
                            onChange={(e) => { setLaboratoire(e.value); setSelectedLab({ value: e.value, name: e.name }) }}
                            options={laboratoires.map((lab, index) => (
                                { value: lab._id, name: lab.designation }
                            ))}
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select Laboratoire"
                        />
                    </div>
                </>
            </div>
        </Dialog>
    )
}
export default UpdateProduitMenu;
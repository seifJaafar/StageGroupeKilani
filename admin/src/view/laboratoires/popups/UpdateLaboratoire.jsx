import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UpdateLabo } from "../../../actions/labo.action"
import validateLabo from "../../../validations/ValidateLabo";

import useWindowSize from "../../../components/useWindowSize";

function UpdateLaboratoire(props) {
    const { open, handleClose, title = "Updating Laboratoire", value } = props;
    const [designation, setDesignation] = useState(value.designation)
    const [code, setCode] = useState(value.code)
    const [id, setId] = useState(value._id)
    const size = useWindowSize();
    useEffect(() => {
        setDesignation(value.designation)
        setCode(value.code)
        setId(value._id)
    }, [value]);
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
        const updatedLaboratoire = {
            designation: designation,
            code: code,
        }
        const { valid } = validateLabo(updatedLaboratoire);
        if (valid) {
            await UpdateLabo(id, updatedLaboratoire)
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
                        name="Code"
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        required
                    />
                </div>



            </div>
        </Dialog>
    );
}
export default UpdateLaboratoire;
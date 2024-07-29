import React, { useEffect, useState } from "react";
import { Row } from "reactstrap";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AddNewLabo } from "../../actions/labo.action"
import validateLabo from "../../validations/ValidateLabo";
function AddLabo() {
    const [designation, setDesignation] = useState("")
    const [code, setCode] = useState("")
    const handleSubmit = async () => {
        const NewLabo = {
            designation: designation,
            code: code
        }
        const { valid } = validateLabo(NewLabo);
        if (valid) {
            await AddNewLabo(NewLabo);
            window.location.reload();


        }
    }
    const handleCancel = () => {
        setDesignation("")
        setCode("")
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
export default AddLabo;
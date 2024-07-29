import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { DeleteUser } from "../../../actions/user.action"
import useWindowSize from "../../../components/useWindowSize";

function DelUser(props) {
    const {
        open,
        handleClose,
        title = "Delete User",
        value,
        callBack = () => { },
    } = props;


    const size = useWindowSize();

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


    const DialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-outlined p-button-cancel"
                onClick={handleClose}
            />
        </>
    );
    const renderObject = (obj) => {
        return obj ? (
            <pre>{JSON.stringify(obj, null, 2)}</pre>
        ) : 'N/A';
    };
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
            <div className="flex align-items-center justify-content-start">
                <div className="mr-5 text-base font-semibold">
                    <p className="text-blue-900">Before</p>
                    <p>{renderObject(value.before)} </p>
                </div>
                <div className="text-base font-semibold">
                    <p className="text-blue-900">After</p>
                    <p>{renderObject(value.after)}</p>
                </div>
            </div>
        </Dialog >
    );
}

export default DelUser;

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

  const handleSubmit = async () => {

    await DeleteUser(value._id);
    handleClose();
    window.location.reload();
  };

  const DialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-outlined p-button-cancel"
        onClick={handleClose}
      />
      <Button
        label="Delete"
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
      <div className="flex align-items-center justify-content-start">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        <span>
          Êtes-vous sûr de vouloir supprimer le compte de{" "}
          <b>
            {value.username} ?
          </b>
        </span>
      </div>
    </Dialog>
  );
}

export default DelUser;

import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { GetAllLabs } from "../../../actions/labo.action"
import { UpdateUser } from "../../../actions/user.action"
import useWindowSize from "../../../components/useWindowSize";
import { Dropdown } from "primereact/dropdown";
import validateUpdateUser from "../../../validations/ValidateUpdateUser";



function UpdateUserMenu(props) {
  const { open, handleClose, title = "Updating user", value } = props;

  // item values :  firstName, lastName, email, phoneNumber, country, password
  const [item, setItem] = useState({});
  const [email, setEmail] = useState(value.email)
  const [username, setUsername] = useState(value.username)
  const [role, setRole] = useState(value.role)
  const [approved, setApproved] = useState(value.approved)
  const [phone, setPhone] = useState(value.phone)
  const [firstname, setFirstname] = useState(value.employee?.firstname)
  const [lastname, setLastname] = useState(value.employee?.lastname)
  const [designation, setDesignation] = useState(value.laboratoire?.designation)
  const [laboratoire, setLaboratoire] = useState(value.laboratoire?._id)
  const [laboratoires, setLaboratoires] = useState([]);
  const [id, setId] = useState(value._id)
  const [selectedLab, setSelectedLab] = useState(null);

  const size = useWindowSize();

  useEffect(() => {
    setId(value._id)
    setEmail(value.email);
    setUsername(value.username)
    setRole(value.role)
    setApproved(value.approved)
    setPhone(value.phone)
    setLaboratoire(value.laboratoire?._id)
    setDesignation(value.laboratoire?.designation)
    setSelectedLab({ value: value.laboratoire?._id, name: value.laboratoire?.designation })
    if (value.role === "employee" && value.employee) {
      setFirstname(value.employee.firstname);
      setLastname(value.employee.lastname)
    }
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
    const updatedUser = {
      email: email,
      username: username,
      phone: phone,
      password: value.password,
      role: role,
      approved: approved,
      ...(role !== 'admin' ? { laboratoire: laboratoire } : {}),
      ...(role === 'employee' ? {
        employee: {
          firstname: firstname,
          lastname: lastname
        }
      } : {}),
    }
    console.log(updatedUser)
    const { errors, valid } = validateUpdateUser(updatedUser);
    if (valid) {
      await UpdateUser(id, updatedUser)
      window.location.reload();
    }
    {/*if (UpdateUserValidation(item)) {
      dispatch(UpdateUserByAdmin(item, handleClose));
       */}
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
          <label>Email</label>
          <InputText
            name="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            required
            autoFocus
          />
        </div>
        <div className="field col-12 md:col-12">
          <label>username</label>
          <InputText
            name="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
            required
          />
        </div>
        <div className="field col-12 md:col-12">
          <label>Phone Number*</label>
          <InputText
            name="phone"
            value={phone}
            onChange={(e) => { setPhone(e.target.value) }}
            required
          />
        </div>
        <>
          <div className="field col-6 md:col-6">
            <label htmlFor="description">Select Role</label>
            <Dropdown
              value={role}
              name="role"
              onChange={(e) => { setRole(e.value) }}
              options={[
                { value: "laboratoire", name: "Laboratoire" },
                { value: "employee", name: "Employé" },
                { value: "admin", name: "Admin" }
              ]}
              optionLabel="name"
              optionValue="value"
              placeholder="Select role"
            />
          </div>
          <div className="field col-6 md:col-6">
            <label htmlFor="description">Approuver</label>
            <Dropdown
              value={approved}
              name="approved"
              onChange={(e) => { setApproved(e.value) }}
              options={[
                { value: true, name: "true" },
                { value: false, name: "false" },
              ]}
              optionLabel="name"
              optionValue="value"
              placeholder="Select role"
            />
          </div>
        </>
        {role === "laboratoire" && (<div className="field col-12 md:col-12">
          <label htmlFor="description">Select Laboratoire</label>
          <Dropdown
            value={laboratoire}
            name="laboratoire"
            onChange={(e) => { setLaboratoire(e.value); setDesignation(e.name); setSelectedLab({ value: e.value, name: e.name }) }}
            options={laboratoires.map((lab, index) => (
              { value: lab._id, name: lab.designation }
            ))}
            optionLabel="name"
            optionValue="value"
            placeholder="Select Laboratoire"
          />
        </div>)}
        {role === "employee" && (
          <>
            <div className="field col-6 md:col-6">
              <label>firstname</label>
              <InputText
                name="firstname"
                value={firstname}
                onChange={(e) => { setFirstname(e.target.value) }}
                required
              />
            </div>
            <div className="field col-6 md:col-6">
              <label>lastname</label>
              <InputText
                name="lastname"
                value={lastname}
                onChange={(e) => { setLastname(e.target.value) }}
                required
              />
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

export default UpdateUserMenu;

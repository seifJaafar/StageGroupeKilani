import React, { useEffect, useState } from "react";
import { GetAllLabs } from "../../actions/labo.action"
import { Row } from "reactstrap";
import { InputText } from "primereact/inputtext";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { RegisterUser } from "../../actions/user.action"
import validateFormData from "../../validations/ValidateNewUser"


function AddUser() {
    const [laboratoires, setLaboratoires] = useState([]);
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const [approved, setApproved] = useState("")
    const [phone, setPhone] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    /* const [password, setPassword] = useState("") */
    const [designation, setDesignation] = useState("")
    const [laboratoire, setLaboratoire] = useState("")
    const [selectedLab, setSelectedLab] = useState(null);
    /*const [toggletext, settoggleText] = useState(false) */
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setLaboratoires(labs.labs);
    }
    useEffect(() => {
        fetchDataLabs();
    }, []);
    const handleCancel = () => {
        setEmail("")
        setUsername("")
        setRole("")
        setApproved("")
        setPhone("")
        setFirstname("")
        setLastname("")
        /* setPassword("") */
        setDesignation("")
        setLaboratoire("")
    }
    const handleSubmit = async () => {
        const Newuser = {
            email: email,
            phone: phone,
            role: role,
            approved: approved,
            ...(role === 'laboratoire' ? { laboratoire: laboratoire } : {}),
            username: username,
            ...(role === 'employee' ? {
                employee: {
                    firstname: firstname,
                    lastname: lastname
                }
            } : {}),
        }
        console.log(Newuser)
        const { errors, valid } = validateFormData(Newuser);
        if (valid) {
            await RegisterUser(Newuser, () => { })
            window.location.reload();
        } else {
            console.log(errors)
        }

    }
    return (
        <>
            <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6">
                    <label>Email</label>
                    <InputText
                        name="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                        autoFocus
                    />
                </div>
                <div className="field col-6 md:col-6 custom-col-6">
                    <label>nom d'utilisateur</label>
                    <InputText
                        name="username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                        required
                        autoFocus
                    />
                </div>
            </Row>
            <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6">
                    <label>numéro de télephone</label>
                    <InputText
                        name="phone"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}

                    />
                </div>
                <div className="field col-6 md:col-6 custom-col-6">
                    <label htmlFor="description">choisir Profile</label>
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
                        required
                    />
                </div>
            </Row>
            <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6 ">
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
                        placeholder="Approuver"
                        required
                    />
                </div>
                {role === "laboratoire" && (
                    <div className="field col-6 md:col-6 custom-col-6 ">
                        <label htmlFor="description">Choisir Laboratoire</label>
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
                            required
                        />
                    </div>
                )}

            </Row>
            {/* <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6 ">
                    <label htmlFor="description">Mot de Passe</label>
                    <InputGroup className="custom-input-groupe">
                        <Input
                            id="password"
                            className="signup_input border_left"
                            placeholder={"Saisie votre mot de passe"}
                            type={toggletext ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroupText className="signup_input border_right">
                            <Eye size={18} style={{ cursor: 'pointer' }} className="color_grey " onClick={e => settoggleText(!toggletext)}
                            />
                        </InputGroupText>
                    </InputGroup>
                </div>
            </Row> */}
            {role === "employee" && (
                <Row className="custom-row">
                    <div className="field col-6 md:col-6 custom-col-6">
                        <label>nom</label>
                        <InputText
                            name="firstname"
                            value={firstname}
                            onChange={(e) => { setFirstname(e.target.value) }}
                            required
                        />
                    </div>
                    <div className="field col-6 md:col-6 custom-col-6">
                        <label>prénom</label>
                        <InputText
                            name="lastname"
                            value={lastname}
                            onChange={(e) => { setLastname(e.target.value) }}
                            required
                        />
                    </div>
                </Row>

            )}
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
export default AddUser;
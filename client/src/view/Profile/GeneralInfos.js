import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { GetUserByToken, UpdateUser } from "../../actions/user.action";
import { GetAllLabs } from "../../actions/labo.action";
import { Row } from "reactstrap";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "core-js/stable/atob";
import validateProfileUpdate from "../../validations/ValidateProfileUpdate";
import { jwtDecode } from "jwt-decode";
import Spinner from "../../components/Spinner"



function GeneralInfos() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [laboratories, setlaboratories] = useState([]);
    const [laboratoire, setLaboratoire] = useState(user.laboratoire?._id || '')
    const [role, setRole] = useState(user.role)

    const [phone, setPhone] = useState(user.phone)
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token)
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };
   
    
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token || token === 'null') {
                console.log("no token")
            } else {
                const decodedToken = decodeToken(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    console.log("token expired")
                    localStorage.removeItem('accessToken');
                    setUser({});
                }
                const { Backuser, is_connected } = await GetUserByToken();
                setUser(Backuser);


            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setLaboratoire(user.laboratoire?._id || '');
            setPhone(user.phone || '');
            setRole(user.role)

        }
    }, [user]);

    if (loading) {
        return <Spinner />;
    }
    const succ = () => {
        Navigate("/profile");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const Newuser = {
            email: email,
            phone: phone,
            role: user.role,
            approved: user.approved,
            laboratoire: laboratoire,
            username: user.username,
            ...(user.role === 'employee' ? {
                employee: {
                    firstname: user.employee.firstname,
                    lastname: user.employee.lastname
                }
            } : {}),

        }
        const { valid } = validateProfileUpdate(Newuser);
        if (valid) {
            await UpdateUser(user._id, Newuser, succ)
            window.location.reload();
        }

    }
    const handleCancel = () => {
        setEmail(user.email)
        setPhone(user.phone)
        setLaboratoire(user.laboratoire?._id)
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
                    <label>Phone Number*</label>
                    <InputText
                        name="phone"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}
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
                    label="Mettre à jour"
                    icon="pi pi-check"
                    className="p-button-submit"
                    onClick={handleSubmit}
                />

            </div>
        </>

    )
}
export default GeneralInfos;
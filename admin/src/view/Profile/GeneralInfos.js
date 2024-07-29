import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { GetUserByToken, UpdateUser } from "../../actions/user.action";
import { Row } from "reactstrap";
import { InputText } from "primereact/inputtext";
import Spinner from "../../components/Spinner"
import validateProfileUpdate from "../../validations/ValidateProfileUpdate";
import { Button } from "primereact/button";
function GeneralInfos() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
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
            setUsername(user.username || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    if (loading) {
        return <Spinner />;
    }
    const handleCancel = () => {
        setEmail(user.email)
        setUsername(user.username)
        setPhone(user.phone)
    }
    const handleSubmit = async () => {
        const UpdatedUser = {
            email: email,
            phone: phone,
            username: username,
            role: user.role,
            approved: user.approved,
        }
        const { valid } = validateProfileUpdate(UpdatedUser);
        if (valid) {
            await UpdateUser(user._id, UpdatedUser);
            window.location.reload();
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
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/Spinner"
import {
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row,
} from "reactstrap";
import { ChevronDown, Eye, Mail, Phone, User, MapPin, X } from "react-feather";
import { UpdatePass, GetUserByToken } from "../../actions/user.action"
function UpdatePassword() {
    const [old_password, setOldPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [toggletext1, settoggleText1] = useState(false)
    const [toggletext2, settoggleText2] = useState(false)
    const [new_password, setNewPassword] = useState("");
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
    const succ = () => {
        Navigate("/profile");
    };
    useEffect(() => {
        fetchData();
    }, []);
    if (loading) {
        return <Spinner />;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { old_password, new_password };
        console.log(data);
        UpdatePass(user._id, data, succ);
    };
    return (
       
                <Form className="mt-5" onSubmit={(e) => handleSubmit(e)}>
                    <Row>
                        <Col md={6} xs={12}>
                            <div className="mb-5">
                                <Label className="ps-3 pb-2 form-label signup_label" id="password">
                                    {"Ancien Mot de Passe"}
                                </Label>
                                <InputGroup className="border-0">
                                    <Input
                                        id="Oldpassword"
                                        className="signup_input border_left"
                                        placeholder={"Saisie votre mot de passe"}
                                        type={toggletext1 ? "text" : "password"}
                                        name="Oldpassword"
                                        value={old_password}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <InputGroupText className="signup_input border_right">
                                        <Eye size={18} style={{ cursor: 'pointer' }} className="color_grey " onClick={e => settoggleText1(!toggletext1)}
                                        />
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="mb-5">
                                <Label className="ps-3 pb-2 form-label signup_label" id="lastName">
                                    {"Nouveau Mot de Passe"}
                                </Label>
                                <InputGroup className="border-0">
                                    <Input
                                        id="newPassword"
                                        className="signup_input border_left"
                                        placeholder="Enter new password"
                                        name="newPassword"
                                        type={toggletext2 ? "text" : "password"}
                                        value={new_password}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <InputGroupText className="signup_input border_right">
                                        <Eye size={18} style={{ cursor: 'pointer' }} className="color_grey " onClick={e => settoggleText2(!toggletext2)}
                                        />
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    <div className="btn_container">
                        <button
                            className="signup_btn mb-2"
                            type="submit"
                        >
                            {"mettre à jour"}
                        </button>
                    </div>
                </Form>
         
    );
}
export default UpdatePassword;
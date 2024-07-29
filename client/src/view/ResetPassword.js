import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./login/styles.module.scss";
import { ResetPass } from "../actions/user.action"
import { Form, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import authBack from "../assets/images/authBack.jpg"
import { Mail } from "react-feather";
import "../assets/styles/login/login.css"

function ResetPassword() {
    const [email, setEmail] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email)
        ResetPass({ email }, () => { })
    };
    return (
        <>
            <div className={styles.auth_container}>
                <div className={styles.img_side}>
                    <img src={authBack} />
                    <div className={styles.overlay}>
                    </div>
                </div>
                <div className={styles.form_side}>
                    <div className="w-100  pt-5 text-center">
                        <h3 className="sigup_title title_forth">Mot de Passe oublié</h3>
                    </div>
                    <Form className="mt-5 pt-5">
                        <div className="mb-5">
                            <Label className="ps-3 pb-2 signup_label" id="email">
                                {"Email"}
                            </Label>
                            <InputGroup className="border-0">
                                <Input
                                    id="email"
                                    className="signup_input border_left"
                                    placeholder={"Saisie votre email"}
                                    name="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                                <InputGroupText className="signup_input border_right">
                                    <Mail size={18} className="color_grey " />
                                </InputGroupText>
                            </InputGroup>
                        </div>
                        <button
                            className="w-100 login_btn mb-2"
                            onClick={handleSubmit}
                        >
                            {"Envoyer"}
                        </button>
                    </Form>
                    <p className="signup_typo pb-5 pt-4">
                        <Link className="color_second" to={"/sign-in"}>
                            {"Connectez-vous ici"}

                        </Link>
                    </p>
                </div>
            </div>
        </>)
}

export default ResetPassword;
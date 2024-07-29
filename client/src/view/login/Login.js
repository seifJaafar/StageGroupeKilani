import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, InputGroup, InputGroupText, Label, Row, Col } from "reactstrap";
import { Eye, Mail } from "react-feather";
import { toast } from "react-hot-toast";
import { LoginUser } from "../../actions/user.action"
import authBack from "../../assets/images/authBack.jpg";

import styles from "../login/styles.module.scss";
import "../../assets/styles/login/login.css"
import { LoginValidation } from "../../validations/LoginValidation"

function Login() {
  const [toggletext, settoggleText] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handle_change = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = LoginValidation.isValidSync(user);
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs et verifier l'email");
    } else {
      console.log(user)
      LoginUser(user, () => { });
    }
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
            <h3 className="sigup_title title_forth">Connexion</h3>
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
                  value={user.email}
                  onChange={handle_change}
                />
                <InputGroupText className="signup_input border_right">
                  <Mail size={18} className="color_grey " />
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-5">
              <Label className="ps-3 pb-2 form-label signup_label" id="password">
                {"Mot de Passe"}
              </Label>
              <InputGroup className="border-0">
                <Input
                  id="password"
                  className="signup_input border_left"
                  placeholder={"Saisie votre mot de passe"}
                  type={toggletext ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handle_change}
                />
                <InputGroupText className="signup_input border_right">
                  <Eye size={18} style={{ cursor: 'pointer' }} className="color_grey " onClick={e => settoggleText(!toggletext)}
                  />
                </InputGroupText>
              </InputGroup>
            </div>
            <p className="signup_typo pb-5 pt-1" style={{ textAlign: "left", fontSize: "14px" }}>
              {"Vous avez oublié votre mot de passe ? "}
              <Link className="color_second" to={"/resetPassword"}>
                {"cliquez ici"}
              </Link>
            </p>
            <button
              className="w-100 login_btn mb-2"
              onClick={handleSubmit}
            >
              {"Connecter"}
            </button>

            <p className="signup_typo pb-5 pt-4">
              <Link className="color_second" to={"/sign-up"}>
                {"Créer un compte"}
              </Link>
            </p>


          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
import React, { useState, useEffect } from 'react';
import '../../assets/styles/SignUp.css'
import { Link } from "react-router-dom";
import authBack from "../../assets/images/authBack.jpg";
import { Navigate } from "react-router-dom";
import { Mail, Phone, User } from "react-feather";
import styles from "../signup/styles.module.scss";
import {
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import ReactCountryFlag from "react-country-flag"
import ARRAY_NUMBER from "../../assets/CountriesN"
import { GetAllLabs } from "../../actions/labo.action"
import { RegisterUser } from "../../actions/user.action"




function SignUp() {
    const [laboratoireCode, setLaboratoireCode] = useState('');
    const [laboratoireDesignation, setLaboratoireDesignation] = useState('');
    const [laboratoireID, setLaboratoireID] = useState('');
    const [codeModified, setCodeModified] = useState(true);
    const [designationModified, setDesignationModified] = useState(true);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [selected, setSelected] = useState(ARRAY_NUMBER[218]);
    const [selectedNum, setSelectedNum] = useState(null);
    const [Num, setNum] = useState(null);
    const [lastname, setLastname] = useState("");
    const [laboratories, setlaboratories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const succ = () => {
        Navigate("/sign-in");
    };
    const fetchDataLabs = async () => {
        const labs = await GetAllLabs();
        setlaboratories(labs.labs);
        console.log(laboratories);
    }
    useEffect(() => {
        fetchDataLabs();

    }, []);
    useEffect(() => {
        if (role === 'laboratoire') {
            setUsername(laboratoireDesignation);
        } else if (role === 'employee') {
            setUsername(`${firstname} ${lastname}`);
        }
    }, [role, laboratoireDesignation, firstname, lastname, laboratoireCode]);
    const handleCodeChange = (code) => {
        const selectedCode = code;
        setLaboratoireCode(selectedCode);
        const lab = laboratories.find(lab => lab.code === selectedCode);
        if (lab) {
            setLaboratoireDesignation(lab.designation);
            setLaboratoireID(lab._id);
        }
        setDesignationModified(false);
    };
    const handleDesignationChange = (desigantion) => {
        const selectedDesignation = desigantion;
        setLaboratoireDesignation(selectedDesignation);
        const lab = laboratories.find(lab => lab.designation === selectedDesignation);
        if (lab) {
            setLaboratoireCode(lab.code);
            setLaboratoireID(lab._id);
        }
        setCodeModified(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const Newuser = {
            email: email,
            phone: selected.code + Num,
            role: role,
            approved: false,
            laboratoire: laboratoireID,
            username: username,
            ...(role === 'employee' ? {
                employee: {
                    firstname: firstname,
                    lastname: lastname
                }
            } : {}),

        }
        console.log(Newuser)
        await RegisterUser(Newuser, succ)
    }
    return (
        <div className={styles.main}>
            <div className={styles.img_side}>
                <img src={authBack} />
                <div className={styles.overlay}>
                </div>
            </div>
            <div className={styles.form_side}>
                <div className="w-100 mt-lg-1 pt-0 mb-3">
                    <h3 className="sigup_title title_forth color_main">{"Inscription"}</h3>
                </div>
                <p className="sub_title_signup mb-4 title_3rd color_main">
                    {"Remplissez vos informations d'identification et cliquez sur le bouton 'Inscription' pour vous inscrire."}
                </p>
                <Form className="mt-5 w-100">
                    <Row>
                        <Col md={6} xs={12}>
                            <div className="pb-5">
                                <Label
                                    className="ps-3 pb-2 form-label signup_label"
                                    id="role"
                                >
                                    {"Profile"}
                                </Label>
                                <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={"down"}>
                                    <DropdownToggle caret size="lg" className='dropdownBtnStrap'> {!role ? ("Profile") : role} </DropdownToggle>
                                    <DropdownMenu className='dropdownMenuStrap' >
                                        <DropdownItem className='dropdownText' onClick={(event) => setRole("employee")}>Employee</DropdownItem>
                                        <DropdownItem className='dropdownText' onClick={(event) => setRole("laboratoire")}>Laboratoire</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="mb-5">
                                <Label
                                    className="ps-3 pb-2 form-label signup_label"
                                    id="username"
                                >
                                    {"Nom d'utilisateur"}
                                </Label>
                                <InputGroup className="border-0">
                                    <Input
                                        id="username"
                                        className={`signup_input border_left ${role ? 'disabled' : ''}`}
                                        placeholder={"Nom d'utilisateur"}
                                        name="username"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                        }
                                        }


                                    />
                                    <InputGroupText className=" border_right">
                                        <User size={18} className="color_grey " />
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} xs={12}>
                            <div className="mb-5">
                                <Label
                                    className="ps-3 pb-2 form-label signup_label"
                                    id="email"
                                >
                                    {"Email"}
                                </Label>
                                <InputGroup className="border-0">
                                    <Input
                                        id="email"
                                        className="signup_input border_left"
                                        placeholder={"Email"}
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }
                                        }
                                    />
                                    <InputGroupText className=" border_right">
                                        <Mail size={18} className="color_grey " />
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} xs={12}>
                            <div className="mb-5">
                                <Label className="ps-3 pb-2 form-label signup_label" id="email">
                                    {"Laboratoire"}
                                </Label>
                                <div className="dropdown dropdownField w-100  border-0  w-100">
                                    <button
                                        className="btn dropdown-toggle dropdown dropdownBtnCustom d-flex align-items-center justify-content-between w-100 title_second border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="button-text nav_link_style drop_down_title title_second">
                                            {!laboratoireCode ? ("Code") : (laboratoireCode)}
                                        </span>
                                    </button>
                                    {laboratories && (laboratories.length > 0) ? (
                                        <ul className="dropdown-menu nav_link_ul w-100">
                                            {laboratories.map((lab, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        handleCodeChange(lab.code);
                                                    }}
                                                    className={!codeModified ? 'disabled' : ''}
                                                >
                                                    <span
                                                        className="dropdown-item dropdownText nav_link_style_active title_second color_main discover_service_dropdown w-100"
                                                    >
                                                        {lab.code}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="dropdown-menu nav_link_ul w-100">
                                            <span className="dropdown-item dropdownText nav_link_style_active title_second color_main discover_service_dropdown w-100">
                                                Aucun laboratoire disponible
                                            </span>
                                        </div>
                                    )
                                    }
                                </div>

                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="mb-5">
                                <Label className="ps-3 pb-2 form-label signup_label" id="email">
                                    {"Designation du laboratoire"}
                                </Label>
                                <div className="dropdownField w-100  border-0 dropdown w-100">
                                    <button
                                        className="btn dropdown-toggle dropdown dropdownBtnCustom d-flex align-items-center justify-content-between w-100 title_second border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="button-text nav_link_style drop_down_title title_second">
                                            {!laboratoireDesignation ? ("Designation") : (laboratoireDesignation)}
                                        </span>
                                    </button>
                                    {laboratories.length > 0 ? (
                                        <ul className="dropdown-menu nav_link_ul w-100">
                                            {laboratories.map((lab, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        handleDesignationChange(lab.designation);
                                                    }}
                                                    className={!designationModified ? 'disabled' : ''}
                                                >
                                                    <span
                                                        className="dropdown-item dropdownText nav_link_style_active title_second color_main discover_service_dropdown w-100"
                                                    >
                                                        {lab.designation}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="dropdown-menu nav_link_ul w-100">
                                            <span className="dropdown-item dropdownText nav_link_style_active title_second color_main discover_service_dropdown w-100">
                                                No roles available
                                            </span>
                                        </div>
                                    )
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} xs={12}>
                            <div className="mb-5">
                                <Label
                                    className="ps-3 pb-2 form-label signup_label"
                                    id="phoneNumber"
                                >
                                    {"Numéro de téléphone"}
                                </Label>
                                <InputGroup className="border-0">
                                    <div className="btn-group">
                                        <button type="button" className="country_codeBtn border_right dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span  >


                                                {selectedNum ? "+" + selectedNum : "+" + selected.code}
                                            </span>
                                        </button>
                                        <ul className="dropdown-menu" style={{ height: "250px", overflowY: "scroll" }}>
                                            {ARRAY_NUMBER.map((x, index) => {

                                                return (
                                                    <li key={index} onClick={e => { setSelectedNum(null); setSelected(x) }}><span className="dropdown-item" style={{
                                                        border: "1px solid #f4f4f4",
                                                        padding: " 1.2rem",
                                                        fontSize: "16px"
                                                    }}>

                                                        <ReactCountryFlag
                                                            countryCode={x.iso}
                                                            svg
                                                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                            cdnSuffix="svg"
                                                            title={x.iso}
                                                            style={{ marginRight: "1rem", borderRadius: "50%", height: "auto", width: "24px" }}

                                                        />
                                                        {"+" + x.code}</span></li>

                                                )
                                            }
                                            )}
                                        </ul>

                                    </div>
                                    <Input
                                        id="phone"
                                        className="signup_input border_left"
                                        placeholder={"Numéro de téléphone"}
                                        name="tel"
                                        type="number"
                                        value={Num}
                                        onChange={(e) => { setNum(e.target.value); console.log(Num) }}
                                    />
                                    <InputGroupText className="signup_input border_right">
                                        <Phone size={18} className="color_grey " />
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </Col>
                    </Row>
                    {role === "employee" && (
                        <Row>
                            <Col md={6} xs={12}>
                                <div className="mb-5">
                                    <Label
                                        className="ps-3 pb-2 form-label signup_label"
                                        id="firstname"
                                    >
                                        {"Nom d'utilisateur"}
                                    </Label>
                                    <InputGroup className="border-0">
                                        <Input
                                            id="firstname"
                                            className="signup_input border_left"
                                            placeholder={"prénom"}
                                            name="firstname"
                                            value={firstname}
                                            onChange={(e) => {
                                                setFirstname(e.target.value);
                                            }
                                            }
                                        />
                                        <InputGroupText className=" border_right">
                                            <User size={18} className="color_grey " />
                                        </InputGroupText>
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div className="mb-5">
                                    <Label
                                        className="ps-3 pb-2 form-label signup_label"
                                        id="lastname"
                                    >
                                        {"Nom de famille"}
                                    </Label>
                                    <InputGroup className="border-0">
                                        <Input
                                            id="lastname"
                                            className="signup_input border_left"
                                            placeholder={"Nom de famille"}
                                            name="lastname"
                                            value={lastname}
                                            onChange={(e) => {
                                                setLastname(e.target.value);
                                            }
                                            }
                                        />
                                        <InputGroupText className=" border_right">
                                            <User size={18} className="color_grey " />
                                        </InputGroupText>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                    )

                    }
                    <button
                        className="w-100 signup_btn mb-2"
                        onClick={(e) => handleSubmit(e)}
                    >
                        {"s'inscrire"}
                    </button>
                </Form>
                <p className="signup_typo pb-5 pt-4">
                    <Link className="color_second" to={"/sign-in"}>
                        {"Vous avez deja un compte?  "}
                        <span style={{ color: "#023047" }}>Connectez-vous ici</span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
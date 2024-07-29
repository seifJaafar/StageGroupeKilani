import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ArrowLeft } from "react-feather";
import { useMediaQuery } from "react-responsive";
import { Col, Progress, Row } from "reactstrap";
import "../assets/styles/Profile.css";
import GeneralInfos from "./Profile/GeneralInfos";
import UpdatePassword from "./Profile/UpdatePassword";

function Profile() {
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");
    return (
        <div className="container_1">
            <div className="layout-content">
                <Row>
                    <Col md={8} xs={12} className={`profile_card_container ps-4 mt-5 ${isMobile ? "d-flex flex-column align-items-center" : ""}`}>
                        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap  ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                            <Tab eventKey="1" title={"Informations Générales"}>
                                <GeneralInfos />
                            </Tab>
                            <Tab eventKey="2" title={"Changer Mot de Passe"} >
                                <UpdatePassword />
                            </Tab>

                        </Tabs>
                    </Col>
                </Row>
            </div>
        </div>
    )
};
export default Profile;
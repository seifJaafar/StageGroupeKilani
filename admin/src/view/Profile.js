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
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Infos génerale"} >
                        <GeneralInfos />
                    </Tab>
                    <Tab eventKey="2" title={"Changer Mot de passe"} >
                        <UpdatePassword />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
};
export default Profile;
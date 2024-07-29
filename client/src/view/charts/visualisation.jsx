import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import VisualisationDetaille from "./visualisationDetaille";
import VisualisationGeneral from "./visualisationGeneral";
function Visualisation(props) {
    const [key, setKey] = useState("1");
    const { laboratoire } = props;
    const isMobile = useMediaQuery({ maxWidth: 992 });
    return (

        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                <Tab eventKey="1" title={"Visualisation en detaille"} >
                    <VisualisationDetaille laboratoire={laboratoire} />
                </Tab>
                <Tab eventKey="2" title={"Visualisation generale"} >
                    <VisualisationGeneral laboratoire={laboratoire} />
                    </Tab>
            </Tabs>
            </div>
        </div >

    )
}
export default Visualisation;
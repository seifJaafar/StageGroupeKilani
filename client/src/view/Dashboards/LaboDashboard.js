import LabSideBar from "../../partials/LabSideBar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../../partials/SidebarContext";
function LaboDashboard() {
    return (
        <>
            <SidebarProvider>
                <LabSideBar />
                <Outlet />
            </SidebarProvider>
        </>
    )
}
export default LaboDashboard;
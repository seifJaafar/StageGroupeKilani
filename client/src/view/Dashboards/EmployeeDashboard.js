import SideBar from "../../partials/SideBar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../../partials/SidebarContext";


function EmployeeDashboard() {
    return (
        <>
            <SidebarProvider>
                <SideBar/>
                <Outlet />
            </SidebarProvider>
        </>
    )
}
export default EmployeeDashboard;
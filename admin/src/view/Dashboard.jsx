import SideBar from "../partials/SideBar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../partials/SidebarContext";


function Dashboard() {
    return (
        <>
            <SidebarProvider>
                <SideBar />
                <Outlet />
            </SidebarProvider>
        </>
    )
}
export default Dashboard;
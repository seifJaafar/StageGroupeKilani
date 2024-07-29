import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import NavList from "./NavMenu";
import "../assets/styles/Sidebar.css";

function SideBar() {
    const [selected, setSelected] = useState('Dashboard');
    const { collapsed } = useContext(SidebarContext);
    const logout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    };
    return (
        <>
            <div className="d-flex flex-column justify-content-between">
                <aside id="sidebar" className={`sidebar ${collapsed ? ' collapsed' : ''}`}>
                    <div>
                        <h1 className="sidebar-header text-center">Medicis</h1>
                        <ul className="sidebar-nav" id="sidebar-nav">
                            {NavList.map((item) => {
                                return (
                                    <li key={item._id} className={selected === item.name ? 'selected' : ''}>
                                        <Link className="nav-link" to={item.link} onClick={() => setSelected(item.name)}>
                                            <i className={item.icon}></i>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div>
                        <ul className="sidebar-nav" id="sidebar-nav">
                            <li className={selected === "Logs" ? 'selected' : ''}>
                                <Link className="nav-link" to="/logs">
                                    <i className="fa-solid fa-box-archive"></i>
                                    <span>Logs</span>
                                </Link>
                            </li>
                            <li className={selected === "Settings" ? 'selected' : ''}>
                                <Link className="nav-link" to="/profile">
                                    <i className="fa-solid fa-cog"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li className={selected === "logout" ? 'selected' : ''}>
                                <Link className="nav-link" to="/" onClick={() => { logout() }}>
                                    <i className="fa-solid fa-sign-out"></i>
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </>
    )
}
export default SideBar;
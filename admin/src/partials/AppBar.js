import React, { useContext } from 'react';
import { SidebarContext } from './SidebarContext';

const AppBar = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">App Bar</a>
      <button className="btn btn-outline-primary" onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
    </nav>
  );
};

export default AppBar;

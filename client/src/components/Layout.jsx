import React from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
    const location = useLocation();
    const outlet = useOutlet();

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <AnimatePresence mode="wait">
                    {/* The cloneElement forces ONLY the page to trigger AnimatePresence, leaving Sidebar static */}
                    {outlet && React.cloneElement(outlet, { key: location.pathname })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Layout;

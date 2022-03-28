import React from 'react';
import { Outlet } from "react-router-dom";
import Top from './Top';
import Footer from './Footer';
import './style/generic.scss';

const Layout = () => (
    <div className='wrapper'>
        <div className='conten-wrapper'>
            <Top />
            <Outlet />
        </div>
        <Footer />
    </div>
)

export default Layout;
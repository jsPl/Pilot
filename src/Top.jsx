import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Menu } from "antd";
import { CompassOutlined, DollarCircleOutlined, HomeOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";

const getPathNameFromLocationOrDefault = (location) => {
    const pathName = location?.pathname.slice(1, location?.pathname.length);
    return pathName === '' ? 'home' : pathName.split('/')[0];
}


const Top = () => {
    const location = useLocation();
    const pathName = getPathNameFromLocationOrDefault(location);
    const [current, setCurrent] = useState(pathName);
    useEffect(() => { 
        setCurrent(pathName)
    }, [location.pathname]);

    const handleClick = (e) => {
        setCurrent(e.key)
    }

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" theme="dark">
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to='/'>Home</Link>
            </Menu.Item>
            <Menu.Item key="pilots" icon={<TeamOutlined />}>
                <Link to='pilots'>Pilots</Link>
            </Menu.Item>
            <Menu.Item key="tours" icon={<CompassOutlined />}>
                <Link to='tours'>Tours</Link>
            </Menu.Item>
            <Menu.Item key="expenses" icon={<DollarCircleOutlined />}>
                <Link to='expenses'>Expenses</Link>
            </Menu.Item>
            <Menu.Item key="contact" icon={<MailOutlined />}>
                <Link to='contact'>Contact</Link>
            </Menu.Item>
        </Menu>
    )
}

export default Top;
import React from "react";
import {Button} from "antd";
import {RightCircleOutlined} from '@ant-design/icons';
import landscape from "../landscape.jpg";
import '../style/generic.scss';

const Banner = () =>
    <div>
        <img className='banner' src={landscape} alt='mountains landscape'/>
        <div className='banner-title'>
            <h1>Pilots, trips, expenses in one place for your business</h1>
            <Button type="primary" shape="round" icon={<RightCircleOutlined />} size='large'>
                Start
            </Button>
        </div>

    </div>

export default Banner;
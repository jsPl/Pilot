import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Card } from 'antd';
import { SortAscendingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PilotModal from './PilotModal';

const Pilots = () => {

    const [pilots, setPilots] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3004/pilots")
            .then(r => r.json())
            .then(data => setPilots(data))
    }, []
    )

    return (
        <div className='pilots'>
            <div className='container'>
                <div className='pilots-display-flex'>
                    {pilots && pilots.filter((el, indx) => indx <= 2).map(el => <Pilot key={el.id} pilotData={el} />)}
                </div>
                <div className='pilots-buttons'>
                    <PilotModal setPilots={setPilots} modalTitle='Add new pilot' actionButton={showModal => (
                        <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={showModal}>
                            Add new pilot
                        </Button>)}
                    />
                    {pilots.length > 3 &&
                        <Link to='pilots'>
                            <Button type="secondary" shape="round" icon={<SortAscendingOutlined />} size='large' style={{ marginLeft: '50px' }}>
                                See all pilots
                            </Button>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

const Pilot = ({ pilotData }) => {
    const { Meta } = Card;
    const { name, email, comment, picture } = pilotData;
    return (
        <Card hoverable
            style={{ width: 240, textAlign: 'center' }}
            cover={<Avatar size={100} src={picture} />}>
            <Meta title={name} description={email} />
            <p>{comment}</p>
        </Card>
    )
}

export default Pilots;
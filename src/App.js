import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import './App.scss';
import Layout from './Layout';
import Home from './Home';
// import Pilots from './Pilots/Pilots';
import AllPilots from './Pilots/AllPilots';
import AllTours from './Tours/AllTours';
import TourModal from './Tours/TourModal';
import Expenses from './Expenses/Expenses';
import Contact from './Contact/Contact';
import PilotModal from "./Pilots/PilotModal";
import TourExpenses from './Tours/TourExpenses';

export default function App() {
    let navigate = useNavigate();

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='pilots' element={<AllPilots />} />
                <Route path='pilots/:pilotId' element={
                    <PilotModal setPilots={() => { }} modalDefaultVisible={true}
                        modalTitle='Edit pilot' onModalClose={() => navigate('/pilots')}
                    />
                } />

                <Route path='tours' element={<AllTours />} />
                <Route path='tours/:tourId' element={
                    <TourModal setTours={() => { }} modalDefaultVisible={true}
                        modalTitle='Edit tour' onModalClose={() => navigate('/tours')}
                    />
                } />
                <Route path='tours/:tourId/expenses' element={<TourExpenses/>}/>
                <Route path='expenses' element={<Expenses />} />
                <Route path='contact' element={<Contact />} />
            </Route>
        </Routes>
    );
}


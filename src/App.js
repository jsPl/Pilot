import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import './App.scss';
import Layout from './Layout';
import Home from './Home';
// import Pilots from './Pilots/Pilots';
import AllPilots from './Pilots/AllPilots';
import Tours from './Tours/Tours';
import Expenses from './Expenses/Expenses';
import Contact from './Contact/Contact';
import PilotModal from "./Pilots/PilotModal";

export default function App() {
    let navigate = useNavigate();

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='pilots' element={<AllPilots />}>
                    <Route path=':pilotId' element={
                        <PilotModal modalDefaultVisible={true} modalTitle='Edit pilot' onModalClose={() => navigate('/pilots')} />
                    } />
                    <Route path='new' element={
                        <PilotModal modalDefaultVisible={true} modalTitle='Add new pilot' onModalClose={() => navigate('/pilots')} />
                    } />
                </Route>

                <Route path='tours' element={<Tours />} />
                <Route path='expenses' element={<Expenses />} />
                <Route path='contact' element={<Contact />} />
            </Route>
        </Routes>
    );
}
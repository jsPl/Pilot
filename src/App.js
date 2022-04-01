import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import './App.scss';
import Layout from './Layout';
import Home from './Home';
import AllPilots from './Pilots/AllPilots';
import AllTours from './Tours/AllTours';
import TourModal from './Tours/TourModal';
import Expenses from './Expenses/Expenses';
import Contact from './Contact/Contact';
import PilotModal from "./Pilots/PilotModal";
import TourExpenses from './Tours/TourExpenses';
import ExpenseModal from './Expenses/ExpenseModal';

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

                <Route path='tours' element={<AllTours />}>
                    <Route path=':tourId' element={
                        <TourModal modalDefaultVisible={true} modalTitle='Edit tour' onModalClose={() => navigate('/tours')} />
                    } />
                    <Route path='new' element={
                        <TourModal modalDefaultVisible={true} modalTitle='Add new tour' onModalClose={() => navigate('/tours')} />
                    } />
                </Route>

                <Route path='tours/:tourId/expenses' element={<TourExpenses/>}>
                    <Route path='new' 
                        element={<ExpenseModal modalTitle='Add new expense' modalDefaultVisible={true} onModalClose={() => navigate(-1)}/>}
                    />
                    <Route path=':expenseId' 
                        element={<ExpenseModal modalTitle='Edit expense' modalDefaultVisible={true} onModalClose={() => navigate(-1)}/>}
                    />
                </Route>

                <Route path='expenses' element={<Expenses />} />
                <Route path='contact' element={<Contact />} />
            </Route>
        </Routes>
    );
}
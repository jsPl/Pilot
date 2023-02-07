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
                        <PilotModal modalTitle='Edit pilot' />
                    } />
                    <Route path='new' element={
                        <PilotModal modalTitle='Add new pilot' />
                    } />
                </Route>

                <Route path='tours' element={<AllTours />}>
                    <Route path=':tourId' element={
                        <TourModal modalTitle='Edit tour' />
                    } />
                    <Route path='new' element={
                        <TourModal modalTitle='Add new tour' />
                    } />
                </Route>

                <Route path='tours/:tourId/expenses' element={<TourExpenses />}>
                    <Route path='new' element={<ExpenseModal title='Add new expense' />} />
                    <Route path=':expenseId' element={<ExpenseModal title='Edit expense' />} />
                </Route>

                <Route path='expenses' element={<Expenses />} />
                <Route path='contact' element={<Contact />} />
            </Route>
        </Routes>
    );
}
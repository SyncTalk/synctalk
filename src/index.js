// Qingyue Zhu
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter';
import './App.css';

const root = createRoot(document.getElementById('root'));

root.render(<AppRouter></AppRouter>)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Gerador from './pages/Gerador';
import Restauracao from './pages/Restauracao';
import Galeria from './pages/Galeria';
import Treinamento from './pages/Treinamento';
import GanharDinheiro from './pages/GanharDinheiro';
import Admin from './pages/Admin';
import Configuracoes from './pages/Configuracoes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" richColors />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gerador" element={<Gerador />} />
          <Route path="/restauracao" element={<Restauracao />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/treinamento" element={<Treinamento />} />
          <Route path="/ganhar-dinheiro" element={<GanharDinheiro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

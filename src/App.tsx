import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page principale — accueil (restaurant + rooftop) */}
        <Route path="/" element={<Home />} />
        {/* Page Menu Digital — partageable (QR Code, créatrice de contenu) */}
        <Route path="/menu" element={<Menu />} />
        {/* Toute autre URL inconnue redirige vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

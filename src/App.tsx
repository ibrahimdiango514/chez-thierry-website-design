import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page principale — accueil (restaurant + rooftop + pause gourmande + apéro) */}
        <Route path="/" element={<Home />} />
        {/* Accès directs aux rubriques du site */}
        <Route path="/pause-gourmande" element={<Home />} />
        <Route path="/sweet-break" element={<Home />} />
        <Route path="/nos-apres-midis-apero" element={<Home />} />
        <Route path="/apero" element={<Home />} />
        <Route path="/plats-du-jour" element={<Home />} />
        {/* Page Menu Digital — partageable (QR Code) */}
        <Route path="/menu" element={<Menu />} />
        {/* Toute autre URL inconnue redirige vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

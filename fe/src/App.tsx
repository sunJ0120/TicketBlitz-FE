import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuthCallback from "./pages/OAuthCallback.tsx";

function HomePage() {
  return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">TICKETBLITZ</h1>
          <p className="text-zinc-400 text-xl">콘서트 티켓팅 서비스</p>
        </div>
      </div>
  );
}

export default function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </BrowserRouter>
  );
}